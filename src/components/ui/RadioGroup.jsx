// Soubor: src/components/ui/RadioGroup.jsx
import React from 'react';

export const RadioGroup = ({ children, className = '' }) => {

    // Styly z původního <div...
    const baseClass = "flex flex-col p-2 space-y-2 bg-gray-100 rounded-lg sm:flex-row sm:space-y-0 sm:space-x-2";

    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
};