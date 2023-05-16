import React, { useCallback, useEffect, useState } from 'react';
import GamepadContext from '../context/GamepadContext';

const GamepadProvider = ({ children }) => {
  const [connected, setConnected] = useState();
  const [gamepad, setGamepad] = useState({});
  const [buttons, setButtons] = useState([]);
  const [axes, setAxes] = useState([]);

  const handleConnect = useCallback((event) => {
    const gamepad = event.gamepad;
    console.log('Connect', gamepad);

    setConnected(true);
    setGamepad(gamepad);
    setButtons(gamepad.buttons);
    setAxes(gamepad.axes);
  }, []);

  const handleDisconnect = useCallback(() => {
    const gamepad = event.gamepad;
    console.log('Disconnect', gamepad);

    setConnected(false);
  }, []);

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    return () => {
      if (handleConnect) {
        window.removeEventListener('gamepadconnected', handleConnect);
        window.removeEventListener('gamepaddisconnected', handleDisconnect);
        setGamepad({});
        setButtons([]);
        setAxes([]);
      }
    };
  }, []);

  const value = {
    buttons,
    axes,
    gamepad,
    connected,
    setButtons,
    setAxes,
  };

  return <GamepadContext.Provider value={value}>{children}</GamepadContext.Provider>;
};

export default GamepadProvider;
