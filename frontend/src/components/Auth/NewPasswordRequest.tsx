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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmitRequest} className="w-full max-w-md rounded-lg p-8 shadow-md bg-white dark:bg-slate-800" >
        <h2 className="text-center font-bold">Reset password</h2>
        <p className="my-1">Introduce your email address, and a password reset link will be sent to it.</p>
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

        {submitted && <Loading/>}
        {error && <ErrorText error={error} darkerText={false}/>}

        <div className="mt-2">
          <button 
            type="submit" 
            className="p-2 rounded-sm border border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 disabled:bg-slate-300 disabled:border-slate-500 dark:hover:border-sky-500 dark:hover:bg-sky-700" 
            disabled={submitted}
          >
            Reset password
          </button>
          <p className="ms-2 inline">
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