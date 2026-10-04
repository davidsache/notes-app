import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Loading } from "../Loading";
import { ErrorText } from "../ErrorText";
import { useAuth } from "../../context/AuthContext";

export const NewPassword: React.FC = () => {
  const { changePassword, passwordRequestExists, passwordRequest } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [expired, setExpired] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    passwordRequestExists(token).then((exists) => {
      if (!exists) {
        navigate('/');
      }
    });
  }, [token, passwordRequestExists, navigate]);

  useEffect(() => {
    if (passwordRequest?.expires_at) {
      const formattedData = passwordRequest.expires_at.replace(' ', 'T') + 'Z';
      const hasExpired = new Date(formattedData).getTime() < Date.now();
      setExpired(hasExpired);

      if (hasExpired) {
        setError("The request has expired, try requesting a new one.");
      }
    }
  }, [passwordRequest]);
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (expired || submitted || success) {
      return;
    }

    if (password !== passwordConfirm) {
      setError("The password must be the same in both fields.");
      return;
    }

    setError('');
    setSubmitted(true);

    try {
      if (await changePassword(passwordRequest!.user_id, password)) {
        setSuccess(true);
      }
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg p-8 shadow-md bg-white dark:bg-slate-800">
        <h2 className="text-center font-bold">Change your password</h2>
        
        <div className="mb-2 mt-1">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            maxLength={255}
            required
            className="w-full rounded-md border border-slate-600 p-2"
            disabled={expired || success}
          />
        </div>
        
        <div>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Repeat password"
            minLength={8}
            required
            className="w-full rounded-md border border-slate-600 p-2"
            disabled={expired || success}
          />
        </div>

        {submitted && (
          <div className="my-2">
            <Loading/>
          </div>
        )}
        {error && (
          <div className="my-2">
            <ErrorText error={error} darkerText={false}/>
          </div>
        )}
        {expired && (
          <p className="my-2">
            Request a new&nbsp;
            <NavLink to="/reset" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              password change
            </NavLink>
          </p>
        )}
        {success && (
          <p className="my-2">
            Your password was changed, now you can&nbsp;
            <NavLink to="/login" className="text-indigo-600 hover:text-indigo-400 dark:text-sky-400">
              log in
            </NavLink>
          </p>
        )}

        <div className="mt-2">
          <p>
            <button 
              type="submit" 
              className="p-2 rounded-sm border w-full border-slate-500 hover:border-indigo-500 hover:bg-indigo-100 disabled:bg-slate-300 disabled:border-slate-500 dark:hover:border-sky-500 dark:hover:bg-sky-700" 
              disabled={submitted || expired || success}
            >
              Change password
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}