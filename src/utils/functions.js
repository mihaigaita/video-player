const formatSecondsToTimeDuration = (value) => {
  const hours = Math.floor(value / 60 / 24);
  const minutes = Math.floor(value / 60 % 24);
  const seconds = value % 60;

  const hoursText = hours ? `${hours}:` : '';
  const minutesSecondsText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return `${hoursText}${minutesSecondsText}`;
};

export {
  formatSecondsToTimeDuration,
}