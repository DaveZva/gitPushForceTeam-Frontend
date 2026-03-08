import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    if (loading) {
        return <div className="flex justify-center p-10">{t('loading')}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};