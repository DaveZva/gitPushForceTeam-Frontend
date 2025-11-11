import React, { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    children: ReactNode; // 'children' musíme definovat explicitně
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', children, ...props }, ref) => { // <-- Přijímáme 'ref'

        const baseClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";
        const finalClass = `${baseClass} ${className}`;

        return (
            <select
                className={finalClass}
                {...props}
                ref={ref}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = "Select";