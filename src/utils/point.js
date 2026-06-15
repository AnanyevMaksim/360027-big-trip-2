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

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getRandomArrayElement, humanizePointDate, humanizePointTime, updateItem};
