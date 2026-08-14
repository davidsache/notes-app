import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { SignUp } from './components/SignUp';
import { ThemeContext } from './context/ThemeContext';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('notesApp-darkMode');
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialModeIsDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);

    setDarkMode(initialModeIsDark);

    if (initialModeIsDark) {
      document.documentElement.classList.add('dark');
    }
    else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'dark');
    }
    else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'light');
    }
  };

  const themeContextValue = { darkMode, toggleTheme };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeContext.Provider>
  );
};