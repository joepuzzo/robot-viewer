import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';

// Components
import { Robot } from '../Pages/Robot/Robot';
import { Motor } from '../Pages/Motor/Motor';
import { NotFound } from '../Pages/NotFound/NotFound';

// Routes ------------------------------------------------------------

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Robot />} />
      <Route path="/motor" element={<Motor />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
