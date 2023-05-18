import { ActionButton, Flex } from '@adobe/react-spectrum';
import React from 'react';

import ShowMenu from '@spectrum-icons/workflow/ShowMenu';
import Table from '@spectrum-icons/workflow/Table';

import useMedia from '../../hooks/useMedia';
import useApp from '../../hooks/useApp';
import { NavLink } from '../Shared/NavLink';

export const Header = () => {
  // header contents modal open state when resize
  const { isDesktopUp, isDesktopBigUp } = useMedia();
  const { toggleNav, toggleData } = useApp();

  // For resizing header
  // window.addEventListener('resize', () => {
  //   setModalOpen(false);
  // });

  return (
    <header className="pageHeader">
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="size-100"
        UNSAFE_style={{ overflow: 'scroll' }}
      >
        {!isDesktopUp ? (
          <ActionButton aria-label="Open Menu" onPress={() => toggleNav()}>
            <ShowMenu />
          </ActionButton>
        ) : null}
        {!isDesktopBigUp ? (
          <ActionButton aria-label="Open Data" onPress={() => toggleData()}>
            <Table />
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
