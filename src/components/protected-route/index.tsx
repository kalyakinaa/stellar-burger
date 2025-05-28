import { useSelector } from '../../services/store';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { userSelectors } from '../../services/userSlice';
import { ReactElement } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

type NavigationState = {
  from: {
    pathname: string;
    search?: string;
    hash?: string;
    backgroundLocation?: Location;
  };
};

const useAuthStatus = () => {
  const { getIsAuthChecked, getUser } = userSelectors;
  return {
    user: useSelector(getUser),
    isAuthChecked: useSelector(getIsAuthChecked)
  };
};

const getNavigateToLogin = (location: ReturnType<typeof useLocation>) => (
  <Navigate
    replace
    to='/login'
    state={{
      from: {
        ...location,
        backgroundLocation: location.state?.backgroundLocation
      }
    }}
  />
);

const getNavigateToHome = (location: ReturnType<typeof useLocation>) => {
  const from = location.state?.from || { pathname: '/' };
  const backgroundLocation = location.state?.from?.backgroundLocation || null;
  return <Navigate replace to={from} state={{ backgroundLocation }} />;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthChecked } = useAuthStatus();

  if (!isAuthChecked) return <Preloader />;

  if (!onlyUnAuth && !user) return getNavigateToLogin(location);
  if (onlyUnAuth && user) return getNavigateToHome(location);

  return children;
};
