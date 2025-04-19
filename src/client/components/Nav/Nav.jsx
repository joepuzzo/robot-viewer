import { Flex } from '@adobe/react-spectrum';
import React, { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';

// Hooks
import useApp from '../../hooks/useApp';
import useMedia from '../../hooks/useMedia';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import { NavLink } from '../Shared/NavLink';
import { BuilderNav } from './BuilderNav';
import { CookbookNav } from './CookbookNav';
import { FramerNav } from './FramerNav';

import { MotorNav } from './MotorNav';
import { RobotNav } from './RobotNav';

export const Nav = () => {
  const { extraOpen, navOpen, closeNav } = useApp();

  const navRef = useRef();

  useOutsideAlerter(() => closeNav(), navRef);

  const { isDesktopUp } = useMedia();

  return (
    <nav className={`sidenav ${navOpen ? 'sidenav-visible' : ''}`} ref={navRef}>
      {!isDesktopUp ? (
        <>
          <Flex direction="column" justifyContent="space-between" alignItems="left" gap="size-100">
            <NavLink href="/">Robot</NavLink>
            <NavLink href="/motor">Motor</NavLink>
            <NavLink href="/cookbook">Cookbook</NavLink>
            <NavLink href="/framer">Framer</NavLink>
            <NavLink href="/builder">Builder</NavLink>
            <NavLink href="/gamepad">Gamepad</NavLink>
          </Flex>
          <hr />
        </>
      ) : null}
      <Routes>
        <Route path="/" element={<RobotNav />} />
        <Route path="/motor" element={<MotorNav />} />
        <Route path="/cookbook" element={<CookbookNav />} />
        <Route path="/framer" element={<FramerNav />} />
        <Route path="/builder" element={<BuilderNav />} />
      </Routes>
    </nav>
  );
};
