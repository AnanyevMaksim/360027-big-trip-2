import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic xK9mP2nQr7sL4vW';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const filtersContainerElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newPointButtonElement = tripMainElement.querySelector('.trip-main__event-add-btn');

newPointButtonElement.disabled = true;

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({pointsApiService});
const destinationsModel = new DestinationsModel({pointsApiService});
const offersModel = new OffersModel({pointsApiService});
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel,
  pointsModel,
});

function handleNewPointFormClose() {
  newPointButtonElement.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonElement.disabled = true;
}

newPointButtonElement.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
boardPresenter.init();

Promise.all([
  destinationsModel.init(),
  offersModel.init(),
]).then(() => pointsModel.init())
  .finally(() => {
    newPointButtonElement.disabled = false;
  });
