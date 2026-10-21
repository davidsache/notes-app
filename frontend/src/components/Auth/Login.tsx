import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { Loading } from '../Loading';
import { ErrorText } from '../ErrorText';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitted(true);
    
    try {
      const loggedIn = await login(email, password);

      if (loggedIn) {
        navigate('/', { replace: true });
      }
    } 
    catch (err) {
      setSubmitted(false);

      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleSignupLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (submitted) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm sm:max-w-md rounded-lg p-5 sm:p-6 md:p-8 shadow-md bg-white dark:bg-slate-800">
        <h2 className="text-center font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
          {t('Login.login')}
        </h2>
        
        <div className="mb-2.5 sm:mb-3 mt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            maxLength={255}
            required
            className="w-full rounded-md border border-slate-600 p-2 sm:p-2.5 text-xs sm:text-sm md:text-base"
          />
        </div>
        
        <div className="mb-2.5 sm:mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('Login.password')}
            minLength={8}
            required
            className="w-full rounded-md border border-slate-600 p-2 sm:p-2.5 text-xs sm:text-sm md:text-base"
          />
        </div>

        {submitted && <Loading/>}
        {error && <ErrorText error={error} darkerText={false}/>}

        <div className="mt-3">
          <p>
            <button 
              type="submit" 
              className="p-2 sm:p-2.5 rounded-sm border w-full border-slate-500 text-xs 
              sm:text-sm md:text-base hover:border-indigo-500 hover:bg-indigo-100 
              disabled:bg-slate-300 disabled:border-slate-500 dark:hover:border-sky-500 
              dark:hover:bg-sky-700 transition-colors" 
              disabled={submitted}
            >
              {t('Login.access')}
            </button>
          </p>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-center sm:text-left">
            {t('Login.notRegistered')}&nbsp;
            <NavLink onClick={(e) => handleSignupLink(e)} to="/signup" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              {t('Login.signUp')}
            </NavLink>
          </p>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-center sm:text-left">
            {t('Login.forgotPassword')}&nbsp;
            <NavLink to="/reset" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              {t('Login.resetPassword')}
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
};