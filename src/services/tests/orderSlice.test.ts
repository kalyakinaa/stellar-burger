import { RequestStatus, TOrder } from '../../utils/types';
import { getOrderByNumber, initialState, orderReducer } from '../orderSlice';

const mockOrder: TOrder = {
  ingredients: [],
  _id: 'id',
  status: 'done',
  name: 'Краторный традиционный-галактический бессмертный астероидный бургер',
  createdAt: '',
  updatedAt: '',
  number: 1
};

describe('Тесты для orderSlice', () => {
  const requestId = 'test_request_id';
  const error = new Error('Test error');
  const arg = 1;

  it('должен корректно обрабатывать pending состояние', () => {
    const action = getOrderByNumber.pending(requestId, arg);
    const nextState = orderReducer(initialState, action);

    expect(nextState.status).toEqual(RequestStatus.Loading);
  });

  it('должен корректно обрабатывать rejected состояние', () => {
    const action = getOrderByNumber.rejected(error, requestId, arg);
    const nextState = orderReducer(initialState, action);

    expect(nextState.status).toEqual(RequestStatus.Failed);
  });

  it('должен корректно обрабатывать fulfilled состояние', () => {
    const action = getOrderByNumber.fulfilled(mockOrder, requestId, arg);
    const nextState = orderReducer(initialState, action);

    expect(nextState).toEqual({
      data: mockOrder,
      status: RequestStatus.Success
    });
  });
});
