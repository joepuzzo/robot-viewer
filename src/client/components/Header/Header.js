import { ActionButton, Flex } from '@adobe/react-spectrum';
import React from 'react';

import ShowMenu from '@spectrum-icons/workflow/ShowMenu';

import useMedia from '../../hooks/useMedia';
import useApp from '../../hooks/useApp';
import { NavLink } from '../Shared/NavLink';

export const Header = () => {
  // header contents modal open state when resize
  const { isDesktopUp } = useMedia();
  const { toggleNav } = useApp();

  console.log('isDesktopUp', isDesktopUp);

  // For resizing header
  // window.addEventListener('resize', () => {
  //   setModalOpen(false);
  // });

  return (
    <header className="pageHeader">
      <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-100">
        {!isDesktopUp ? (
          <ActionButton aria-label="Open Menu" onClick={() => toggleNav()}>
            <ShowMenu />
          </ActionButton>
        ) : null}
        {isDesktopUp ? (
          <>
            <NavLink href="/">Robot</NavLink>
            <NavLink href="/motor">Motor</NavLink>
            <NavLink href="/cookbook">Cookbook</NavLink>
            <NavLink href="/framer">Framer</NavLink>
            <NavLink href="/builder">Builder</NavLink>
            <NavLink href="/gamepad">Gamepad</NavLink>
          </>
        ) : null}
        {/* <li className={`spectrum-SideNav-item`}>
          <a href="/static/KinematicsDiagram.pdf" className="spectrum-SideNav-itemLink">
            Kinematics
          </a>
        </li> */}
      </Flex>
    </header>
  );
};
