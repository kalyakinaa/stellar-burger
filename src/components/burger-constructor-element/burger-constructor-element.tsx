import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeFromConstructor,
  sortingConstructor
} from '../../services/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const moveIngredient = useCallback(
      (newIndex: number) => {
        dispatch(sortingConstructor({ positionA: index, positionB: newIndex }));
      },
      [dispatch, index]
    );

    const removeIngredient = useCallback(() => {
      dispatch(removeFromConstructor(ingredient.id));
    }, [dispatch, ingredient.id]);

    const handleMoveUp = useCallback(() => {
      if (index > 0) {
        moveIngredient(index - 1);
      }
    }, [index, moveIngredient]);

    const handleMoveDown = useCallback(() => {
      if (index < totalItems - 1) {
        moveIngredient(index + 1);
      }
    }, [index, totalItems, moveIngredient]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={removeIngredient}
      />
    );
  }
);
