import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './ingredientsSlice';
import { burgerConstructorSlice } from './burgerConstructorSlice';
import { feedSlice } from './feedSlice';
import { orderSlice } from './orderSlice';
import { userSlice } from './userSlice';
import { ordersSlice } from './ordersSlice';

const reducers = {
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  feed: feedSlice.reducer,
  order: orderSlice.reducer,
  orders: ordersSlice.reducer,
  user: userSlice.reducer
};

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = selectorHook;

export default store;
