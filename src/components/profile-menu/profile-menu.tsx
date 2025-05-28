import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/userSlice';

export const ProfileMenu: FC = () => (
  <ProfileMenuUI
    handleLogout={() => useDispatch()(logoutUser())}
    pathname={useLocation().pathname}
  />
);
