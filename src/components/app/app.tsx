import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/ingredientsSlice';
import { checkUserAuth, authCheck } from '../../services/userSlice';
import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const backgroundLocation = location.state?.background;
  const feedOrderNumber = useMatch('/feed/:number')?.params.number;
  const userOrderNumber = useMatch('/profile/orders/:number')?.params.number;

  const handleCloseModal = () => navigate(-1);

  // Инициализация приложения
  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth())
      .catch(console.error)
      .finally(() => dispatch(authCheck()));
  }, [dispatch]);

  // Компоненты для страниц с деталями
  const IngredientDetailsPage = () => (
    <div className={styles.detailPageWrap}>
      <h3 className={`text text_type_main-large ${styles.detailHeader}`}>
        Детали ингредиента
      </h3>
      <IngredientDetails />
    </div>
  );

  const OrderDetailsPage = ({ orderNumber }: { orderNumber?: string }) => (
    <div className={styles.detailPageWrap}>
      <p className={`text text_type_digits-default ${styles.detailHeader}`}>
        #{orderNumber?.padStart(6, '0')}
      </p>
      <OrderInfo />
    </div>
  );

  const modalRoutes = (
    <Routes>
      <Route
        path='/feed/:number'
        element={
          <Modal
            title={`#${feedOrderNumber?.padStart(6, '0')}`}
            onClose={handleCloseModal}
          >
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/ingredients/:id'
        element={
          <Modal title='Детали ингредиента' onClose={handleCloseModal}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <Modal
              title={`#${userOrderNumber?.padStart(6, '0')}`}
              onClose={handleCloseModal}
            >
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetailsPage />} />
        <Route
          path='/feed/:number'
          element={<OrderDetailsPage orderNumber={feedOrderNumber} />}
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderDetailsPage orderNumber={userOrderNumber} />
            </ProtectedRoute>
          }
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && modalRoutes}
    </div>
  );
};

export default App;
