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

  const [config, setConfig] = useState({
    zeroPosition: [0, 0, 100],
    units: 'cm',
    base: 10,
    x0: 0,
    y0: 0,
    v0: 15,
    v1: 20,
    v2: 15,
    v3: 15,
    v4: 15,
    v5: 10,
    // Below is for top testing
    x: 0,
    y: 0,
    z: 100,
    r1: 0,
    r2: 0,
    r3: 0,
    // Below is for sideways testing
    x: 55,
    y: 0,
    z: 45,
    r1: -90,
    r2: -90,
    r3: 0,
    // Below is for down direction
    // x: 5,
    // y: 0,
    // z: 0,
    // r1: -90,
    // r2: -180,
    // r3: 0,
    // Below is show off direction
    // x: 40,
    // y: 5,
    // z: 60,
    // r1: 90,
    // r2: 90,
    // r3: 90,
    // flip: true,
    // For other dims
    rangej0: [-180, 180],
    rangej1: [-140, 140],
    rangej2: [-115, 115],
    rangej3: [-180, 180],
    rangej4: [-90, 90],
    rangej5: [-180, 180],
    // Below is for AR -------------------------
    zeroPosition: [6.42, 0, 83.365],
    x0: 6.42,
    // Below three should add up to 474.77 mm ( 47.477 cm )
    base: 3.11,
    v0: 13.867,
    v1: 30.5,
    // Below three should add up to 258.88 mm ( 25.888 cm )
    v2: 3.5,
    v3: 18.763,
    v4: 3.625,
    // Distance to the end effector
    v5: 10,
    // Show off direection
    x: 45,
    y: 10,
    z: 50,
    r1: 90,
    r2: 90,
    r3: 90,
    // For Zero Direction
    // x: 6.42,
    // y: 0,
    // z: 83.365,
    // // x: 40,
    // // z: 60,
    // r1: 0,
    // r2: 0,
    // r3: 0,
    // For 30deg Direction
    // x: 40,
    // y: -20,
    // z: 60,
    // r1: 60,
    // r2: 90,
    // r3: 90,
    // For Limits
    rangej0: [-170, 170],
    rangej1: [-90, 42],
    rangej2: [-141, 20],
    rangej3: [-165, 165],
    rangej4: [-100, 100],
    rangej5: [-155, 155],
    flip: true,
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
