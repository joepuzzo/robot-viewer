import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppContext from '../context/AppContext';
import io from 'socket.io-client';
import { useGet } from '../hooks/useGet';

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
    // Default is for example robot
    robotType: 'Example',
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
    x: 45,
    y: 10,
    z: 55,
    r1: 90,
    r2: 90,
    r3: 90,
    rangej0: [-180, 180],
    rangej1: [-140, 140],
    rangej2: [-115, 115],
    rangej3: [-180, 180],
    rangej4: [-90, 90],
    rangej5: [-180, 180],
  });

  // Get robot types
  const [{ data: robotTypes, loading: getLoading, error: getError }, getRobotTypes] = useGet();

  useEffect(() => {
    getRobotTypes({ url: `/robots/all` });
  }, []);

  const selectRobot = useCallback(
    ({ value }) => {
      console.log('SELECTING ROBOT', value);
      console.log('TYPES', robotTypes[value]);
      setConfig(robotTypes[value]);
    },
    [robotTypes]
  );

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
    robotTypes,
    selectRobot,
    socket: socketRef.current,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
