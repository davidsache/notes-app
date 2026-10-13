import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { Loading } from '../Loading';
import { ErrorText } from '../ErrorText';

export const Login: React.FC = () => {
  const { login } = useAuth();
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg p-8 shadow-md bg-white dark:bg-slate-800">
        <h2 className="text-center font-bold">Login</h2>
        
        <div className="mb-2 mt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            maxLength={255}
            required
            className="w-full rounded-md border border-slate-600 p-2"
          />
        </div>
        
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={8}
            required
            className="w-full rounded-md border border-slate-600 p-2"
          />
        </div>

        {submitted && <Loading/>}
        {error && <ErrorText error={error} darkerText={false}/>}

        <div className="mt-2">
          <p>
            <button 
              type="submit" 
              className="p-2 rounded-sm border w-full border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 disabled:bg-slate-300 disabled:border-slate-500 dark:hover:border-sky-500 dark:hover:bg-sky-700" 
              disabled={submitted}
            >
              Log In
            </button>
          </p>
          <p className="mt-2">
            Not registered?&nbsp;
            <NavLink onClick={(e) => handleSignupLink(e)} to="/signup" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              Sign up
            </NavLink>
          </p>
          <p className="mt-2">
            Forgot your password?&nbsp;
            <NavLink to="/reset" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              Reset password
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
};