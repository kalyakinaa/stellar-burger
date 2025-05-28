import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

interface INavItem {
  path: string;
  icon: React.ReactNode;
  text: string;
  testId?: string;
}

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const navItems: INavItem[] = [
    {
      path: '/',
      icon: <BurgerIcon type='primary' />,
      text: 'Конструктор',
      testId: 'constructor-link'
    },
    {
      path: '/feed',
      icon: <ListIcon type='primary' />,
      text: 'Лента заказов',
      testId: 'feed-link'
    }
  ];

  const profileItem: INavItem = {
    path: '/profile',
    icon: <ProfileIcon type='primary' />,
    text: userName || 'Личный кабинет',
    testId: 'profile-link'
  };

  const renderNavLink = ({ path, icon, text, testId }: INavItem) => (
    <NavLink
      key={path}
      to={path}
      className={({ isActive }) =>
        clsx(styles.link, isActive && styles.link_active)
      }
      data-testid={testId}
    >
      {icon}
      <p className='text text_type_main-default ml-2'>{text}</p>
    </NavLink>
  );

  return (
    <header className={styles.header} data-testid='app-header'>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {navItems.map(renderNavLink)}
        </div>

        <NavLink to='/' className={styles.logo} data-testid='logo-link'>
          <Logo className='' />
        </NavLink>

        <div className={styles.link_position_last}>
          {renderNavLink(profileItem)}
        </div>
      </nav>
    </header>
  );
};
