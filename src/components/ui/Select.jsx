// Soubor: src/components/ui/Select.jsx
import React from 'react';

export const Select = ({ className = '', children, ...props }) => {

    // Stejné styly jako u inputu
    const baseClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

    // Spojíme základní styly s těmi, co přijdou zvenku (např. "w-1/3")
    const finalClass = `${baseClass} ${className}`;

    return (
        <select
            className={finalClass}
            {...props} // Předá všechny ostatní props: value, {...register...} atd.
        >
            {children} {/* Toto je důležité pro <option> */}
        </select>
    );
};