import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {humanizePointDate, humanizePointTime} from '../utils.js';
import {DESTINATIONS, OFFERS} from '../mock/point.js';

dayjs.extend(duration);

function formatDuration(dateFrom, dateTo) {
  const diff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(minutes).padStart(2, '0')}M`;
}

function createOffersTemplate(offerIds, type) {
  const offersForType = OFFERS.find((item) => item.type === type).offers;
  const selectedOffers = offersForType.filter((offer) => offerIds.includes(offer.id));

  return selectedOffers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
}

function createPointTemplate(point) {
  const {type, destinationId, dateFrom, dateTo, basePrice, isFavorite, offerIds} = point;
  const destination = DESTINATIONS.find((dest) => dest.id === destinationId);
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${humanizePointDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination ? destination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(dateFrom).format('YYYY-MM-DDTHH:mm')}">${humanizePointTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(dateTo).format('YYYY-MM-DDTHH:mm')}">${humanizePointTime(dateTo)}</time>
          </p>
          <p class="event__duration">${formatDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offerIds, type)}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;

  constructor({point}) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }
}
