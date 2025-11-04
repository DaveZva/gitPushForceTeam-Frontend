// Soubor: src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className = '' }) => {

    // Styly z wrapperu v CatForm.jsx
    const baseClass = "p-6 bg-white rounded-2xl shadow-lg border border-gray-200";

    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
};