// Soubor: src/components/ui/TextArea.jsx
import React from 'react';

export const TextArea = ({
                             id,
                             label,
                             placeholder,
                             rows = 5,
                             className = '',
                             registration, // <-- Sem předáme {...register("jmeno")}
                             error
                         }) => {

    // Základní styly
    const baseClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";
    // Styly pro chybu
    const errorClass = error ? 'ring-2 ring-red-500' : '';

    return (
        <div className="flex flex-col gap-2">
            {/* Popisek (label) zobrazíme, jen pokud je definován */}
            {label && (
                <label htmlFor={id} className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                rows={rows}
                placeholder={placeholder}
                className={`${baseClass} ${errorClass} ${className}`}
                {...registration} // <-- Rozbalíme zde registraci z react-hook-form
            />
            {/* Zobrazení chybové hlášky */}
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};