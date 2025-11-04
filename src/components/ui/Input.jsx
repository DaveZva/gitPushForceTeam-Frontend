// Soubor: src/components/ui/Input.jsx
import React from 'react';

export const Input = ({ className = '', ...props }) => {

    // Styly, které jsme vzali z CatForm.jsx
    const baseClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

    // Spojíme základní styly s těmi, co přijdou zvenku (např. "w-2/3")
    const finalClass = `${baseClass} ${className}`;

    return (
        <input
            className={finalClass}
            {...props} // Předá všechny ostatní props: type, value, {...register...} atd.
        />
    );
};