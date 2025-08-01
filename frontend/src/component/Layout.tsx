import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='min-h-screen bg-slate-900 text-slate-100'>
      {isHomePage && <Header />}
      <main
        className={`container mx-auto px-4 py-8 ${isHomePage ? '' : 'max-w-4xl'}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
