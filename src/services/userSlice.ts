import {
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { RequestStatus, TUser } from './../utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isActionPending, isActionRejected } from '../utils/redux';
import { deleteCookie, setCookie } from '../utils/cookie';

export interface TUserState {
  isAuthChecked: boolean;
  data: TUser | null;
  requestStatus: RequestStatus;
}

export const initialState: TUserState = {
  isAuthChecked: false,
  data: null,
  requestStatus: RequestStatus.Idle
};

const handleLoginSuccess = (data: {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}) => {
  setCookie('accessToken', data.accessToken);
  setCookie('refreshToken', data.refreshToken);
  return data.user;
};

const handleLogout = async (dispatch: any) => {
  try {
    await logoutApi();
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    localStorage.clear();
    deleteCookie('accessToken');
    dispatch(userActions.userLogout());
  }
};

export const checkUserAuth = createAsyncThunk<TUser>(
  'user/checkUserAuth',
  async () => (await getUserApi()).user
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (user) => (await registerUserApi(user)).user
);

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string }
>('user/loginUser', async (user) =>
  handleLoginSuccess(await loginUserApi(user))
);

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => handleLogout(dispatch)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    const updateUserState = (state: TUserState, user: TUser) => {
      state.data = user;
      state.requestStatus = RequestStatus.Success;
    };

    builder
      .addCase(registerUser.fulfilled, (state, { payload }) =>
        updateUserState(state, payload)
      )
      .addCase(loginUser.fulfilled, (state, { payload }) =>
        updateUserState(state, payload)
      )
      .addCase(checkUserAuth.fulfilled, (state, { payload }) =>
        updateUserState(state, payload)
      )
      .addCase(updateUser.fulfilled, (state, { payload }) =>
        updateUserState(state, payload.user)
      )
      .addMatcher(isActionPending(userSlice.name), (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addMatcher(isActionRejected(userSlice.name), (state) => {
        state.requestStatus = RequestStatus.Failed;
      });
  },
  selectors: {
    getUser: (state) => state.data,
    getIsAuthChecked: (state) => state.isAuthChecked,
    selectorRequestStatus: (state) => state.requestStatus
  }
});

export const authCheck = userSlice.actions.authCheck;
export const { getUser, getIsAuthChecked, selectorRequestStatus } =
  userSlice.selectors;
export const userSelectors = userSlice.selectors;
export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
