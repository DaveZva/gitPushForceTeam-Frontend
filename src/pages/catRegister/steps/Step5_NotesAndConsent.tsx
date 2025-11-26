import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RegistrationFormData } from '../../../schemas/registrationSchema';
import { Checkbox } from '../../../components/ui/Checkbox';

export function Step5_NotesAndConsent() {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('registrationSteps.step5_consent.title')}</h2>

            <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                    {t('registrationSteps.step5_consent.notes.label')}
                </label>

                <textarea
                    id="notes"
                    rows={5}
                    placeholder={t('registrationSteps.step5_consent.notes.placeholder')}
                    className={`w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.notes ? 'ring-2 ring-red-500' : ''} `}
                    {...register("notes")}
                />

                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
            </div>

            <div className="space-y-4">
                <Checkbox
                    id="dataAccuracy"
                    label={t('registrationSteps.step5_consent.dataAccuracy.label')}
                    description={t('registrationSteps.step5_consent.dataAccuracy.description')}
                    registration={register("dataAccuracy")}
                    error={errors.dataAccuracy}
                    variant="simple"
                />

                <Checkbox
                    id="gdprConsent"
                    label={t('registrationSteps.step5_consent.gdprConsent.label')}
                    description={t('registrationSteps.step5_consent.gdprConsent.description')}
                    registration={register("gdprConsent")}
                    error={errors.gdprConsent}
                    variant="simple"
                />
            </div>

            <div className="p-4 text-yellow-800 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <strong className="font-bold">{t('registrationSteps.step5_consent.alert.title')}</strong>
                {t('registrationSteps.step5_consent.alert.text')}
            </div>
        </div>
    );
}