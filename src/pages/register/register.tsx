import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUser, selectorRequestStatus } from '../../services/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { AppDispatch } from 'src/services/store';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const isLoading = useSelector(selectorRequestStatus) === 'Loading';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      await dispatch(
        registerUser({
          name: userName,
          email: email,
          password: password
        })
      ).unwrap();
    } catch (err) {
      console.error('Registration error:', err);
      setErrorText((err as Error).message || 'Registration failed');
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
