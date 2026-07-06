import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import MessageView from '../view/message-view.js';
import LoadingView from '../view/loading-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { sortPointByDay, sortPointByTime, sortPointByPrice } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #tripMainContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #sortComponent = null;
  #eventListComponent = new EventListView();
  #noPointComponent = null;
  #loadingComponent = new LoadingView();
  #newPointButtonComponent = null;
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #pointPresenters = new Map();
  #isLoading = true;
  #isError = false;

  constructor({ boardContainer, tripMainContainer, pointsModel, destinationsModel, offersModel, filterModel }) {
    this.#boardContainer = boardContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointByPrice);
    }

    return filteredPoints.sort(sortPointByDay);
  }

  init() {
    this.#renderNewPointButton();
    this.#renderBoard();
  }

  initError() {
    this.#isLoading = false;
    this.#isError = true;
    remove(this.#loadingComponent);
    this.#renderBoard();
  }

  #createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#newPointButtonComponent.setDisabled(false);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleNewPointButtonClick = () => {
    this.#createPoint();
    this.#newPointButtonComponent.setDisabled(true);
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.setDisabled(false);
  };

  #renderNewPointButton() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick,
    });
    this.#newPointButtonComponent.setDisabled(true);
    render(this.#newPointButtonComponent, this.#tripMainContainer);
  }

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
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
  }

  #renderNoPoints() {
    this.#noPointComponent = new MessageView({
      filterType: this.#filterModel.filter,
      isError: this.#isError,
    });
    render(this.#noPointComponent, this.#boardContainer);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isError) {
      this.#renderNoPoints();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#boardContainer);
    this.#renderPoints(this.points);
  }
}
