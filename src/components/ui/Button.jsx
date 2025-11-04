import React from 'react';

// Základní styly pro všechna tlačítka
const btnBase = "px-6 py-3 rounded-full font-semibold transition-all duration-300";

// Styly pro jednotlivé varianty
const variants = {
    primary: `${btnBase} bg-blue-600 text-white hover:bg-blue-700 shadow-lg`,
    secondary: `${btnBase} bg-gray-200 text-gray-800 hover:bg-gray-300`,
    submit: `${btnBase} bg-green-600 text-white hover:bg-green-700 shadow-lg disabled:opacity-50`,
    reset: `${btnBase} bg-red-100 text-red-700 hover:bg-red-200`,

    // Náš NOVÝ styl pro "Odebrat kočku"
    // (upravil jsem padding z px-5 na px-6 aby seděl k btnBase)
    outlineDanger: `${btnBase} text-red-600 bg-white border-2 border-red-200 hover:bg-red-50 whitespace-nowrap`,
};

export const Button = ({
                           children,                   // Text nebo ikona uvnitř tlačítka
                           onClick,                    // Funkce, která se zavolá po kliknutí
                           type = 'button',            // Typ tlačítka (button, submit)
                           variant = 'primary',        // 'primary', 'secondary', 'submit', 'reset', 'outlineDanger'
                           disabled = false,           // Jestli je tlačítko neaktivní
                           className = '',             // Pro přidání jakýchkoliv dalších stylů
                           style = {}                  // Pro speciální případy (jako 'visibility')
                       }) => {

    const variantClasses = variants[variant] || variants.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variantClasses} ${className}`} // Spojí styly varianty a extra styly
            style={style}
        >
            {children}
        </button>
    );
};