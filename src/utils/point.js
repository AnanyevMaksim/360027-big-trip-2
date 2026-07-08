import dayjs from 'dayjs';

function humanizePointDate(date) {
  return date ? dayjs(date).format('MMM DD') : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format('HH:mm') : '';
}

function sortPointByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPointByTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function sortPointByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {humanizePointDate, humanizePointTime, sortPointByDay, sortPointByTime, sortPointByPrice};
