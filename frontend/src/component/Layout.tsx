import type { ReactNode } from 'react';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='min-h-screen bg-slate-900 text-slate-100'>
      <Header />
      <main className={`container mx-auto max-w-7xl px-4 py-8`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
