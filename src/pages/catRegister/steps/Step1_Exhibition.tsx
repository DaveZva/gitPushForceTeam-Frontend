import React, { useState, useEffect, ReactNode } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { registrationApi, AvailableShow } from '../../../services/api/registrationApi';
import { RegistrationFormData, CatFormData } from '../../../schemas/registrationSchema';
import { Select } from '../../../components/ui/Select';
import { RadioGroup } from '../../../components/ui/RadioGroup';
import { Radio } from '../../../components/ui/Radio';

interface FormFieldProps {
    label: string;
    name: string;
    children: ReactNode;
    error?: FieldError;
}

export function Step1_Exhibition() {
    const { t } = useTranslation();
    const FormField: React.FC<FormFieldProps> = ({ label, name, children, error }) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );

    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();
    const [shows, setShows] = useState<AvailableShow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadShows = async () => {
            try {
                const availableShows = await registrationApi.getAvailableShows();
                setShows(availableShows);
            } catch (error) {
                console.error(t('logs.step1ShowError'), error);
            } finally {
                setLoading(false);
            }
        };
        loadShows();
    }, [t]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('step1.title')}</h2>

            <FormField label={t('step1.showLabel')} name="showId" error={errors.showId}>
                {loading ? (
                    <div className="w-full p-3 text-gray-500 bg-gray-100 rounded-lg">{t('step1.loadingShows')}</div>
                ) : (
                    <Select id="showId" {...register("showId")}>
                        <option value="">{t('step1.selectShow')}</option>
                        {shows.map(show => (
                            <option key={show.id} value={show.id}>
                                {show.name} ({show.date})
                            </option>
                        ))}
                    </Select>
                )}
            </FormField>

            <FormField label={t('step1.daysLabel')} name="days" error={errors.days}>
                <RadioGroup>
                    <Radio
                        label={t('step1.daySat')}
                        value="sat"
                        registration={register("days")}
                    />
                    <Radio
                        label={t('step1.daySun')}
                        value="sun"
                        registration={register("days")}
                    />
                    <Radio
                        label={t('step1.dayBoth')}
                        value="both"
                        registration={register("days")}
                    />
                </RadioGroup>
            </FormField>
        </div>
    );
}