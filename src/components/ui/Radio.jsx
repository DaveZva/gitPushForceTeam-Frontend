// Soubor: src/components/ui/Radio.jsx
import React from 'react';

export const Radio = ({
                          label,          // Text, který se zobrazí (např. "Sobota")
                          value,          // Hodnota, kterou input ponese (např. "sat")
                          registration    // Sem předáme {...register("days")}
                      }) => {

    // Styly z původní <label...
    const baseClass = "flex-1 px-4 py-3 text-center transition-colors duration-200 rounded-md cursor-pointer has-[:checked]:bg-blue-600 has-[:checked]:text-white";

    return (
        <label className={baseClass}>
            <input
                type="radio"
                value={value}
                className="sr-only" // Stále ho necháváme skryté
                {...registration}   // Připojíme react-hook-form
            />
            {label}
        </label>
    );
};