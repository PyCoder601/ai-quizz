import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './page/Home.tsx';
import Dashboard from './page/Dashboard.tsx';
import Layout from './component/Layout.tsx';
import About from './page/About.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    path: '/',
  },
  {
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    path: '/espace-compte',
  },
  {
    element: (
      <Layout>
        <About />
      </Layout>
    ),
    path: '/a-propos',
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
