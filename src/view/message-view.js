import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const ERROR_TEXT = 'Failed to load latest route information';

function createMessageTemplate(filterType, isError) {
  const messageText = isError ? ERROR_TEXT : NoPointsTextType[filterType];

  return `<p class="trip-events__msg">${messageText}</p>`;
}

export default class MessageView extends AbstractView {
  #filterType = null;
  #isError = false;

  constructor({filterType, isError = false}) {
    super();
    this.#filterType = filterType;
    this.#isError = isError;
  }

  get template() {
    return createMessageTemplate(this.#filterType, this.#isError);
  }
}
