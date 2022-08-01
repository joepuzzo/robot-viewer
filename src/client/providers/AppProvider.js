import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppContext from '../context/AppContext';
import RobotContext from '../context/RobotContext';

const geometry = [
  [0, 2, 0], // V0: 0x 2y
  [0, 2, 0], // V1: 0x 2y
  [0, 2, 0], // V2: 0x 2y
  [0, 0, 0], // V3: 2x 0y
  [0, 0, 0], // V4: 0x 2y
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

/**
 * Provide any application specific data
 */
const AppProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('dark');
  const [navOpen, setNavOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [orbitEnabled, setOrbitalEnabled] = useState(true);

  const setBall = useRef();

  // Define control
  const control = {
    setBall,
  };

  const [config, setConfig] = useState({
    // base: 1,
    // v0: 1,
    // v1: 1,
    // v2: 1,
    // v3: 1,
    // v4: 1,
    // v5: 1,
    base: 1.5,
    v0: 2.5,
    v1: 3,
    v2: 2.5,
    v3: 2.5,
    v4: 2.5,
    v5: 2,
    // Below is for top testing
    // x: 5,
    // y: 0,
    // z: 11.5,
    // r1: 0,
    // r2: 0,
    // r3: 0,
    // Below is for sideways testing
    // x: 9.5,
    // y: 0,
    // z: 7,
    // r1: -90,
    // r2: -90,
    // r3: 0,
    // Below is for down direction
    // x: 5,
    // y: 0,
    // z: 0,
    // r1: -90,
    // r2: -180,
    // r3: 0,
    // Below is show off direction
    x: 7,
    y: -1,
    z: 9.5,
    r1: -90,
    r2: -90,
    r3: 0,
    // For other dims
    rangej0: [-180, 180],
    rangej1: [-140, 140],
    rangej2: [-115, 115],
    rangej3: [-180, 180],
    rangej4: [-90, 90],
    rangej5: [-180, 180],
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

  const toggleExtra = () => {
    setExtraOpen((prev) => !prev);
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
    orbitEnabled,
    toggleOrbital,
    control,
    extraOpen,
    toggleExtra,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
