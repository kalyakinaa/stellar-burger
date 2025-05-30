import { TLoginData } from '../../utils/burger-api';
import { RequestStatus } from '../../utils/types';
import {
  checkUserAuth,
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userActions,
  userReducer
} from '../userSlice';

const mockUser = {
  name: 'Asta',
  email: 'asta.512@yandex.ru',
  password: 'password'
};

const mockUpdatedUser = {
  name: 'updatedAsta',
  email: 'updatedasta.512@yandex.ru',
  password: 'updatedPassword'
};

const mockLoginData: TLoginData = {
  email: 'asta.512@yandex.ru',
  password: 'password'
};

const mockUserResponse = {
  user: mockUser,
  success: true
};

describe('Тесты для userSlice', () => {
  describe('Синхронные действия', () => {
    it('должен устанавливать флаг проверки авторизации', () => {
      const state = userReducer(initialState, userActions.authCheck());
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен очищать данные пользователя при выходе', () => {
      const state = userReducer(
        { ...initialState, data: mockUser },
        userActions.userLogout()
      );
      expect(state.data).toBeNull();
    });
  });

  describe('Асинхронные действия', () => {
    describe('logoutUser - выход пользователя', () => {
      it('должен устанавливать статус "Loading" при pending', () => {
        const state = userReducer(
          { ...initialState, data: mockUser },
          logoutUser.pending('')
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: mockUser,
          requestStatus: RequestStatus.Loading
        });
      });

      it('должен сохранять данные пользователя при rejected', () => {
        const state = userReducer(
          { ...initialState, data: mockUser },
          logoutUser.rejected(new Error('Error'), '')
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: mockUser,
          requestStatus: RequestStatus.Failed
        });
      });

      it('должен очищать данные пользователя при fulfilled', () => {
        const state = userReducer(
          { ...initialState, data: mockUser },
          userActions.userLogout()
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: null,
          requestStatus: RequestStatus.Idle
        });
      });
    });

    describe('registerUser', () => {
      it('должен устанавливать статус "Loading" при pending', () => {
        const state = userReducer(
          initialState,
          registerUser.pending('', mockUser)
        );
        expect(state.requestStatus).toBe(RequestStatus.Loading);
      });

      it('должен устанавливать статус "Failed" при rejected', () => {
        const state = userReducer(
          initialState,
          registerUser.rejected(new Error('Error'), '', mockUser)
        );
        expect(state.requestStatus).toBe(RequestStatus.Failed);
      });

      it('должен сохранять данные пользователя при fulfilled', () => {
        const state = userReducer(
          initialState,
          registerUser.fulfilled(mockUser, '', mockUser)
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: mockUser,
          requestStatus: RequestStatus.Success
        });
      });
    });

    describe('loginUser - вход пользователя', () => {
      it('должен устанавливать статус "Loading" при pending', () => {
        const state = userReducer(
          initialState,
          loginUser.pending('', mockLoginData)
        );
        expect(state.requestStatus).toBe(RequestStatus.Loading);
      });

      it('должен устанавливать статус "Failed" при rejected', () => {
        const state = userReducer(
          initialState,
          loginUser.rejected(new Error('Error'), '', mockLoginData)
        );
        expect(state.requestStatus).toBe(RequestStatus.Failed);
      });

      it('должен сохранять данные пользователя при fulfilled', () => {
        const state = userReducer(
          initialState,
          loginUser.fulfilled(mockUser, '', mockLoginData)
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: mockUser,
          requestStatus: RequestStatus.Success
        });
      });
    });

    describe('checkUserAuth - проверка авторизации', () => {
      it('должен устанавливать статус "Loading" при pending', () => {
        const state = userReducer(initialState, checkUserAuth.pending(''));
        expect(state.requestStatus).toBe(RequestStatus.Loading);
      });

      it('должен устанавливать статус "Failed" при rejected', () => {
        const state = userReducer(
          initialState,
          checkUserAuth.rejected(new Error('Error'), '')
        );
        expect(state.requestStatus).toBe(RequestStatus.Failed);
      });

      it('должен сохранять данные пользователя при fulfilled', () => {
        const state = userReducer(
          initialState,
          checkUserAuth.fulfilled(mockUser, '')
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: mockUser,
          requestStatus: RequestStatus.Success
        });
      });
    });

    describe('updateUser - обновление данных пользователя', () => {
      it('должен устанавливать статус "Loading" при pending', () => {
        const state = userReducer(
          initialState,
          updateUser.pending('', mockUpdatedUser)
        );
        expect(state.requestStatus).toBe(RequestStatus.Loading);
      });

      it('должен устанавливать статус "Failed" при rejected', () => {
        const state = userReducer(
          initialState,
          updateUser.rejected(new Error('Error'), '', mockUpdatedUser)
        );
        expect(state.requestStatus).toBe(RequestStatus.Failed);
      });

      it('должен сохранять данные пользователя при fulfilled', () => {
        const state = userReducer(
          initialState,
          updateUser.fulfilled(mockUserResponse, '', mockUpdatedUser)
        );

        expect(state).toEqual({
          isAuthChecked: false,
          data: mockUser,
          requestStatus: RequestStatus.Success
        });
      });
    });
  });
});
