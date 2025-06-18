import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './page/Home.tsx';
import Dashboard from './page/Dashboard.tsx';

const router = createBrowserRouter([
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <Dashboard />,
    path: '/espace-compte',
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
