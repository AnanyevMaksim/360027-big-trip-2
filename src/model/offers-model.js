import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    this.#offers = await this.#pointsApiService.offers;
  }
}
