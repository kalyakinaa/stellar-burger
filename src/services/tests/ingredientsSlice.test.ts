import { RequestStatus, TIngredient } from '../../utils/types';
import { getIngredients, ingredientsReducer, initialState } from '../ingredientsSlice';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: "Соус фирменный Space Sauce",
    type: 'sause',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
  },
  {
    _id: '2',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('Тесты для ingredientsSlice', () => {
  describe('Начальное состояние', () => {
    it('должен возвращать initialState при неизвестном action', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' };
      const newState = ingredientsReducer(initialState, unknownAction as any);
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('Обработка статусов запроса ингредиентов', () => {
    it('должен устанавливать статус "Loading" при начале загрузки', () => {
      const newState = ingredientsReducer(
        initialState, 
        getIngredients.pending('requestId')
      );
      
      expect(newState.status).toBe(RequestStatus.Loading);
      expect(newState.ingredient).toEqual(initialState.ingredient);
    });

    it('должен устанавливать статус "Failed" при ошибке загрузки', () => {
      const error = new Error('Network error');
      const newState = ingredientsReducer(
        initialState,
        getIngredients.rejected(error, 'requestId')
      );
      
      expect(newState.status).toBe(RequestStatus.Failed);
    });

    it('должен корректно обрабатывать успешную загрузку ингредиентов', () => {
      const newState = ingredientsReducer(
        initialState,
        getIngredients.fulfilled(mockIngredients, 'requestId')
      );
      
      expect(newState.status).toBe(RequestStatus.Success);
      expect(newState.ingredient).toEqual(mockIngredients);
    });
  });
});