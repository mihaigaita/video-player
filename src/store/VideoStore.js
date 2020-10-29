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
  videoIsPlaying = false;
  volumeLevel = 50;
  currentPositionSeconds = 0;
  durationSeconds = 0;
  fullscreenIsActive = false;
  videoElement = null;
  videoContainer = null;
  videoClickAnimationDisplaying = false;
  userIsIdle = false;

  constructor() {
    makeAutoObservable(this, {
      videoElement: false,
      videoContainer: false,
      setVideoElement: false,
      cleanUp: false,
    });
  }

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

  handleSeek = (event, newPosition) => {
    if (!this.videoElement) return;

    this.videoElement.currentTime = newPosition;
  };

  handleFullscreen = () => {
    if (fscreen.fullscreenEnabled && this.videoContainer) {
      if (this.fullscreenIsActive && fscreen.fullscreenElement) {
        fscreen.exitFullscreen();
        this.fullscreenIsActive = false;
      } else {
        fscreen.requestFullscreen(this.videoContainer);
        this.fullscreenIsActive = true;
      }
     }
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