import { getOrdersApi } from '../utils/burger-api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '../utils/types';

interface IOrdersState {
  orders: TOrder[];
  status: RequestStatus;
}

export const initialState: IOrdersState = {
  orders: [],
  status: RequestStatus.Idle
};

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (): Promise<TOrder[]> => {
    const response = await getOrdersApi();
    return response;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.status = RequestStatus.Success;
        }
      )
      .addCase(getOrders.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrdersStatus: (state) => state.status
  }
});

export const { selectOrders, selectOrdersStatus } = ordersSlice.selectors;
export const ordersReducer = ordersSlice.reducer;
