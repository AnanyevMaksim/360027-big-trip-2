import {mockPoints} from '../mock/point';

export default class PointsModel {
  #points = mockPoints;

  get points() {
    return this.#points;
  }
}
