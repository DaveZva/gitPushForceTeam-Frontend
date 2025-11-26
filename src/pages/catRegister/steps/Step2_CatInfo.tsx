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

            <button type="button" onClick={handleAddCat} className="w-full px-6 py-4 font-semibold text-[#027BFF] transition-colors bg-[#E5F1FF] border-2 border-[#027BFF] border-dashed rounded-lg hover:bg-white hover:border-[#027BFF] hover:text-[#027BFF]">+
                {t('catForm.addAnotherCat')}
            </button>
        </div>
    );
}