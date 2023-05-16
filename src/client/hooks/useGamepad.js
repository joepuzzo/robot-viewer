import { useContext } from 'react';
import GamepadContext from '../context/GamepadContext';

function useGamepad() {
  const gamepadContext = useContext(GamepadContext);
  return gamepadContext;
}

export default useGamepad;
