import React, { useState } from 'react';
import AppContext from '../context/AppContext';
import Kinematics from 'kinematics';

const geometry = [
  [0, 2, 0], // V0: 0x 2y
  [0, 2, 0], // V1: 0x 2y
  [0, 2, 0], // V2: 0x 2y
  [2, 0, 0], // V3: 2x 0y
  [0, 2, 0], // V4: 0x 2y
];

// const geometry = [
//   [0, 0, 2], // V0: 0x 2y
//   [0, 0, 2], // V1: 0x 2y
//   [0, 0, 2], // V2: 0x 2y
//   [2, 0, 0], // V3: 2x 0y
//   [0, 2, 0], // V4: 0x 2y
// ];

// const geometry = [
//   [0, 0, 2], // V0: 0x 2y
//   [0, 0, 2], // V1: 0x 2y
//   [0, 0, 2], // V2: 0x 2y
//   [2, 0, 0], // V3: 2x 0y
//   [0, 2, 0], // V4: 0x 2y
// ];

const RobotKin = new Kinematics.default(geometry);

/**
 * Provide any application specific data
 */
const AppProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('dark');
  const [navOpen, setNavOpen] = useState(false);
  const [orbitEnabled, setOrbitalEnabled] = useState(true);

  const [config, setConfig] = useState({
    base: 1,
    v0: 1,
    v1: 1,
    v2: 1,
    v3: 1,
    v4: 1,
    // j0: 2,
    // j1: 1,
    // j2: 0.5,
    // j3: 0.5,
    // j4: -1,
    // j5: 0,
    j0: Math.PI / 2,
    j1: 0,
    j2: Math.PI / 2,
    // j2: 0,
    j3: 0,
    j4: Math.PI / 2,
    // j4: 0,
    j5: 0,
    x: 1,
    y: 1,
    z: 1,
    a: 0,
    b: 0,
    c: 0,
  });

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    document.getElementById('app-html').classList.toggle('spectrum--light');
    document.getElementById('app-html').classList.toggle('spectrum--darkest');
  };

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  const toggleOrbital = () => {
    setOrbitalEnabled((prev) => !prev);
  };

  const value = {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    navOpen,
    closeNav,
    toggleNav,
    config,
    setConfig,
    RobotKin,
    orbitEnabled,
    toggleOrbital,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
