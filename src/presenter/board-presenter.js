import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EditPointView from '../view/form-point-view.js';
import PointView from '../view/point-view.js';
import {render} from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #boardPoints = [];

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];

    render(new SortView(), this.#boardContainer);
    render(this.#eventListComponent, this.#boardContainer);

    render(new EditPointView({point: this.#boardPoints[0]}), this.#eventListComponent.element);

    this.#renderPoints();
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => {
      render(new PointView({point}), this.#eventListComponent.element);
    });
  }
}
