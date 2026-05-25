import FiltersView from './view/filters-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsElement,
  pointsModel,
});

render(new FiltersView(), filtersContainerElement);
boardPresenter.init();
