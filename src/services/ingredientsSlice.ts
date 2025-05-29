import { getIngredientsApi } from './../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, RequestStatus } from '../utils/types';

type IngredientsState = {
  ingredient: TIngredient[];
  status: RequestStatus;
};

export const initialState: IngredientsState = {
  ingredient: [],
  status: RequestStatus.Idle
};

export const getIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.ingredient = action.payload;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.status = RequestStatus.Failed;
      });
  },
  selectors: {
    selectorIngredientsData: (state) => state.ingredient,
    selectorIngredientsStatus: (state) => state.status
  }
});

export const selectorIngredients = ingredientsSlice.selectors;
export const { selectorIngredientsData, selectorIngredientsStatus } =
  ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;
