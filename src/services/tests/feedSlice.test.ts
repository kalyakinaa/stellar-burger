import store from '../store';
import { clearFeed, getFeeds, feedReducer, initialState } from '../feedSlice';
import { RequestStatus, TOrdersData } from '../../utils/types';

const mockOrderData: TOrdersData = {
  orders: [
    {
      ingredients: [],
      _id: 'id',
      status: 'done',
      name: 'Краторный традиционный-галактический бессмертный астероидный бургер',
      createdAt: '',
      updatedAt: '',
      number: 1
    }
  ],
  total: 157,
  totalToday: 13
};

describe('Тесты для feedSlice', () => {
  beforeEach(() => {
    store.dispatch(clearFeed());
  });

  describe('Обработка статусов запроса', () => {
    it('должен установить статус "Loading" при pending', () => {
      const newState = feedReducer(initialState, getFeeds.pending('requestId'));
      
      expect(newState.status).toBe(RequestStatus.Loading);
      expect(newState.orders).toEqual(initialState.orders);
      expect(newState.total).toBe(initialState.total);
      expect(newState.totalToday).toBe(initialState.totalToday);
    });

    it('должен установить статус "Failed" при rejected', () => {
      const newState = feedReducer(
        initialState, 
        getFeeds.rejected(new Error('Network error'), 'requestId')
      );
      
      expect(newState.status).toBe(RequestStatus.Failed);
    });

    it('должен корректно обрабатывать успешный ответ', () => {
      const newState = feedReducer(
        initialState, 
        getFeeds.fulfilled(mockOrderData, 'requestId')
      );
      
      expect(newState.status).toBe(RequestStatus.Success);
      expect(newState.orders).toEqual(mockOrderData.orders);
      expect(newState.total).toBe(mockOrderData.total);
      expect(newState.totalToday).toBe(mockOrderData.totalToday);
    });
  });

  describe('Очистка состояния', () => {
    it('должен сбрасывать состояние при clearFeed', () => {
      const stateWithData = feedReducer(
        initialState, 
        getFeeds.fulfilled(mockOrderData, 'requestId')
      );
      
      const clearedState = feedReducer(stateWithData, clearFeed());
      
      expect(clearedState).toEqual(initialState);
    });
  });
});