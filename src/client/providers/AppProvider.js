import React, { useRef, useState } from 'react';
import AppContext from '../context/AppContext';
import io from 'socket.io-client';

/**
 * Provide any application specific data
 */
const AppProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('dark');
  const [navOpen, setNavOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(true);
  const [orbitEnabled, setOrbitalEnabled] = useState(true);

  const setBall = useRef();

  // Define control
  const control = {
    setBall,
  };

  const [config, setConfig] = useState({
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
