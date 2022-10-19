import { ActionButton, Flex } from '@adobe/react-spectrum';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';

import useMedia from '../../hooks/useMedia';
import useApp from '../../hooks/useApp';

const NavLink = ({ children, href, ...rest }) => {
  const navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault();
    navigate(href);
  };

  let location = useLocation();
  const isSelected = href === location.pathname;

  return (
    <li className={`spectrum-SideNav-item ${isSelected ? 'is-selected' : ''}`}>
      <a {...rest} onClick={onClick} className="spectrum-SideNav-itemLink">
        {children}
      </a>
    </li>
  );
};

export const Header = () => {
  // header contents modal open state when resize
  const { isDesktopUp } = useMedia();
  const { toggleNav } = useApp();

  // For resizing header
  window.addEventListener('resize', () => {
    setModalOpen(false);
  });

  return (
    <header className="pageHeader">
      <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-100">
        {!isDesktopUp ? (
          <ActionButton aria-label="Open Menu" onClick={() => toggleNav()}>
            <ShowMenu.default />
          </ActionButton>
        ) : null}
        <NavLink href="/">Robot</NavLink>
        <NavLink href="/motor">Motor</NavLink>
        <NavLink href="/cookbook">Cookbook</NavLink>
      </Flex>
    </header>
  );
};
