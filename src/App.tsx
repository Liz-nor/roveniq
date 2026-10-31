import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import Header from './components/layout/Header';
function App() {
  return (
    <>
      <Header />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
