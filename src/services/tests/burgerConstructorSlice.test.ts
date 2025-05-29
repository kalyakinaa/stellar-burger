import {
  burgerConstructorSlice,
  IBurgerConstructorState
} from '../burgerConstructorSlice';
import { RequestStatus, TIngredient, TConstructorIngredient } from '../../utils/types';

const mockSauce: TIngredient = {
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
};

const mockBun: TIngredient = {
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
};

const createConstructorIngredient = (ingredient: TIngredient, id: string): TConstructorIngredient => ({
  ...ingredient,
  id
});

describe('Тесты для burgerConstructorSlice', () => {
  const initialEmptyState: IBurgerConstructorState = {
    bun: null,
    ingredients: [],
    requestStatus: RequestStatus.Idle,
    order: null
  };

  describe('Добавление ингредиентов', () => {
    it('должен добавлять ингредиент в конструктор', () => {
      const action = burgerConstructorSlice.actions.addToConstructor(mockSauce);
      const resultState = burgerConstructorSlice.reducer(initialEmptyState, action);

      expect(resultState.ingredients).toHaveLength(1);
      expect(resultState.ingredients[0]).toEqual(expect.objectContaining(mockSauce));
      expect(resultState.bun).toBeNull();
    });

    it('должен заменять булку при добавлении новой', () => {
      const constructorBun = createConstructorIngredient(mockBun, 'bun-1');
      const stateWithBun = { ...initialEmptyState, bun: constructorBun };
      const newBun = { ...mockBun, _id: '3' };
      const action = burgerConstructorSlice.actions.addToConstructor(newBun);
      const resultState = burgerConstructorSlice.reducer(stateWithBun, action);
      
      expect(resultState.bun).toEqual(expect.objectContaining({
        _id: '3',
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
      }));
  
  expect(resultState.bun?.id).toBeDefined();
  expect(resultState.bun?.id).not.toBe('bun-1');
  
  expect(resultState.ingredients).toHaveLength(0);
});
  });

  describe('Удаление ингредиентов', () => {
    it('должен удалять ингредиент из конструктора', () => {
      const constructorIngredient = createConstructorIngredient(mockSauce, 'unique-1');
      const stateWithIngredients = {
        ...initialEmptyState,
        ingredients: [constructorIngredient]
      };
      
      const action = burgerConstructorSlice.actions.removeFromConstructor('unique-1');
      const resultState = burgerConstructorSlice.reducer(stateWithIngredients, action);

      expect(resultState.ingredients).toHaveLength(0);
    });
  });

  describe('Сортировка ингредиентов', () => {
    it('должен корректно менять порядок ингредиентов', () => {
      const constructorSauce = createConstructorIngredient(mockSauce, 'unique-1');
      const constructorBun = createConstructorIngredient(mockBun, 'unique-2');
      
      const stateWithIngredients = {
        ...initialEmptyState,
        ingredients: [constructorSauce, constructorBun]
      };
      
      const action = burgerConstructorSlice.actions.sortingConstructor({
        positionA: 0,
        positionB: 1
      });
      
      const resultState = burgerConstructorSlice.reducer(stateWithIngredients, action);

      expect(resultState.ingredients[0]._id).toBe('2');
      expect(resultState.ingredients[1]._id).toBe('1');
    });
  });
});
