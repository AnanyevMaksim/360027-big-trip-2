import FiltersView from './view/filters-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './mock/filter.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filters = generateFilter(pointsModel.points);

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsElement,
  pointsModel,
});

render(new FiltersView({filters}), filtersContainerElement);
boardPresenter.init();
