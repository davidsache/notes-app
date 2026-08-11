import { type User, type AuthContextType } from "../interfaces/LoginTypes";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const API_BASE = "http://localhost:8000/public";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
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