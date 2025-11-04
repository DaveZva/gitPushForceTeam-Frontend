// Soubor: src/components/ui/Checkbox.jsx
import React from 'react';

export const Checkbox = ({
                             id,
                             label,          // Hlavní tučný text
                             description,    // Menší text pod hlavním
                             registration,   // <-- Sem předáme {...register("jmeno")}
                             error
                         }) => {

    const consentBoxClass = "flex items-start gap-3 p-4 border border-gray-200 rounded-lg has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50 text-center";
    const checkboxClass = "w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500 shrink-0 mt-1";
    const errorBoxClass = error ? 'border-red-500 bg-red-50' : '';


    return (
        <div className={`${consentBoxClass} ${errorBoxClass}`}>
            <input
                type="checkbox"
                id={id}
                className={checkboxClass}
                {...registration} // <-- Rozbalíme registraci
            />
            <label htmlFor={id} className="cursor-pointer">
                {/* Zobrazíme label, pokud existuje */}
                {label && (
                    <strong className="text-gray-800">{label}</strong>
                )}

                {/* Zobrazíme popis, pokud existuje */}
                {description && (
                    <span className="block text-sm text-gray-600">{description}</span>
                )}

                {/* Zobrazení chybové hlášky */}
                {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </label>
        </div>
    );
};