import { makeAutoObservable, configure, flowResult } from 'mobx';
import fscreen from 'fscreen';
import { MouseEventHandler } from 'react';
import { CancellablePromise } from 'mobx/dist/api/flow';

import { delayMsAsync, delayNextFrame } from '../utils/functions';

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
});

class VideoStore {
  videoElement: HTMLVideoElement | null = null;
  videoContainer: HTMLDivElement | null = null;
  pendingControlHideHandler: CancellablePromise<void> | null = null;
  videoIsPlaying = false;
  volumeLevel = 1;
  volumeIsMuted = false;
  currentPositionSeconds = 0;
  durationSeconds = 0;
  fullscreenIsActive = false;
  videoClickAnimationDisplaying = false;
  userIsIdle = false;
  seekIsPending = false;
  videoWasPlayingBeforeSeek = false;
  seekHoverPositionPercent = 0;
  previewPeekIsActive = false;
  pointerIsHovering = false;
  handleVideoClick = function*() { (yield Promise.resolve(0)) as void; };
  setUserAsActive = function*() { (yield Promise.resolve(0)) as void; };

  constructor() {
    this.setInitialState();

    makeAutoObservable(this, {
      videoElement: false,
      videoContainer: false,
      setVideoElement: false,
      cleanUp: false,
      videoWasPlayingBeforeSeek: false,
      handleKeys: false,
      pendingControlHideHandler: false,
    });

    document.addEventListener('keydown', this.handleKeys);
  }

  setInitialState = (): void => {
    this.videoIsPlaying = false;
    this.volumeLevel = 1;
    this.volumeIsMuted = false;
    this.currentPositionSeconds = 0;
    this.durationSeconds = 0;
    this.fullscreenIsActive = false;
    this.videoClickAnimationDisplaying = false;
    this.userIsIdle = false;
    this.seekIsPending = false;
    this.videoWasPlayingBeforeSeek = false;
    this.seekHoverPositionPercent = 0;
    this.previewPeekIsActive = false;
    this.pointerIsHovering = false;
    this.handleVideoClick = this.handleVideoClickFlow.bind(this);
    this.setUserAsActive = this.setUserAsActiveFlow.bind(this);
    this.pendingControlHideHandler = null;
  };

  handleKeys = (event: KeyboardEvent): void => {
    this.activateControlsHandler();

    switch (event.key) {
      // Playback control
      case 'k':
      case ' ': return this.togglePlayback();

      // Skip to segment
      case '1': return this.handleSkipPercent(10);
      case '2': return this.handleSkipPercent(20);
      case '3': return this.handleSkipPercent(30);
      case '4': return this.handleSkipPercent(40);
      case '5': return this.handleSkipPercent(50);
      case '6': return this.handleSkipPercent(60);
      case '7': return this.handleSkipPercent(70);
      case '8': return this.handleSkipPercent(80);
      case '9': return this.handleSkipPercent(90);

      // Skip control
      case '0':
      case 'Home': return this.handleReset();
      
      case 'End': return this.handleEnd();

      case 'ArrowRight': return this.handleSkipForward(5);
      case 'l': return this.handleSkipForward(10);

      case 'ArrowLeft': return this.handleSkipBackward(5);
      case 'j': return this.handleSkipBackward(10);

      // Volume control
      case 'ArrowUp': return this.handleVolumeIncrease();
      
      case 'ArrowDown': return this.handleVolumeDecrease();

      case 'm': return this.toggleVolume();
      
      // Full-screen control
      case 'f': return this.toggleFullscreen();
    }
  };

  activateControlsHandler = () => {
    // Cancel any existing scheduled hiding of video controls 
    this.pendingControlHideHandler?.cancel();

    const pendingHideHandle = flowResult(this.setUserAsActive());
    pendingHideHandle.catch(() => null);
    this.pendingControlHideHandler = pendingHideHandle;
  };
  
  hideControlsHandler = () => {
    // Cancel any existing scheduled hiding of video controls
    this.pendingControlHideHandler?.cancel();
    this.pendingControlHideHandler = null;

    this.setUserAsIdle();
  };

