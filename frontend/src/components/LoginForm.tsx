import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import loadingImgW from '../assets/loading-w.gif';
import loadingImgB from '../assets/loading-b.gif';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitted(true);
    
    try {
      const loggedIn = await login(email, password);

      if (loggedIn) {
        navigate('/');
      }
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setSubmitted(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center font-bold">Login</h2>
        
        <div className="mb-2 mt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
            required
            className="w-full rounded-md border border-slate-600 p-2"
          />
        </div>

        {submitted && <img className="w-8 mt-1" src={loadingImgB} alt="Loading gif"/>}
        {error && <div className="text-red-600 mt-1">{error}</div>}

        <div className="mt-2">
          <button 
            type="submit" 
            className="p-2 rounded-sm border border-slate-500 hover:border-indigo-500 hover:bg-indigo-100" 
            disabled={submitted}
          >
            Log In
          </button>
          <p className="inline ms-2">
            Not registered? <NavLink to="/signup" className="text-indigo-600 hover:text-indigo-400">Sign up</NavLink>
          </p>
        </div>
      </form>
    </div>
  );
};