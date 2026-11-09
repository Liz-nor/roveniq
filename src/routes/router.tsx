import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import {Toaster} from 'sonner';

import AuthLayout from '../components/layout/AuthLayout';
import Header from '../components/layout/Header';
import Home from '../pages/home/page';
import VenuesPage from '../pages/venues/page';
import VenuePage from '../pages/venue/page';
import ProfilePage from '../pages/profile/page';
import { useAuthStore } from '../lib/authStore';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />

      <Toaster position="bottom-center" richColors />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const venueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/venues/$venueId',
  component: VenuePage,
});

const venuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/venues',
  component: VenuesPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: '/login' });
    }
  },
  component: ProfilePage,
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
    homeRoute,
    venueRoute,
    authRoute.addChildren([loginRoute, registerRoute]),
    venuesRoute,
    profileRoute,
  ]),
});
