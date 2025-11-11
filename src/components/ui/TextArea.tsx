// Soubor: src/components/ui/TextArea.tsx
import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface TextAreaProps {
    id: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    className?: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
}

export const TextArea: React.FC<TextAreaProps> = ({
                                                      id,
                                                      label,
                                                      placeholder,
                                                      rows = 5,
                                                      className = '',
                                                      registration,
                                                      error
                                                  }) => {

    const baseClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";
    const errorClass = error ? 'ring-2 ring-red-500' : '';

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label htmlFor={id} className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                rows={rows}
                placeholder={placeholder}
                className={`${baseClass} ${errorClass} ${className}`}
                {...registration}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};