import { useState } from "react";
import { Loading } from "../Loading";
import { ErrorText } from "../ErrorText";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const NewPasswordRequest: React.FC = () => {
  const { newPasswordRequest } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmitRequest = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitted(true);
    
    try {
      await newPasswordRequest(email);
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
    finally {
      setSubmitted(false);
    }
  };

  const handleSignupLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (submitted) {
      e.preventDefault();
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
      <form onSubmit={handleSubmitRequest} className="w-full max-w-sm sm:max-w-md rounded-lg p-5 sm:p-6 md:p-8 shadow-md bg-white dark:bg-slate-800">
        <h2 className="text-center font-bold text-lg sm:text-xl md:text-2xl mb-2">
          Reset password
        </h2>
        <p className="my-2 text-xs sm:text-sm md:text-base text-center sm:text-left">
          Introduce your email address, and a password reset link will be sent to it.
        </p>
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
            Reset password
          </button>
          <p className="text-xs sm:text-sm md:text-base text-center sm:text-left">
            Not registered?&nbsp;
            <NavLink onClick={(e) => handleSignupLink(e)} to="/signup" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              Sign up
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
}