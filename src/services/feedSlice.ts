import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder, TOrdersData } from './../utils/types';
import { getFeedsApi } from '../utils/burger-api';

interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: RequestStatus;
}

export const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: RequestStatus.Idle
};

export const getFeeds = createAsyncThunk<TOrdersData>(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  }
});

export const selectFeedOrders = (state: { feed: IFeedState }) =>
  state.feed.orders;
export const selectTotal = (state: { feed: IFeedState }) => state.feed.total;
export const selectTotalToday = (state: { feed: IFeedState }) =>
  state.feed.totalToday;
export const selectFeedStatus = (state: { feed: IFeedState }) =>
  state.feed.status;
export const selectFeed = (state: { feed: IFeedState }) => state.feed;

export const { clearFeed } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
