import React, { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    children: ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', children, ...props }, ref) => {

        const baseClass =
            "w-full p-3 bg-gray-100 rounded-lg border-[1px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]";

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