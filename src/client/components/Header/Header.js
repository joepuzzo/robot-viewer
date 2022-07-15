import { ActionButton } from '@adobe/react-spectrum';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';

import useMedia from '../../hooks/useMedia';
import useApp from '../../hooks/useApp';

const NavLink = ({ href, ...rest }) => {
  const navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault();
    navigate(href);
  };

  return <a {...rest} onClick={onClick} />;
};

export const Header = () => {
  // header contents modal open state when resize
  const { isDesktopUp } = useMedia();
  const { toggleNav } = useApp();

  // For resizing header
  window.addEventListener('resize', () => {
    setModalOpen(false);
  });

  if (!isDesktopUp) {
    return (
      <header className="pageHeader">
        <ActionButton aria-label="Open Menu" onClick={() => toggleNav()}>
          <ShowMenu.default />
        </ActionButton>
      </header>
    );
  }

  return null;
};
