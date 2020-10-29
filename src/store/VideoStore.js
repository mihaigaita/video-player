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
  currentPositionSeconds = 843;
  durationSeconds = 1232;
  fullscreenEnabled = false;

  constructor() {
    makeAutoObservable(this);
  }
}

export default VideoStore;