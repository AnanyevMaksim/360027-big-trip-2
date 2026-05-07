import {getRandomArrayElement} from '../utils.js';

const DESTINATIONS = [
  {
    id: 1,
    name: 'Amsterdam',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'Amsterdam parliament building',
      },
      {
        src: 'https://loremflickr.com/248/152?random=2',
        description: 'Amsterdam in a middle of summer',
      },
    ],
  },
  {
    id: 2,
    name: 'Chamonix',
    description: 'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=3',
        description: 'Chamonix parliament building',
      },
    ],
  },
  {
    id: 3,
    name: 'Geneva',
    description: '',
    pictures: [],
  },
];

const OFFERS_BY_TYPE = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Order Uber',
        price: 20,
      },
    ],
  },
  {
    type: 'bus',
    offers: [
      {
        id: 2,
        title: 'Online check-in',
        price: 10,
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        id: 3,
        title: 'Business lounge',
        price: 50,
      },
    ],
  },
  {
    type: 'ship',
    offers: [],
  },
  {
    type: 'drive',
    offers: [
      {
        id: 4,
        title: 'Rent a car',
        price: 200,
      },
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        id: 5,
        title: 'Add luggage',
        price: 50,
      },
      {
        id: 6,
        title: 'Switch to comfort class',
        price: 80,
      },
      {
        id: 7,
        title: 'Add meal',
        price: 15,
      },
    ],
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 8,
        title: 'Add breakfast',
        price: 50,
      },
    ],
  },
  {
    type: 'sightseeing',
    offers: [],
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 9,
        title: 'Choose menu',
        price: 30,
      },
    ],
  },
];

const mockPoints = [
  {
    id: '1',
    type: 'taxi',
    destinationId: 1,
    dateFrom: new Date('2026-06-26T10:30:00'),
    dateTo: new Date('2026-06-26T11:00:00'),
    basePrice: 20,
    isFavorite: false,
    offerIds: [1],
  },
  {
    id: '2',
    type: 'flight',
    destinationId: 2,
    dateFrom: new Date('2026-06-26T12:00:00'),
    dateTo: new Date('2026-06-26T14:30:00'),
    basePrice: 150,
    isFavorite: true,
    offerIds: [5, 6],
  },
  {
    id: '3',
    type: 'check-in',
    destinationId: 3,
    dateFrom: new Date('2026-06-26T15:00:00'),
    dateTo: new Date('2026-06-27T12:00:00'),
    basePrice: 80,
    isFavorite: false,
    offerIds: [],
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint, DESTINATIONS, OFFERS_BY_TYPE};
