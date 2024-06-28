import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppContext from '../context/AppContext';
import io from 'socket.io-client';
import { useGet } from '../hooks/useGet';

// import IgusRebel from '../../../robots/IgusRebel.json';
import Example from '../../../robots/Example.json';

/**
 * Provide any application specific data
 */
const AppProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('dark');
  const [navOpen, setNavOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [orbitEnabled, setOrbitalEnabled] = useState(true);

  const setBall = useRef();

  // Define control
  const control = {
    setBall,
  };

  const [config, setConfig] = useState(Example);

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
    [robotTypes],
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
    document.getElementById('app').classList.toggle('app-extra');
  };

  const toggleData = () => {
    setDataOpen((prev) => !prev);
  };

  const closeData = () => {
    setDataOpen(false);
  };

  const orbitControl = useRef();
  const cameraControl = useRef();

  // Socket Connection
  const key = new URLSearchParams(window.location.search).get('key');
  const socketRef = useRef();

  useState(() => {
    const socket = io(`/client?key=${key}`, {
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
    toggleData,
    dataOpen,
    closeData,
    robotTypes,
    selectRobot,
    socket: socketRef.current,
    orbitControl,
    cameraControl,
    key,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