  setVideoElement = (videoElement: HTMLVideoElement): void => {
    this.videoElement = videoElement;
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', this.updateDuration);
      videoElement.addEventListener('ended', this.handleEnd);
    }
  };

  setVideoContainer = (videoContainer: HTMLDivElement): void => {
    this.videoContainer = videoContainer;
    fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange);
  };
  
  cleanUp = (): void => {
    this.videoElement?.removeEventListener('loadedmetadata', this.updateDuration);
    this.videoElement?.removeEventListener('ended', this.handleEnd);
    this.videoContainer?.removeEventListener('fullscreenchange', this.handleFullscreenChange);

    this.videoElement = null;
    this.videoContainer = null;
  };

  setUserAsIdle = (): void => {
    if (this.videoIsPlaying) {
      this.userIsIdle = true;
    }
  };

  handleReset = (): void => {
    this.currentPositionSeconds = 0;
    this.videoIsPlaying = false;
  };
  
  handleEnd = (): void => {
    this.currentPositionSeconds = this.durationSeconds;
    this.videoIsPlaying = false;
  };

  handleSkipPercent = (percent: number = 10): void => {
    if (!this.videoElement || percent < 1 || percent > 99) return;

    const newTime = percent * this.durationSeconds / 100;
    this.currentPositionSeconds = newTime;
    this.videoElement.currentTime = newTime;
  };

  handleSkipForward = (skipAmountSeconds: number = 5): void => {
    if (!this.videoElement) return;

    const newTime = this.currentPositionSeconds + skipAmountSeconds;
    if (newTime > this.durationSeconds) {
      return this.handleEnd();
    }

    this.currentPositionSeconds = newTime;
    this.videoElement.currentTime = newTime;
  };

  handleSkipBackward = (skipAmountSeconds: number = 5): void => {
    if (!this.videoElement) return;

    const newTime = this.currentPositionSeconds - skipAmountSeconds;
    if (newTime < 0) {
      return this.handleReset();
    }

    this.currentPositionSeconds = newTime;
    this.videoElement.currentTime = newTime;
  };

  updateTime = (): void => {
    if (!this.videoElement) return;

    // In some mobile browsers, when loadedmetadata is raised, if it is raised at all,
    // the duration may not have the correct value, or even any value at all so we
    // check again here
    if (!this.durationSeconds) this.updateDuration();

    this.currentPositionSeconds = this.videoElement.currentTime;

    // While the video keeps playing we update the progress bar once for every rendered frame
    if (!this.videoElement.paused && !this.videoElement.ended) {
      window.requestAnimationFrame(this.updateTime);
    }
  };

  updateDuration = (): void => {
    if (!this.videoElement) return;

    this.durationSeconds = Math.floor(this.videoElement.duration);
  };

  togglePlayback = (): void => {
    if (!this.videoElement) return;

    if (this.videoElement.paused || this.videoElement.ended) {
      this.handlePlay();
    } else {
      this.handlePause();
    }
  };

  handlePlay = (): void => {
    if (!this.videoElement) return;

    if (this.videoElement.paused || this.videoElement.ended) {
      this.videoElement.play();
      this.videoIsPlaying = true;
      this.updateTime();
    }
  };

  handlePause = (): void => {
    if (!this.videoElement) return;

    if (!this.videoElement.paused && !this.videoElement.ended) {
      this.videoElement.pause();
      this.videoIsPlaying = false;
    }
  };

  handlePreviewSeek: MouseEventHandler = (event) => {
    const targetElement = event.currentTarget;
    const { width, left } = targetElement.getBoundingClientRect();

    if (!this.videoContainer || this.seekIsPending) return;
    this.seekHoverPositionPercent = Math.max((event.pageX - left) * 100 / width, 0);
  };

  get seekHoverPositionSeconds(): number {
    const hoverTime = this.seekHoverPositionPercent * this.durationSeconds / 100;
    return this.seekIsPending ? this.currentPositionSeconds : hoverTime;
  }

  get seekHoverPositionPercentClamped(): number {
    const currentTimePercent = this.currentPositionSeconds * 100 / this.durationSeconds;
    const hoverPercent = this.seekIsPending ? currentTimePercent : this.seekHoverPositionPercent;
    return Math.max(5, Math.min(hoverPercent, 95));
  }

  startPreviewSeek: MouseEventHandler = (event): void => {
    this.handlePreviewSeek(event);
    this.previewPeekIsActive = true;
  };

  cancelPreviewSeek: MouseEventHandler = (event): void => {
    this.seekHoverPositionPercent = 0;
    this.previewPeekIsActive = false;
  };

  handleSeek = (event: React.ChangeEvent<{}>, newTime: number | number[]): void => {
    if (typeof newTime !== 'number') return;
    if (!this.videoElement || !['mousedown', 'mouseup', 'mousemove'].includes(event.type)) return;

    const isMouseDown = (event.type === 'mousedown');
    const isMouseUp = (event.type === 'mouseup');

    if (isMouseDown) {
      if (!this.videoElement.paused && !this.videoElement.ended) {
        this.videoElement.pause();
        this.videoIsPlaying = false;
        this.videoWasPlayingBeforeSeek = true;
      } else {
        this.videoWasPlayingBeforeSeek = false;
      }
      this.seekIsPending = true;
    } else if (isMouseUp) {
      if (this.videoWasPlayingBeforeSeek) {
        this.videoElement.play();
        this.videoIsPlaying = true;
        this.updateTime();
      }
      this.seekIsPending = false;
    }

    // Update position on mouse down, up and move events
    this.videoElement.currentTime = newTime;
    this.currentPositionSeconds = newTime;
  };

  toggleFullscreen = (): void => {
    if (fscreen.fullscreenEnabled && this.videoContainer) {
      if (this.fullscreenIsActive && fscreen.fullscreenElement) {
        fscreen.exitFullscreen();
      } else {
        fscreen.requestFullscreen(this.videoContainer);
      }
    }
  };

  handleFullscreenChange = (): void => {
    if (fscreen.fullscreenEnabled && this.videoContainer) {
      if (fscreen.fullscreenElement) {
        this.fullscreenIsActive = true;
        document.documentElement.style.fontSize = "150%";
      } else {
        this.fullscreenIsActive = false;
        document.documentElement.style.fontSize = "100%";
      }
    }
  };

  handleVolumeIncrease = (increaseAmount: number = 5): void => {
    if (!this.videoElement) return;

    let newVolume = this.volumeLevel + increaseAmount;
    if (newVolume > 100) {
      newVolume = 100;
    }
    
    this.volumeLevel = newVolume;
    this.videoElement.volume = newVolume / 100;
  };

  handleVolumeDecrease = (decreaseAmount: number = 5): void => {
    if (!this.videoElement) return;

    let newVolume = this.volumeLevel - decreaseAmount;
    if (newVolume < 0) {
      newVolume = 0;
    }

    this.volumeLevel = newVolume;
    this.videoElement.volume = newVolume / 100;
  };

  handleVolumeChange = (event: React.ChangeEvent<{}>, newVolume: number | number[]): void => {
    if (typeof newVolume !== 'number') return;
    if (!this.videoElement || newVolume < 0 || newVolume > 100 || !Number.isFinite(newVolume)) return;

    this.volumeLevel = newVolume;
    this.videoElement.volume = newVolume / 100;
  };

  toggleVolume = (): void => {
    if (!this.videoElement) return;
    
    this.volumeIsMuted = !this.volumeIsMuted;
    this.videoElement.muted = this.volumeIsMuted;
  };
 
  handlePlaybackSpeedChange = (speed: number): void => {
    if (!this.videoElement || speed < 0 || speed > 2 || !Number.isFinite(speed)) return;
    
    this.videoElement.playbackRate = speed;
  };

  handleVolumeOnHover = (): void => {
    this.pointerIsHovering = true;
  }

  handleVolumeOnHoverExit = (): void => {
    this.pointerIsHovering = false;
  }

  *handleVideoClickFlow(): Generator<Promise<number>, void, void> {
    this.togglePlayback();
    this.videoClickAnimationDisplaying = true;
    
    yield delayNextFrame();
    this.videoClickAnimationDisplaying = false;
  };

  *setUserAsActiveFlow(): Generator<Promise<number>, void, void> {
    this.userIsIdle = false;

    yield delayMsAsync(4000);
    this.setUserAsIdle();
  };
}

export default VideoStore;