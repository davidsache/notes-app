import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-screen justify-center items-center p-4 text-sm sm:text-base md:text-lg">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  return children;
};