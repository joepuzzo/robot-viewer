import React, { Suspense } from 'react';
import { Debug } from 'informed';
import useGet from '../../../hooks/useGet';
import useAuth from '../../../hooks/useAuth';
import { Canvas } from '@react-three/fiber';
import { Box } from '../../3D/Box';

export const Home = () => {
  const { user } = useAuth();

  const { loading, error, data } = useGet({
    url: '/health',
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <>
      <h1>Hello {user.name}!</h1>
      <h2>Health Check {data.status}</h2>
      <Canvas>
        <Suspense fallback={null}>
          <Box />
        </Suspense>
      </Canvas>
    </>
  );
};
