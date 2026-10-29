import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import AuthLayout from '../components/layout/AuthLayout';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' });
  },
});

// Shared layout stays mounted between /login and /register so the panel can slide.
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/login',
});

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/register',
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    authRoute.addChildren([loginRoute, registerRoute]),
  ]),
});
