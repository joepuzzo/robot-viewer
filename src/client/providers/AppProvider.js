import React, { useEffect, useRef, useState } from 'react';
import AppContext from '../context/AppContext';
import io from 'socket.io-client';

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

  const SCALE = 2;

  const [config, setConfig] = useState({
    units: 'cm',
    base: 15,
    x0: 0,
    v0: 25,
    v1: 30,
    v2: 25,
    v3: 25,
    v4: 25,
    v5: 20,
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
    x: 70,
    y: -10,
    z: 95,
    r1: 90,
    r2: 90,
    r3: 90,
    // flip: true,
    // For other dims
    rangej0: [-180, 180],
    rangej1: [-140, 140],
    rangej2: [-115, 115],
    rangej3: [-180, 180],
    rangej4: [-90, 90],
    rangej5: [-180, 180],
    // Below is for AR -------------------------
    // base: 15,
    // x0: 6.42,
    // v0: 16.977 * SCALE,
    // v1: 30.5 * SCALE,
    // v2: 3.625 * SCALE,
    // v3: 22.263 * SCALE,
    // v4: 3.625 * SCALE,
    // v5: 20,
    // // Show off direection
    // x: 95,
    // y: 10,
    // z: 90,
    // r1: 90,
    // r2: 90,
    // r3: 90,
    // // For Zero Direction
    // // x: 0.642 * 2,
    // // y: 0,
    // // z: 18.898,
    // // r1: 0,
    // // r2: 0,
    // // r3: 0,
    // // For Limits
    // rangej0: [-170, 170],
    // rangej1: [-90, 42],
    // rangej2: [-141, 20],
    // rangej3: [-165, 165],
    // rangej4: [-100, 100],
    // rangej5: [-155, 155],
    // flip: true,
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

  const socketRef = useRef();
  useState(() => {
    const socket = io('/client', {
      transports: ['websocket'],
      secure: true,
    });
    socketRef.current = socket;
  });

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
    socket: socketRef.current,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
