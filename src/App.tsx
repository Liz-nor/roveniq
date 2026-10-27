import { createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import './App.css';

const rootRoute = createRootRoute();
const router = createRouter({ routeTree: rootRoute });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
