import { motion } from 'framer-motion';
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
  const [LoginForm, setLoginForm] = useState<LoginType>({
    username: '',
    password: '',
  });

  const [SignupForm, setSignupForm] = useState<SignupType>({
    username: '',
    password: '',
    email: '',
  });

  const handleLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...LoginForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignupForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({
      ...SignupForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/token', LoginForm);
      const { data } = res;
      sessionStorage.setItem('access_token', data.access_token);
      dispatch(
        loginUser({
          user: data.user,
          quizzes: data.quizzes,
          curr_quiz: null,
        }),
      );
      window.location.href = '/espace-compte';
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.status === 401) {
        setError("Nom d'utilisateur ou mot de passe incorrect");
      } else setError('Erreur de connexion');
    } finally {
      setLoginForm({
        username: '',
        password: '',
      });
      setIsLoading(false);
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/sign-up', SignupForm);
      const { data } = res;
      sessionStorage.setItem('access_token', data.access_token);
      dispatch(
        loginUser({
          user: data.user,
          quizzes: data.quizzes,
          curr_quiz: null,
        }),
      );
      window.location.href = '/espace-compte';
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.status === 400) {
        setError("Nom d'utilisateur existe déjà");
      } else setError('Erreur de connexion');
    } finally {
      setSignupForm({
        username: '',
        password: '',
        email: '',
      });
      setIsLoading(false);
    }
  };
  return (
    <div className='mx-auto max-w-md rounded-lg bg-[#1c2e42] p-6 shadow-xl'>
      {error && <p className={'text-center'}>{error}</p>}
      <div className='mb-6 flex justify-center'>
        <button
          className={`px-6 py-2 ${isLogin ? 'btn-grad text-white' : 'bg-transparent text-gray-300'} rounded-l-lg transition-colors`}
          onClick={() => setIsLogin(true)}
        >
          Connexion
        </button>
        <button
          className={`px-6 py-2 ${!isLogin ? 'btn-grad text-white' : 'bg-transparent text-gray-300'} rounded-r-lg transition-colors`}
          onClick={() => setIsLogin(false)}
        >
          Inscription
        </button>
      </div>

      {isLogin ? (
        <form className='space-y-4' onSubmit={handleLogin}>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Nom d'utilisateur
            </label>
            <input
              type='text'
              className={
                'w-full rounded border border-gray-600' +
                ' bg-[#2a4562] p-3 focus:border-blue-400 focus:outline-none'
              }
              onChange={handleLoginForm}
              value={LoginForm.username}
              placeholder='nom_utilisateur'
              name={'username'}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Mot de passe
            </label>
            <input
              type='password'
              className={
                'w-full rounded border border-gray-600 bg-[#2a4562] ' +
                'p-3 focus:border-blue-400 focus:outline-none'
              }
              name={'password'}
              onChange={handleLoginForm}
              value={LoginForm.password}
              placeholder='••••••••'
            />
          </div>
          {/*<div className='flex items-center justify-between'>*/}
          {/*  <a href='#' className='text-sm text-blue-400 hover:underline'>*/}
          {/*    Mot de passe oublié ?*/}
          {/*  </a>*/}
          {/*</div>*/}
          <motion.button
            type='submit'
            disabled={isLoading}
            whileHover={{ scale: !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: !isLoading ? 0.98 : 1 }}
            className={`w-full rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ${
              isLoading
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-[#243B55] text-white shadow-lg hover:bg-[#243B5F] hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='mr-3 h-5 w-5 animate-spin text-white'
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
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                     5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Connexion en cours...
              </div>
            ) : (
              'Se connecter'
            )}
          </motion.button>
        </form>
      ) : (
        <form className='space-y-4' onSubmit={handleSignup}>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Nom d'utilisateur
            </label>
            <input
              type='text'
              className={
                'w-full rounded border border-gray-600 bg-[#2a4562] ' +
                'p-3 focus:border-blue-400 focus:outline-none'
              }
              name={'username'}
              placeholder='Nom_utilisateur'
              onChange={handleSignupForm}
              value={SignupForm.username}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>Email</label>
            <input
              type='email'
              className={
                'w-full rounded border border-gray-600 bg-[#2a4562] ' +
                'p-3 focus:border-blue-400 focus:outline-none'
              }
              name={'email'}
              placeholder='votre@email.com'
              onChange={handleSignupForm}
              value={SignupForm.email}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              Mot de passe
            </label>
            <input
              type='password'
              className={
                'w-full rounded border border-gray-600 ' +
                'bg-[#2a4562] p-3 focus:border-blue-400 focus:outline-none'
              }
              placeholder='••••••••'
              name={'password'}
              value={SignupForm.password}
              onChange={handleSignupForm}
            />
          </div>
          <div>
            {/*<label className='mb-1 block text-sm font-medium'>*/}
            {/*  Confirmer le mot de passe*/}
            {/*</label>*/}
            {/*<input*/}
            {/*  type='password'*/}
            {/*  className='w-full rounded border border-gray-600 bg-[#2a4562] p-3 focus:border-blue-400 focus:outline-none'*/}
            {/*  placeholder='••••••••'*/}
            {/*/>*/}
          </div>
          <motion.button
            type='submit'
            disabled={isLoading}
            whileHover={{ scale: !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: !isLoading ? 0.98 : 1 }}
            className={`w-full rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ${
              isLoading
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-[#243B55] text-white shadow-lg hover:bg-[#243B5F] hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='mr-3 h-5 w-5 animate-spin text-white'
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
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                     5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Création compte ...
              </div>
            ) : (
              'Créer un compte'
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
}

export default Auth;
