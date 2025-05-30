import { RequestStatus, TOrder } from '../../utils/types';
import { getOrders, initialState, ordersReducer } from '../ordersSlice';

describe('Тесты для ordersSlice редьюсера', () => {
  const mockOrders: TOrder[] = [
    {
      ingredients: [],
      _id: 'id1',
      status: 'done',
      name: 'Краторный space минеральный люминесцентный бургер',
      createdAt: '',
      updatedAt: '',
      number: 2
    },
    {
      ingredients: [],
      _id: 'id2',
      status: 'done',
      name: 'Краторный традиционный-галактический бессмертный астероидный бургер',
      createdAt: '',
      updatedAt: '',
      number: 1
    }
  ];

  describe('Обработка различных статусов запроса', () => {
    it('должен установить статус "Loading" при pending', () => {
      const action = getOrders.pending('test_request_id');
      const newState = ordersReducer(initialState, action);

      expect(newState.status).toBe(RequestStatus.Loading);
    });

    it('должен установить статус "Failed" при rejected', () => {
      const error = new Error('Ошибка запроса');
      const action = getOrders.rejected(error, 'test_request_id');
      const newState = ordersReducer(initialState, action);

      expect(newState.status).toBe(RequestStatus.Failed);
    });

    it('должен обработать успешный запрос и сохранить заказы', () => {
      const action = getOrders.fulfilled(mockOrders, 'test_request_id');
      const newState = ordersReducer(initialState, action);

      expect(newState).toEqual({
        orders: mockOrders,
        status: RequestStatus.Success
      });
    });
  });
});
