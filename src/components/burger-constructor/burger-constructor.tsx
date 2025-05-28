import { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  orderBurger,
  selectConstructorsItems,
  selectConstructorsOrder,
  selectConstructorsRequest
} from '../../services/burgerConstructorSlice';
import { getUser } from '../../services/userSlice';
import { RequestStatus, TConstructorIngredient } from '@utils-types';
import type { AppDispatch } from 'src/services/store';

export const BurgerConstructor: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Селекторы
  const user = useSelector(getUser);
  const constructorItems = useSelector(selectConstructorsItems);
  const orderModalData = useSelector(selectConstructorsOrder);
  const isLoading =
    useSelector(selectConstructorsRequest) === RequestStatus.Loading;

  // Расчет стоимости
  const calculatePrice = useCallback((items: typeof constructorItems) => {
    const bunCost = items.bun ? items.bun.price * 2 : 0;
    const ingredientsCost = items.ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunCost + ingredientsCost;
  }, []);

  const price = useMemo(
    () => calculatePrice(constructorItems),
    [constructorItems, calculatePrice]
  );

  // Обработчики событий
  const handleOrderClick = useCallback(() => {
    if (!constructorItems.bun || isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];

    dispatch(orderBurger(ingredientIds));
  }, [constructorItems, isLoading, user, navigate, dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(clearConstructor());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
