import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';

// Components
import { Cookbook } from '../Pages/Cookbook/Cookbook';
import { Robot } from '../Pages/Robot/Robot';
import { Motor } from '../Pages/Motor/Motor';
import { NotFound } from '../Pages/NotFound/NotFound';
import { Framer } from '../Pages/Framer/Framer';

// Routes ------------------------------------------------------------

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Robot />} />
      <Route path="/motor" element={<Motor />} />
      <Route path="/cookbook" element={<Cookbook />} />
      <Route path="/framer" element={<Framer />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
