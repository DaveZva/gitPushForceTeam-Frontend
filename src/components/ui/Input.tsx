import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', ...props }, ref) => {

        const baseClass = "w-full p-3 bg-gray-100 rounded-lg border-[1px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]";        const finalClass = `${baseClass} ${className}`;

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