import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createMessageTemplate(filterType) {
  const noPointsTextValue = NoPointsTextType[filterType];

  return `<p class="trip-events__msg">${noPointsTextValue}</p>`;
}

export default class MessageView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createMessageTemplate(this.#filterType);
  }
}
