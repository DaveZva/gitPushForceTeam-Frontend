import React, { ReactNode, CSSProperties, MouseEventHandler } from 'react';

// Základní styly pro všechna tlačítka
const btnBase = "px-6 py-3 rounded-full font-semibold transition-all duration-300";

// Typy pro varianty
type ButtonVariant = 'primary' | 'secondary' | 'submit' | 'reset' | 'outlineDanger';

// Styly pro jednotlivé varianty
const variants: Record<ButtonVariant, string> = {
    primary: `${btnBase} border-2 border-transparent px-[1.2em] py-[0.6em] text-[1em] font-bold tracking-[-1px] leading-[20px] bg-[#027BFF] text-white flex justify-center items-center transition-all duration-200 ease-linear hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]`,
    secondary: `${btnBase} bg-gray-200 text-gray-800 border-2 border-transparent hover:bg-transparent hover:border-gray-800 hover:text-gray-800`,
    submit: `${btnBase} bg-green-600 text-white border-2 border-transparent hover:bg-transparent hover:border-green-600 hover:text-green-600 shadow-lg disabled:opacity-50`,
    reset: `${btnBase} bg-red-100 text-red-700 border-2 border-transparent hover:bg-transparent hover:border-red-700 hover:text-red-700`,
    outlineDanger: `${btnBase} text-red-600 bg-white border-2 border-red-200 hover:bg-transparent hover:border-red-600 hover:text-red-600 whitespace-nowrap`,
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