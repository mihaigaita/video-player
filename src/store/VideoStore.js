import { makeAutoObservable, configure } from "mobx";

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
});

class VideoStore {
  playbackState = 'paused';
  volumeLevel = 50;
  currentPositionSeconds = 0;
  durationSeconds = 0;
  fullscreenEnabled = false;
  videoElement = null;

  constructor() {
    makeAutoObservable(this, {
      videoElement: false,
      setVideoElement: false,
    });
  }

  setVideoElement = (videoElement) => {
    this.videoElement = videoElement;
    videoElement.addEventListener('loadedmetadata', this.updateDuration);
    videoElement.addEventListener('timeupdate', this.updateTime);
    videoElement.addEventListener('ended', this.handleEnd);
  };

  handleEnd = () => {
    this.playbackState = 'paused';
  };

  updateTime = () => {
    if (!this.videoElement) return;

    // In some mobile browsers, when loadedmetadata is raised, if it is raised at all,
    // the duration may not have the correct value, or even any value at all so we
    // check again here
    if (!this.durationSeconds) this.updateDuration();

    this.currentPositionSeconds = this.videoElement.currentTime;
  };

  handleVideoClick = () => {
    this.handlePlayPause();
  };

  updateDuration = () => {
    if (!this.videoElement) return;

    this.durationSeconds = Math.floor(this.videoElement.duration);
  };

  handlePlayPause = () => {
    if (!this.videoElement) return;

    if (this.videoElement.paused || this.videoElement.ended) {
      this.videoElement.play();
      this.playbackState = 'playing';
    } else {
      this.videoElement.pause();
      this.playbackState = 'paused';
    }
  }

  handleSeek = (event, newPosition) => {
    if (!this.videoElement) return;

    this.videoElement.currentTime = newPosition;
  }
}

export default VideoStore;