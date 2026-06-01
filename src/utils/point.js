import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(date) {
  return date ? dayjs(date).format('MMM DD') : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format('HH:mm') : '';
}

export {getRandomArrayElement, humanizePointDate, humanizePointTime};
