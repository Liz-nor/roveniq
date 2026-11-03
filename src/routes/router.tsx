import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import AuthLayout from '../components/layout/AuthLayout';
import Header from '../components/layout/Header';
import Home from '../pages/home/page';
import VenuePage from '../pages/venue/page';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Home,
});

const venueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/venues/$venueId',
  component: VenuePage,
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
    homeRoute,
    venueRoute,
    authRoute.addChildren([loginRoute, registerRoute]),
  ]),
});
