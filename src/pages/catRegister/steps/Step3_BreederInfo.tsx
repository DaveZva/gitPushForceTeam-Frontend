import React, { useState, useEffect, ReactNode } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { storageUtils } from '../../../utils/storage';
import { RegistrationFormData, CatFormData } from '../../../schemas/registrationSchema';

const inputClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

interface FormFieldProps {
    label: string;
    name: string;
    error?: FieldError;
    children: ReactNode;
}

interface SavedBreeder {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
}

export function Step3_BreederInfo() {
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

    const { register, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
    const [savedBreeders, setSavedBreeders] = useState<SavedBreeder[]>([]);

    useEffect(() => {
        setSavedBreeders(storageUtils.getBreeders() as SavedBreeder[]);
    }, []);

    const handleLoadBreeder = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const breederId = parseInt(e.target.value);
        if (breederId) {
            const breeder = savedBreeders.find(b => b.id === breederId);
            if (breeder) {
                setValue("breederFirstName", breeder.firstName, { shouldValidate: true });
                setValue("breederLastName", breeder.lastName, { shouldValidate: true });
                setValue("breederAddress", breeder.address, { shouldValidate: true });
                setValue("breederZip", breeder.zip, { shouldValidate: true });
                setValue("breederCity", breeder.city, { shouldValidate: true });
                setValue("breederEmail", breeder.email, { shouldValidate: true });
                setValue("breederPhone", breeder.phone, { shouldValidate: true });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('step3.title')}</h2>

            {savedBreeders.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <FormField label={t('step3.loadSaved')} name="loadBreeder" error={undefined}>
                        <select
                            onChange={handleLoadBreeder}
                            defaultValue=""
                            className={inputClass}
                        >
                            <option value="">{t('common.selectFromList')}</option>
                            {savedBreeders.map(breeder => (
                                <option key={breeder.id} value={breeder.id}>
                                    {breeder.firstName} {breeder.lastName} ({breeder.email})
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField label={t('form.firstNameLabel')} name="breederFirstName" error={errors.breederFirstName}>
                    <input type="text" {...register("breederFirstName")} className={inputClass} />
                </FormField>

                <FormField label={t('form.lastNameLabel')} name="breederLastName" error={errors.breederLastName}>
                    <input type="text" {...register("breederLastName")} className={inputClass} />
                </FormField>

                <FormField label={t('form.addressLabel')} name="breederAddress" error={errors.breederAddress}>
                    <input type="text" {...register("breederAddress")} className={inputClass} placeholder={t('form.addressPlaceholder')} />
                </FormField>

                <FormField label={t('form.zipLabel')} name="breederZip" error={errors.breederZip}>
                    <input type="text" {...register("breederZip")} className={inputClass} placeholder={t('form.zipPlaceholder')} />
                </FormField>

                <FormField label={t('form.cityLabel')} name="breederCity" error={errors.breederCity}>
                    <input type="text" {...register("breederCity")} className={inputClass} />
                </FormField>

                <FormField label={t('form.emailLabel')} name="breederEmail" error={errors.breederEmail}>
                    <input type="email" {...register("breederEmail")} className={inputClass} placeholder={t('form.emailPlaceholder')} />
                </FormField>

                <FormField label={t('form.phoneLabel')} name="breederPhone" error={errors.breederPhone}>
                    <input type="tel" {...register("breederPhone")} className={inputClass} placeholder={t('form.phonePlaceholder')} />
                </FormField>
            </div>
        </div>
    );
}