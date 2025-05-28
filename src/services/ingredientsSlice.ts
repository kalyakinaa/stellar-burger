import { getIngredientsApi } from './../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, RequestStatus } from '@utils-types';

type IngredientsState = {
  ingredients: TIngredient[];
  loadingStatus: RequestStatus;
};

const initialIngredientsState: IngredientsState = {
  ingredients: [],
  loadingStatus: RequestStatus.Idle
};

export const getIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loadingStatus = RequestStatus.Loading;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loadingStatus = RequestStatus.Success;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.loadingStatus = RequestStatus.Failed;
      });
  },
  selectors: {
    selectorIngredientsData: (state) => state.ingredients,
    selectorIngredientsStatus: (state) => state.loadingStatus
  }
});

export const selectorIngredients = ingredientsSlice.selectors;
export const { selectorIngredientsData, selectorIngredientsStatus } =
  ingredientsSlice.selectors;
