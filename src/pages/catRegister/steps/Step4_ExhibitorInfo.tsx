import React, { useState, useEffect, ReactNode } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { storageUtils } from '../../../utils/storage';
import { RegistrationFormData } from '../../../schemas/registrationSchema';

const inputClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-200";

interface FormFieldProps {
    label: string;
    name: string;
    error?: FieldError;
    children: ReactNode;
}

interface SavedExhibitor {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
}

export function Step4_ExhibitorInfo() {
    const { t } = useTranslation();
    const FormField: React.FC<FormFieldProps> = ({ label, name, error, children }) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );

    const { register, setValue, watch, formState: { errors } } = useFormContext<RegistrationFormData>();
    const [savedExhibitors, setSavedExhibitors] = useState<SavedExhibitor[]>([]);

    const sameAsBreeder = watch("sameAsBreeder");
    const breederData = watch([
        "breederFirstName",
        "breederLastName",
        "breederAddress",
        "breederZip",
        "breederCity",
        "breederEmail",
        "breederPhone"
    ]);

    useEffect(() => {
        setSavedExhibitors(storageUtils.getExhibitors() as SavedExhibitor[]);
    }, []);

    const handleLoadExhibitor = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const exhibitorId = parseInt(e.target.value);
        if (exhibitorId) {
            const exhibitor = savedExhibitors.find(ex => ex.id === exhibitorId);
            if (exhibitor) {
                setValue("exhibitorFirstName", exhibitor.firstName, { shouldValidate: true });
                setValue("exhibitorLastName", exhibitor.lastName, { shouldValidate: true });
                setValue("exhibitorAddress", exhibitor.address, { shouldValidate: true });
                setValue("exhibitorZip", exhibitor.zip, { shouldValidate: true });
                setValue("exhibitorCity", exhibitor.city, { shouldValidate: true });
                setValue("exhibitorEmail", exhibitor.email, { shouldValidate: true });
                setValue("exhibitorPhone", exhibitor.phone, { shouldValidate: true });
                setValue("sameAsBreeder", false);
            }
        }
    };

    useEffect(() => {
        if (sameAsBreeder) {
            setValue("exhibitorFirstName", breederData[0]);
            setValue("exhibitorLastName", breederData[1]);
            setValue("exhibitorAddress", breederData[2]);
            setValue("exhibitorZip", breederData[3]);
            setValue("exhibitorCity", breederData[4]);
            setValue("exhibitorEmail", breederData[5]);
            setValue("exhibitorPhone", breederData[6]);
        }
    }, [sameAsBreeder, breederData, setValue]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('step4.title')}</h2>

            {savedExhibitors.length > 0 && !sameAsBreeder && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <FormField label={t('step4.loadSaved')} name="loadExhibitor" error={undefined}>
                        <select
                            onChange={handleLoadExhibitor}
                            defaultValue=""
                            className={inputClass}
                            disabled={sameAsBreeder}
                        >
                            <option value="">{t('step4.selectPlaceholder')}</option>
                            {savedExhibitors.map(ex => (
                                <option key={ex.id} value={ex.id}>
                                    {ex.firstName} {ex.lastName} ({ex.email})
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        {...register("sameAsBreeder")}
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">
                        {t('step4.sameAsBreeder')}
                    </span>
                </label>
            </div>

            <div className={`space-y-6 transition-opacity ${sameAsBreeder ? 'opacity-50' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField label={t('step4.firstName')} name="exhibitorFirstName" error={errors.exhibitorFirstName}>
                        <input type="text" {...register("exhibitorFirstName")} className={inputClass} disabled={sameAsBreeder} />
                    </FormField>

                    <FormField label={t('step4.lastName')} name="exhibitorLastName" error={errors.exhibitorLastName}>
                        <input type="text" {...register("exhibitorLastName")} className={inputClass} disabled={sameAsBreeder} />
                    </FormField>

                    <FormField label={t('step4.address')} name="exhibitorAddress" error={errors.exhibitorAddress}>
                        <input type="text" {...register("exhibitorAddress")} className={inputClass} placeholder={t('step4.addressPlaceholder')} disabled={sameAsBreeder} />
                    </FormField>

                    <FormField label={t('step4.zip')} name="exhibitorZip" error={errors.exhibitorZip}>
                        <input type="text" {...register("exhibitorZip")} className={inputClass} placeholder={t('step4.zipPlaceholder')} disabled={sameAsBreeder} />
                    </FormField>

                    <FormField label={t('step4.city')} name="exhibitorCity" error={errors.exhibitorCity}>
                        <input type="text" {...register("exhibitorCity")} className={inputClass} disabled={sameAsBreeder} />
                    </FormField>

                    <FormField label={t('step4.email')} name="exhibitorEmail" error={errors.exhibitorEmail}>
                        <input type="email" {...register("exhibitorEmail")} className={inputClass} placeholder={t('step4.emailPlaceholder')} disabled={sameAsBreeder} />
                    </FormField>

                    <FormField label={t('step4.phone')} name="exhibitorPhone" error={errors.exhibitorPhone}>
                        <input type="tel" {...register("exhibitorPhone")} className={inputClass} placeholder={t('step4.phonePlaceholder')} disabled={sameAsBreeder} />
                    </FormField>
                </div>
            </div>
        </div>
    );
}