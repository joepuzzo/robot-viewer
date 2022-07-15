import React from 'react';
import useAuth from '../../../hooks/useAuth';

export const Admin = () => {
  const { user } = useAuth();

  return (
    <>
      <h1 is="h1">Hello {user.name}!</h1>
      <h2 is="h2">Looks like you are an Admin!</h2>
    </>
  );
};
