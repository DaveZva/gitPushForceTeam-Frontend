import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {

    const baseClass = "p-6 bg-white rounded-2xl shadow-lg border border-gray-200";

    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
};