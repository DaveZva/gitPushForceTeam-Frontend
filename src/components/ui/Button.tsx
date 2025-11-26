import React, { ReactNode, CSSProperties, MouseEventHandler } from 'react';

// Základní styly pro všechna tlačítka
const btnBase = "px-6 py-3 rounded-full font-semibold transition-all duration-300";

// Typy pro varianty
type ButtonVariant = 'primary' | 'secondary' | 'submit' | 'reset' | 'outlineDanger';

// Styly pro jednotlivé varianty
const variants: Record<ButtonVariant, string> = {
    primary: `${btnBase} bg-blue-600 text-white hover:bg-blue-700 shadow-lg`,
    secondary: `${btnBase} bg-gray-200 text-gray-800 hover:bg-gray-300`,
    submit: `${btnBase} bg-green-600 text-white hover:bg-green-700 shadow-lg disabled:opacity-50`,
    reset: `${btnBase} bg-red-100 text-red-700 hover:bg-red-200`,
    outlineDanger: `${btnBase} text-red-600 bg-white border-2 border-red-200 hover:bg-red-50 whitespace-nowrap`,
};

interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  onClick,
                                                  type = 'button',
                                                  variant = 'primary',
                                                  disabled = false,
                                                  className = '',
                                                  style = {}
                                              }) => {

    const variantClasses = variants[variant] || variants.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variantClasses} ${className}`}
            style={style}
        >
            {children}
        </button>
    );
};