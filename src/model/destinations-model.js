import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    this.#destinations = await this.#pointsApiService.destinations;
  }
}
