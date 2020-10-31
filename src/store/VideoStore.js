import { makeAutoObservable, configure } from 'mobx';
import fscreen from 'fscreen';
import { delayMsAsync } from '../utils/functions';

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
});

class VideoStore {
  videoElement = null;
  videoContainer = null;
  progressMarginPixels = 16;

  constructor() {
    this.setInitialState();

    makeAutoObservable(this, {
      videoElement: false,
      videoContainer: false,
      setVideoElement: false,
      cleanUp: false,
      videoWasPlayingBeforeSeek: false,
      progressMarginPixels: false,
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
  };

  setVideoElement = (videoElement) => {
    this.videoElement = videoElement;
    videoElement.addEventListener('loadedmetadata', this.updateDuration);
    videoElement.addEventListener('timeupdate', this.updateTime);
    videoElement.addEventListener('ended', this.handleEnd);
  };

  setVideoContainer = (videoContainer) => {
    this.videoContainer = videoContainer;
  };
  
  cleanUp = () => {
    this.videoElement.removeEventListener('loadedmetadata', this.updateDuration);
    this.videoElement.removeEventListener('timeupdate', this.updateTime);
    this.videoElement.removeEventListener('ended', this.handleEnd);

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
  };

  updateDuration = () => {
    if (!this.videoElement) return;

    this.durationSeconds = Math.floor(this.videoElement.duration);
  };

  handlePlayPause = () => {
    if (!this.videoElement) return;

    if (this.videoElement.paused || this.videoElement.ended) {
      this.videoElement.play();
      this.videoIsPlaying = true;
    } else {
      this.videoElement.pause();
      this.videoIsPlaying = false;
    }
  };

  handlePreviewSeek = (event) => {
    if (!this.videoContainer || event.target.offsetWidth < 15) return;

    const progressLeftOffset = this.videoContainer.offsetLeft + this.progressMarginPixels;
    this.seekHoverPositionPercent = (event.pageX - progressLeftOffset) * 100 / event.target.offsetWidth;
  };

  get seekHoverPositionSeconds() {
    return this.seekHoverPositionPercent * this.durationSeconds / 100;
  }

  get seekHoverPositionPercentClamped() {
    return Math.max(5, Math.min(this.seekHoverPositionPercent, 95));
  }

  startPreviewSeek = (event) => {
    this.handlePreviewSeek(event);
    this.previewPeekIsActive = true;
  };

  cancelPreviewSeek = () => {
    this.seekHoverPositionPercent = 0;
    this.previewPeekIsActive = false;
  };

  handleSeek = (event, newPosition) => {
    if (!this.videoElement || !['mousedown', 'mouseup', 'mousemove'].includes(event.type)) return;

    const isMouseDown = (event.type === 'mousedown');
    const isMouseUp = (event.type === 'mouseup');

    if (isMouseDown) {
      if (this.videoIsPlaying) {
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
      }
      this.seekIsPending = false;
    }

    // Update position on mouse down, up and move events
    this.videoElement.currentTime = newPosition;
  };

  handleFullscreen = () => {
    if (fscreen.fullscreenEnabled && this.videoContainer) {
      if (this.fullscreenIsActive && fscreen.fullscreenElement) {
        fscreen.exitFullscreen();
        this.fullscreenIsActive = false;
        document.documentElement.style.fontSize = "100%";
      } else {
        fscreen.requestFullscreen(this.videoContainer);
        this.fullscreenIsActive = true;
        document.documentElement.style.fontSize = "150%";
      }
     }
  };

  handleVolumeChange = (event, newVolume) => {
    if (!this.videoElement) return;

    this.videoElement.volume = newVolume;
    this.volumeLevel = newVolume;
  };

  toggleVolume = () => {
    if (!this.videoElement) return;
    
    this.volumeIsMuted = !this.volumeIsMuted;
    this.videoElement.muted = this.volumeIsMuted;
  };
  
  handlePlaybackSpeedChange = (speed) => {
    if (!this.videoElement) return;
    this.videoElement.playbackRate = speed;
  };

  *handleVideoClick() {
    this.handlePlayPause();
    this.videoClickAnimationDisplaying = true;
    
    yield delayMsAsync(0);
    this.videoClickAnimationDisplaying = false;
  };

  *setUserAsActive() {
    this.userIsIdle = false;

    yield delayMsAsync(4000);

    this.setUserAsIdle();
  };
}

export default VideoStore;