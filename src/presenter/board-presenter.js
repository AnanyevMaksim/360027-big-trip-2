import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {updateItem, sortPointByDay, sortPointByTime, sortPointByPrice} from '../utils/point.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #sortComponent = null;
  #eventListComponent = new EventListView();

  #boardPoints = [];
  #sourcedBoardPoints = [];
  #currentSortType = SortType.DAY;
  #pointPresenters = new Map();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    if (this.#boardPoints.length === 0) {
      render(new MessageView(), this.#boardContainer);
      return;
    }

    this.#boardPoints.sort(sortPointByDay);

    this.#renderSort();
    render(this.#eventListComponent, this.#boardContainer);

    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortPointByDay);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointByPrice);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);

    remove(this.#sortComponent);
    this.#renderSort();

    this.#clearPointList();
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
