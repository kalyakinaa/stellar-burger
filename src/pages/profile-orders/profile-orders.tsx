import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders, selectOrders } from '../../services/ordersSlice';
import { getUser } from '../../services/userSlice';
import type { AppDispatch } from 'src/services/store';

export const ProfileOrders: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const currentUser = useSelector(getUser);

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = () => dispatch(getOrders());
    fetchOrders();
  }, [currentUser, dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
