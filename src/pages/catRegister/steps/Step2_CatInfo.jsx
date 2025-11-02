import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CatForm } from './CatForm'; // Importujeme novou komponentu
import { defaultCatValues } from '../CatRegistrationForm'; // Importujeme výchozí hodnoty

export function Step2_CatInfo() {
    const { t } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    // --- MAGIE SE DĚJE ZDE ---
    const { fields, append, remove } = useFieldArray({
        control,
        name: "cats"
    });

    const handleAddCat = () => {
        append(defaultCatValues);
    };

    const handleRemoveCat = (index) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    return (
        <div className="space-y-8">
            {/* Vykreslíme formulář pro každou kočku v poli */}
            {fields.map((field, index) => (
                <CatForm
                    key={field.id}
                    catIndex={index}
                    // Funkci pro smazání předáme jen pokud je koček víc než 1
                    onRemove={fields.length > 1 ? () => handleRemoveCat(index) : null}
                />
            ))}

            {/* Zobrazíme chybu, pokud by pole bylo prázdné (ze schématu) */}
            {errors.cats?.root && (
                <p className="text-sm text-red-600">{errors.cats.root.message}</p>
            )}

            {/* Tlačítko pro přidání další kočky */}
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