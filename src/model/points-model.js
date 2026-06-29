import Observable from '../framework/observable.js';
import {mockPoints} from '../mock/point.js';

export default class PointsModel extends Observable {
  #points = mockPoints;

  get points() {
    return this.#points;
  }
}
