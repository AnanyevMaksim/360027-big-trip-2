import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import {POINT_TYPES} from '../const.js';

const BLANK_POINT = {
  type: POINT_TYPES[0],
  destinationId: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offerIds: [],
};

function createTypeListTemplate(currentType) {
  return POINT_TYPES.map((type) => `
    <div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${currentType === type ? 'checked' : ''}
      >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
        ${type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
    </div>
  `).join('');
}

function createDestinationListTemplate(destinations) {
  return destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
}

function createOffersTemplate(offerIds, type, offers) {
  const offersForType = offers.find((item) => item.type === type)?.offers ?? [];

  if (offersForType.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersForType.map((offer) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox  visually-hidden"
              id="event-offer-${offer.id}-1"
              type="checkbox"
              value="${offer.id}"
              name="event-offer-${offer.id}"
              ${offerIds.includes(offer.id) ? 'checked' : ''}
            >
            <label class="event__offer-label" for="event-offer-${offer.id}-1">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function createDestinationTemplate(destinationId, destinations) {
  const destination = destinations.find((dest) => dest.id === destinationId);

  if (!destination || (!destination.description && destination.pictures.length === 0)) {
    return '';
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${destination.description ? `<p class="event__destination-description">${destination.description}</p>` : ''}
      ${destination.pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination.pictures.map((pic) => `
              <img class="event__photo" src="${pic.src}" alt="${pic.description}">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

function createEditPointTemplate(state, destinations, offers) {
  const {type, destinationId, dateFrom, dateTo, basePrice, offerIds, isEditView} = state;

  const destination = destinations.find((dest) => dest.id === destinationId);
  const destinationName = destination ? destination.name : '';

  const startDate = dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : '';
  const endDate = dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : '';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypeListTemplate(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${he.encode(destinationName)}"
              list="destination-list-1"
            >
            <datalist id="destination-list-1">
              ${createDestinationListTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${startDate}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${endDate}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${basePrice}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isEditView ? 'Delete' : 'Cancel'}</button>
          ${isEditView ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
        </header>

        <section class="event__details">
          ${createOffersTemplate(offerIds, type, offers)}
          ${createDestinationTemplate(destinationId, destinations)}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = BLANK_POINT, destinations, offers, onFormSubmit, onRollupClick, onDeleteClick, isEditView = true} = {}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._setState(EditPointView.parsePointToState(point, isEditView));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point, true),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('keydown', this.#priceKeydownHandler);

    if (this._state.isEditView) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }

    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#offerChangeHandler);
    }

    this.#setDatepicker();
  }

  #setDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        onChange: this.#dateFromChangeHandler,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({dateFrom: userDate});
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({dateTo: userDate});
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offerIds: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);

    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      destinationId: selectedDestination.id,
    });
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: parseInt(evt.target.value, 10),
    });
  };

  #priceKeydownHandler = (evt) => {
    if (!/[0-9]/.test(evt.key) && evt.key !== 'Backspace' && evt.key !== 'Delete' && evt.key !== 'ArrowLeft' && evt.key !== 'ArrowRight' && evt.key !== 'Tab') {
      evt.preventDefault();
    }
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.value;

    const updatedOfferIds = this._state.offerIds.includes(offerId)
      ? this._state.offerIds.filter((id) => id !== offerId)
      : [...this._state.offerIds, offerId];

    this._setState({offerIds: updatedOfferIds});
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState(point, isEditView = true) {
    return {...point, isEditView};
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isEditView;
    return point;
  }
}
