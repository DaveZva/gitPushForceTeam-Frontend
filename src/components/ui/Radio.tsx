import React, { ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface RadioProps {
    label: ReactNode;
    value: string | number;
    registration: UseFormRegisterReturn;
}

export const Radio: React.FC<RadioProps> = ({
                                                label,
                                                value,
                                                registration
                                            }) => {
    const baseClass = "flex-1 px-4 py-3 text-center transition-colors duration-200 rounded-md cursor-pointer has-[:checked]:bg-blue-600 has-[:checked]:text-white";
    return (
        <label className={baseClass}>
            <input
                type="radio"
                value={value}
                className="sr-only"
                {...registration}
            />
            {label}
        </label>
    );
};