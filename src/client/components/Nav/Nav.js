import React, { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';

// Hooks
import useApp from '../../hooks/useApp';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import { CookbookNav } from './CookbookNav';
import { FramerNav } from './FramerNav';

import { MotorNav } from './MotorNav';
import { RobotNav } from './RobotNav';

export const Nav = () => {
  const { extraOpen, navOpen, closeNav } = useApp();

  const navRef = useRef();

  useOutsideAlerter(() => closeNav(), navRef);

  return (
    <nav
      className={`sidenav ${navOpen ? 'sidenav-visible' : ''}  ${extraOpen ? 'extra' : ''}`}
      ref={navRef}
    >
      <Routes>
        <Route path="/" element={<RobotNav />} />
        <Route path="/motor" element={<MotorNav />} />
        <Route path="/cookbook" element={<CookbookNav />} />
        <Route path="/framer" element={<FramerNav />} />
      </Routes>
    </nav>
  );
};
