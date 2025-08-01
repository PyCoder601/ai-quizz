import { motion } from 'framer-motion';
import { logout } from '../apis/api.ts';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectQuota, selectUser } from '../features/userSlice.ts';
// import React from 'react';

function Header() {
  const quota = useSelector(selectQuota);
  const user = useSelector(selectUser);

  const getQuotaClass = () => {
    if (quota.quota_remaining > 2) return 'bg-green-500/10 text-green-400';
    if (quota.quota_remaining > 0) return 'bg-orange-500/10 text-orange-400';
    return 'bg-red-500/10 text-red-400';
  };
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className='sticky top-0 z-50 mx-auto max-w-4xl text-slate-100 shadow-lg backdrop-blur-lg'
    >
      <header className='mb-2 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <Link to={'/'} className='text-2xl font-bold'>
            QUIZEO
          </Link>
          <div className='flex items-center gap-4'>
            {user === null && <Link to={'/a-propos'}>À propos</Link>}
            <Link to={'/a-propos'}>À propos</Link>
            {user !== null && (
              <>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-slate-400'>
                    Quiz restants :
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getQuotaClass()}`}
                  >
                    {quota.quota_remaining}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className='rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600'
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </motion.header>
  );
}

export default Header;
