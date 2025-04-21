import React, { useEffect, useState } from 'react';
import CameraContext from '../context/CameraContext';
import useApp from '../hooks/useApp';

const CameraProvider = ({ children }) => {
  const { socket } = useApp();

  const [data, setData] = useState();

  useEffect(() => {
    const dataHandler = (d) => {
      setData(d);
    };

    socket.on('camera', dataHandler);
    return () => {
      socket.removeListener('camera', dataHandler);
    };
  }, []);

  return <CameraContext.Provider value={data}>{children}</CameraContext.Provider>;
};

export default CameraProvider;
