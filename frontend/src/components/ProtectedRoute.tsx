import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center p-4 text-sm sm:text-base md:text-lg">
        {t('ProtectedRoute.loading')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  return children;
};