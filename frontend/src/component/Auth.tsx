import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { LoginType, SignupType } from '../types.ts';
import React from 'react';
import api from '../apis/api.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store.ts';
import { loginUser } from '../features/userSlice.ts';

function Auth() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const [loginForm, setLoginForm] = useState<LoginType>({
    username: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState<SignupType>({
    username: '',
    password: '',
    email: '',
  });

  const handleLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignupForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/token', loginForm, {
        withCredentials: true,
      });
      const { data } = res;
      sessionStorage.setItem('access_token', data.access_token);
      dispatch(
        loginUser({
          user: data.user,
          quizzes: data.quizzes,
          curr_quiz: null,
          quota: data.quota,
        }),
      );
      window.location.href = '/espace-compte';
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (err.response?.status === 401) {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        setError('Une erreur de connexion est survenue.');
      }
    } finally {
      setLoginForm({ username: '', password: '' });
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/sign-up', signupForm, {
        withCredentials: true,
      });
      const { data } = res;
      sessionStorage.setItem('access_token', data.access_token);
      dispatch(
        loginUser({
          user: data.user,
          quizzes: data.quizzes,
          curr_quiz: null,
          quota: data.quota,
        }),
      );
      window.location.href = '/espace-compte';
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (err.response?.status === 400) {
        setError("Cet nom d'utilisateur ou email est déjà pris.");
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setSignupForm({ username: '', password: '', email: '' });
      setIsLoading(false);
    }
  };

  const AuthForm = ({ isLogin }: { isLogin: boolean }) => (
    <form className='space-y-6' onSubmit={isLogin ? handleLogin : handleSignup}>
      <div>
        <label
          htmlFor={isLogin ? 'login-username' : 'signup-username'}
          className='mb-2 block text-sm font-medium text-slate-400'
        >
          Nom d'utilisateur
        </label>
        <div className='relative'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-5 w-5 text-slate-400'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
              />
            </svg>
          </span>
          <input
            id={isLogin ? 'login-username' : 'signup-username'}
            type='text'
            className='text-slate-100 focus:ring-teal-500 w-full rounded-lg border border-slate-700 bg-slate-700 p-3 pl-10 focus:ring-1 focus:outline-none'
            onChange={isLogin ? handleLoginForm : handleSignupForm}
            value={isLogin ? loginForm.username : signupForm.username}
            placeholder='nom_utilisateur'
            name='username'
            required
          />
        </div>
      </div>
      {!isLogin && (
        <div>
          <label
            htmlFor='signup-email'
            className='mb-2 block text-sm font-medium text-slate-400'
          >
            Email
          </label>
          <div className='relative'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-5 w-5 text-slate-400'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
                />
              </svg>
            </span>
            <input
              id='signup-email'
              type='email'
              className='border-slate-700 bg-slate-700 text-slate-100 focus:border-teal-500 focus:ring-teal-500 w-full rounded-lg border p-3 pl-10 focus:ring-1 focus:outline-none'
              name='email'
              placeholder='votre@email.com'
              onChange={handleSignupForm}
              value={signupForm.email}
              required
            />
          </div>
        </div>
      )}
      <div>
        <label
          htmlFor={isLogin ? 'login-password' : 'signup-password'}
          className='mb-2 block text-sm font-medium text-slate-400'
        >
          Mot de passe
        </label>
        <div className='relative'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-5 w-5 text-slate-400'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
              />
            </svg>
          </span>
          <input
            id={isLogin ? 'login-password' : 'signup-password'}
            type='password'
            className='border-slate-700 bg-slate-700 text-slate-100 focus:border-teal-500 focus:ring-teal-500 w-full rounded-lg border p-3 pl-10 focus:ring-1 focus:outline-none'
            name='password'
            onChange={isLogin ? handleLoginForm : handleSignupForm}
            value={isLogin ? loginForm.password : signupForm.password}
            placeholder='••••••••'
            required
          />
        </div>
      </div>
      <motion.button
        type='submit'
        disabled={isLoading}
        whileHover={{ scale: !isLoading ? 1.02 : 1 }}
        whileTap={{ scale: !isLoading ? 0.98 : 1 }}
        className={`w-full rounded-full px-6 py-3 text-base font-semibold text-white transition-all duration-200 ${
          isLoading
            ? 'cursor-not-allowed bg-slate-500'
            : 'bg-teal-500 hover:bg-teal-600 shadow-lg'
        }`}
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <svg
              className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            {isLogin ? 'Connexion...' : 'Création...'}
          </div>
        ) : isLogin ? (
          'Se connecter'
        ) : (
          'Créer un compte'
        )}
      </motion.button>
    </form>
  );

  return (
    <div className='mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 text-slate-100 shadow-2xl sm:p-8'>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400'
        >
          {error}
        </motion.div>
      )}
      <div className='bg-slate-700 mb-6 flex justify-center rounded-lg p-1'>
        <button
          className={`w-full rounded-md px-6 py-2 text-sm font-semibold transition-colors ${isLogin ? 'bg-teal-500 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          onClick={() => {
            setIsLogin(true);
            setError('');
          }}
        >
          Connexion
        </button>
        <button
          className={`w-full rounded-md px-6 py-2 text-sm font-semibold transition-colors ${!isLogin ? 'bg-teal-500 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          onClick={() => {
            setIsLogin(false);
            setError('');
          }}
        >
          Inscription
        </button>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          <AuthForm isLogin={isLogin} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Auth;
