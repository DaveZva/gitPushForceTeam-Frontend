import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CatForm } from './CatForm';
import { RegistrationFormData, CatFormData } from '../../../schemas/registrationSchema';
import { defaultCatValues } from '../CatRegistrationForm';

export function Step2_CatInfo() {
    const { t } = useTranslation();
    const { control, formState: { errors } } = useFormContext<RegistrationFormData>();

    const { fields, append, remove } = useFieldArray<RegistrationFormData, "cats">({
        control,
        name: "cats"
    });

    const handleAddCat = () => {
        append(defaultCatValues);
    };

    const handleRemoveCat = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    return (
        <div className="space-y-8">
            {fields.map((field, index) => (
                <CatForm
                    key={field.id}
                    catIndex={index}
                    onRemove={fields.length > 1 ? () => handleRemoveCat(index) : null}
                />
            ))}

            {errors.cats?.root && (
                <p className="text-sm text-red-600">{errors.cats.root.message}</p>
            )}
            {errors.cats && typeof errors.cats.message === 'string' && (
                <p className="text-sm text-red-600">{errors.cats.message}</p>
            )}

            <button
                type="button"
                onClick={handleAddCat}
                className="w-full px-6 py-4 font-semibold text-blue-600 transition-colors bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg hover:bg-blue-100 hover:border-blue-300"
            >
                + {t('catForm.addAnotherCat')}
            </button>
        </div>
    );
}