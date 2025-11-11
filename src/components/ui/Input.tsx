import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', ...props }, ref) => { // <-- Přijímáme 'ref'

        const baseClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

        const finalClass = `${baseClass} ${className}`;

        return (
            <input
                className={finalClass}
                {...props}
                ref={ref}
            />
        );
    }
);

Input.displayName = "Input";