import { type PasswordResetRequest, type User } from "../interfaces/AuthTypes";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  passwordRequest: PasswordResetRequest | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  newPasswordRequest: (email: string) => Promise<boolean>;
  changePassword: (userId: string, newPassword: string) => Promise<boolean>;
  passwordRequestExists: (token: string) => Promise<boolean>;
}

const API_BASE = "http://localhost:8000/public";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [passwordRequest, setPasswordRequest] = useState<PasswordResetRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/CheckAuth.php`, {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
      else {
        setUser(null);
      }
    }
    catch (err) {
      setUser(null);
    }
    finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await res.json();
    setUser(data.user);

    return true;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/logout.php`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/signup.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Signup failed');
    }

    return true;
  };

  const newPasswordRequest = async (email: string) => {
    const res = await fetch(`${API_BASE}/changePasswordRequest.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    console.log(res)

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Password reset request failed');
    }

    return true;
  }

  const changePassword = async (userId: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/changePassword.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ "user_id": userId, "password": newPassword })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'The password could not be changed.');
    }

    return true;
  }

  const passwordRequestExists = async (token: string) => {
    const res = await fetch(`${API_BASE}/changePasswordRequest.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token })
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    setPasswordRequest(data.request);

    return true;
  }

  return (
    <AuthContext.Provider value={{ 
      user, passwordRequest, isLoading, 
      login, logout, signup, 
      newPasswordRequest, changePassword, passwordRequestExists
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};