import { expect, describe, it } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../ingredientsSlice';
import { burgerConstructorSlice } from '../burgerConstructorSlice';
import { feedSlice } from '../feedSlice';
import { orderSlice } from '../orderSlice';
import { userSlice } from '../userSlice';
import { ordersSlice } from '../ordersSlice';

describe('Тест для rootReducer', () => {
  const reducers = {
    ingredients: ingredientsSlice.reducer,
    burgerConstructor: burgerConstructorSlice.reducer,
    feed: feedSlice.reducer,
    order: orderSlice.reducer,
    orders: ordersSlice.reducer,
    user: userSlice.reducer
  };

  it('должен корректно инициализировать все редьюсеры с начальным состоянием', () => {
    const store = configureStore({
      reducer: reducers,
      devTools: false
    });

    const actualState = store.getState();
    const expectedState = Object.entries(reducers).reduce(
      (acc, [key, reducer]) => ({
        ...acc,
        [key]: reducer(undefined, { type: '@@INIT' })
      }),
      {}
    );

    expect(actualState).toEqual(expectedState);
  });
});