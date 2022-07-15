import React from 'react';
import { Routes as RouterRoutes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Components
import { Home } from '../Pages/Home/Home';
import { Admin } from '../Pages/Admin/Admin';
import { NotFound } from '../Pages/NotFound/NotFound';
import { NotAuthorized } from '../Pages/NotAuthorized/NotAuthorized';

// Default Route Generation ------------------------------------------------------------

const getDefaultRoute = (user) => {
  const { permissions } = user;
  if (permissions.includes('ADMIN')) {
    return '/admin';
  }
  if (permissions.includes('USER')) {
    return '/home';
  }
  return 'unauthorized';
};

// Index Route Route Generation ------------------------------------------------------------

const Index = () => {
  const { user } = useAuth();

  return <Navigate to={getDefaultRoute(user)} />;
};

// Restrict Routes ------------------------------------------------------------

// Map route ---> permission_list [...]
export const RESTRICTED_ROUTES = {
  '/admin': ['ADMIN'],
};

// Returns true or false depending on if user has permission
const allowed = (user, path) => {
  // If there is no known restricted path return true
  if (!RESTRICTED_ROUTES[path]) {
    return true;
  }
  // The user must have at least one of the permissions
  return RESTRICTED_ROUTES[path].some((permission) => user.permissions.includes(permission));
};

// Routes ------------------------------------------------------------

export const Routes = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Redirect the user to unauthorized if they are not allowed
  if (!allowed(user, location.pathname)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/unauthorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
