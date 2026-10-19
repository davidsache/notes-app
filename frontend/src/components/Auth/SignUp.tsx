import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Loading } from "../Loading";
import { ErrorText } from "../ErrorText";

export const SignUp: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitted(true);
    
    try {
      const wasSignedUp = await signup(email, username, password);
      
      if (wasSignedUp) {
        navigate('/login');
      }
    } 
    catch (err) {
      setSubmitted(false);

      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleLoginLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (submitted) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm sm:max-w-md rounded-lg p-5 sm:p-6 md:p-8 shadow-md bg-white dark:bg-slate-800">
        <h2 className="text-center font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">Sign up</h2>
        
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

        <div className="mb-2.5 sm:mb-3 mt-1">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            maxLength={50}
            required
            className="w-full rounded-md border border-slate-600 p-2 sm:p-2.5 text-xs sm:text-sm md:text-base"
          />
        </div>

        <div className="mb-2.5 sm:mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={8}
            required
            className="w-full rounded-md border border-slate-600 p-2 sm:p-2.5 text-xs sm:text-sm md:text-base"
          />
        </div>

        {submitted && <Loading/>}
        {error && <ErrorText error={error} darkerText={false}/>}

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
          <button 
            type="submit" 
            className="w-full sm:w-auto p-2 sm:px-4 sm:py-2 rounded-sm border border-slate-500 text-xs 
            sm:text-sm md:text-base hover:border-indigo-500 hover:bg-indigo-100 disabled:bg-slate-300 
            disabled:border-slate-500 dark:hover:border-sky-500 dark:hover:bg-sky-700 transition-colors shrink-0"
            disabled={submitted}
          >
            Sign Up
          </button>
          <p className="text-xs sm:text-sm md:text-base text-center sm:text-left">
            Already registered?&nbsp;
            <NavLink onClick={(e) => handleLoginLink(e)} to="/login" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              Log in
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
}