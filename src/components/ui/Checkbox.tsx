import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface CheckboxProps {
    id: string;
    label: React.ReactNode;
    description?: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
}

export const Checkbox: React.FC<CheckboxProps> = ({
                                                      id,
                                                      label,
                                                      description,
                                                      registration,
                                                      error
                                                  }) => {

    const consentBoxClass = "flex items-start gap-3 p-4 border border-gray-200 rounded-lg has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50 text-left"; // Změna na text-left
    const checkboxClass = "w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500 shrink-0 mt-1";
    const errorBoxClass = error ? 'border-red-500 bg-red-50' : '';

    return (
        <div className={`${consentBoxClass} ${errorBoxClass}`}>
            <input
                type="checkbox"
                id={id}
                className={checkboxClass}
                {...registration}
            />
            <label htmlFor={id} className="cursor-pointer">
                {label && (
                    <strong className="text-gray-800">{label}</strong>
                )}
                {description && (
                    <span className="block text-sm text-gray-600">{description}</span>
                )}
                {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </label>
        </div>
    );
};