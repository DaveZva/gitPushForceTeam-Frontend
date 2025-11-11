import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RegistrationFormData } from '../../../schemas/registrationSchema';
import { TextArea } from '../../../components/ui/TextArea';
import { Checkbox } from '../../../components/ui/Checkbox';

export function Step5_NotesAndConsent() {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('step5.title')}</h2>

            <TextArea
                id="notes"
                label={t('step5.notesLabel')}
                placeholder={t('step5.notesPlaceholder')}
                registration={register("notes")}
                error={errors.notes}
            />

            <div className="space-y-4">
                <Checkbox
                    id="dataAccuracy"
                    label={t('step5.dataAccuracyLabel')}
                    description={t('step5.dataAccuracyDescription')}
                    registration={register("dataAccuracy")}
                    error={errors.dataAccuracy}
                />

                <Checkbox
                    id="gdprConsent"
                    label={t('step5.gdprConsentLabel')}
                    description={t('step5.gdprConsentDescription')}
                    registration={register("gdprConsent")}
                    error={errors.gdprConsent}
                />
            </div>

            <div className="p-4 text-yellow-800 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <strong className="font-bold">{t('step5.warningTitle')}</strong> {t('step5.warningText')}
            </div>
        </div>
    );
}