import { makeAutoObservable, configure } from 'mobx';
import fscreen from 'fscreen';
import { delayMsAsync, delayNextFrame } from '../utils/functions';
import { MouseEventHandler } from 'react';

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
    });
  }

  setInitialState = () => {
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
  };

  setVideoElement = (videoElement: HTMLVideoElement) => {
    this.videoElement = videoElement;
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', this.updateDuration);
      videoElement.addEventListener('ended', this.handleEnd);
    }
  };

  setVideoContainer = (videoContainer: HTMLDivElement) => {
    this.videoContainer = videoContainer;
    fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange);
  };
  
  cleanUp = () => {
    this.videoElement?.removeEventListener('loadedmetadata', this.updateDuration);
    this.videoElement?.removeEventListener('ended', this.handleEnd);
    this.videoContainer?.removeEventListener('fullscreenchange', this.handleFullscreenChange);

    this.videoElement = null;
    this.videoContainer = null;
  };

  setUserAsIdle = () => {
    if (this.videoIsPlaying) {
      this.userIsIdle = true;
    }
  };

  handleEnd = () => {
    this.videoIsPlaying = false;
  };

  updateTime = () => {
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

  handlePlayPause = () => {
    if (!this.videoElement) return;

    if (this.videoElement.paused || this.videoElement.ended) {
      this.videoElement.play();
      this.videoIsPlaying = true;
      this.updateTime();
    } else {
      this.videoElement.pause();
      this.videoIsPlaying = false;
    }
  };

  handlePreviewSeek: MouseEventHandler = (event) => {
    const targetElement = event.currentTarget;
    const { width, left } = targetElement.getBoundingClientRect();

    if (!this.videoContainer || this.seekIsPending) return;
    this.seekHoverPositionPercent = (event.pageX - left) * 100 / width;
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

  startPreviewSeek: MouseEventHandler = (event) => {
    this.handlePreviewSeek(event);
    this.previewPeekIsActive = true;
  };

  cancelPreviewSeek: MouseEventHandler = (event) => {
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

  handleFullscreen = (): void => {
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

  handleVolumeChange = (event: React.ChangeEvent<{}>, newVolume: number | number[]): void => {
    if (typeof newVolume !== 'number') return;
    if (!this.videoElement || newVolume < 0 || newVolume > 1 || !Number.isFinite(newVolume)) return;

    this.videoElement.volume = newVolume;
    this.volumeLevel = newVolume;
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
    this.handlePlayPause();
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