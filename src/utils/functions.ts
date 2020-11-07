const formatSecondsToTimeDuration = (value: number): string => {
  if (value < 0 || value >= 24 * 60 * 60) return 'N/A';

  const hours = Math.floor(value / 60 / 24);
  const minutes = Math.floor(value / 60 % 24);
  const seconds = Math.floor(value % 60);

  const hoursText = hours ? `${hours}:` : '';
  const minutesSecondsText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return `${hoursText}${minutesSecondsText}`;
};

const delayMsAsync = (ms: number): Promise<number> => new Promise((resolve) => setTimeout(resolve, ms));

const delayNextFrame = (): Promise<number> => new Promise(window.requestAnimationFrame);

export {
  formatSecondsToTimeDuration,
  delayMsAsync,
  delayNextFrame,
};