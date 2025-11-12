import React, { useState, useEffect, ReactNode } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { registrationApi } from '../../../services/api/registrationApi';
import { RegistrationFormData } from '../../../schemas/registrationSchema';
import { useTranslation } from 'react-i18next';
import { Select } from '../../../components/ui/Select';
import { Radio } from '../../../components/ui/Radio';
import {secretariatApi} from "../../../services/api/secretariatApi";

type ShowForDropdown = {
    id: string | number;
    name: string;
    startDate: string;
};

interface FormFieldProps {
    label: string;
    name: string;
    children: ReactNode;
    error?: FieldError;
}

export function Step1_Exhibition() {
    const FormField: React.FC<FormFieldProps> = ({ label, name, children, error }) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );
    const { t } = useTranslation();
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    const [shows, setShows] = useState<ShowForDropdown[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('cs-CZ', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        });
    };

    useEffect(() => {
        const loadShows = async () => {
            try {
                const availableShows = await registrationApi.getAvailableShows();
                setShows(availableShows);
            } catch (error) {
                console.error(t('registrationSteps.step1_exhibition.errors.loadShows'), error);
            } finally {
                setLoading(false);
            }
        };
        loadShows();
    }, [t]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('registrationSteps.step1_exhibition.title')}</h2>

            <FormField label={t('registrationSteps.step1_exhibition.show.label')} name="showId" error={errors.showId}>
                {loading ? (
                    <div className="w-full p-3 text-gray-500 bg-gray-100 rounded-lg">{t('registrationSteps.step1_exhibition.show.loading')}</div>
                ) : (
                    <Select id="showId" {...register("showId")}>
                        <option value="">{t('registrationSteps.step1_exhibition.show.placeholder')}</option>

                        {/* Toto už je v pořádku, protože 'show' má typ 'ShowForDropdown' */}
                        {shows.map(show => (
                            <option key={show.id} value={show.id}>
                                {show.name} ({formatDate(show.startDate)})
                            </option>
                        ))}
                    </Select>
                )}
            </FormField>

            <FormField label={t('registrationSteps.step1_exhibition.attendance.label')} name="days" error={errors.days}>
                <div className="flex flex-col p-2 space-y-2 bg-gray-100 rounded-lg sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Radio
                        label={t('registrationSteps.step1_exhibition.attendance.saturday')}
                        value="sat"
                        registration={register("days")}
                    />
                    <Radio
                        label={t('registrationSteps.step1_exhibition.attendance.sunday')}
                        value="sun"
                        registration={register("days")}
                    />
                    <Radio
                        label={t('registrationSteps.step1_exhibition.attendance.both')}
                        value="both"
                        registration={register("days")}
                    />
                </div>
            </FormField>
        </div>
    );
}