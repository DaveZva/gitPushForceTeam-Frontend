import React, { useState, useEffect, ReactNode } from 'react';
import {useFormContext, FieldError, Controller} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { storageUtils } from '../../../utils/storage';
import { RegistrationFormData } from '../../../schemas/registrationSchema';
import {CountrySelect} from "../../../components/ui/CountrySelect";

const inputClass = "w-full p-3 bg-gray-100 rounded-lg border-1 border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]";

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
    country: string;
    email: string;
    phone: string;
}

export function Step4_BreederInfo() {
    const FormField: React.FC<FormFieldProps> = ({ label, name, error, children }) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );

    const { t } = useTranslation();
    const { register, setValue, control, watch, formState: { errors } } = useFormContext<RegistrationFormData>();
    const [savedBreeders, setSavedBreeders] = useState<SavedBreeder[]>([]);
    const sameAsOwner = watch("sameAsOwner");
    const ownerData = watch([
        "ownerFirstName",
        "ownerLastName",
        "ownerAddress",
        "ownerZip",
        "ownerCity",
        "ownerCountry",
        "ownerEmail",
        "ownerPhone",
    ]);

    useEffect(() => {
        setSavedBreeders(storageUtils.getBreeders() as SavedBreeder[]);
    }, []);

    const handleLoadBreeder = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const breederId = parseInt(e.target.value);
        if (breederId) {
            const breeder = savedBreeders.find(ex => ex.id === breederId);
            if (breeder) {
                setValue("breederFirstName", breeder.firstName, { shouldValidate: true });
                setValue("breederLastName", breeder.lastName, { shouldValidate: true });
                setValue("breederAddress", breeder.address, { shouldValidate: true });
                setValue("breederZip", breeder.zip, { shouldValidate: true });
                setValue("breederCity", breeder.city, { shouldValidate: true });
                setValue("breederCountry", breeder.country, { shouldValidate: true });
                setValue("breederEmail", breeder.email, { shouldValidate: true });
                setValue("breederPhone", breeder.phone, { shouldValidate: true });
                setValue("sameAsOwner", false);
            }
        }
    };

    useEffect(() => {
        if (sameAsOwner) {
            setValue("breederFirstName", ownerData[0]);
            setValue("breederLastName", ownerData[1]);
            setValue("breederAddress", ownerData[2]);
            setValue("breederZip", ownerData[3]);
            setValue("breederCity", ownerData[4]);
            setValue("breederCountry", ownerData[5]);
            setValue("breederEmail", ownerData[6]);
            setValue("breederPhone", ownerData[7]);
        }
    }, [sameAsOwner, ownerData, setValue]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-[-2px]">{t('registrationSteps.step4_breeder.title')}</h2>

            {savedBreeders.length > 0 && !sameAsOwner && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <FormField label={t('registrationSteps.step4_breeder.loadSaved.label')} name="loadBreeder" error={undefined}>
                        <select
                            onChange={handleLoadBreeder}
                            defaultValue=""
                            className={inputClass}
                            disabled={sameAsOwner}
                        >
                            <option value="">{t('registrationSteps.step4_breeder.loadSaved.placeholder')}</option>
                            {savedBreeders.map(breeder => (
                                <option key={breeder.id} value={breeder.id}>
                                    {breeder.firstName} {breeder.lastName} ({breeder.email})
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
                        {...register("sameAsOwner")}
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">
                        {t('registrationSteps.step4_breeder.sameAsOwner')}
                    </span>
                </label>
            </div>

            <div className={`space-y-6 transition-opacity ${sameAsOwner ? 'opacity-50' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField label={t('registrationSteps.step4_breeder.firstName.label')} name="breederFirstName" error={errors.breederFirstName}>
                        <input type="text" {...register("breederFirstName")} className={inputClass} disabled={sameAsOwner} />
                    </FormField>

                    <FormField label={t('registrationSteps.step4_breeder.lastName.label')} name="breederLastName" error={errors.breederLastName}>
                        <input type="text" {...register("breederLastName")} className={inputClass} disabled={sameAsOwner} />
                    </FormField>

                    <FormField label={t('registrationSteps.step4_breeder.address.label')} name="breederAddress" error={errors.breederAddress}>
                        <input type="text" {...register("breederAddress")} className={inputClass} placeholder={t('registrationSteps.step4_breeder.address.placeholder')} disabled={sameAsOwner} />
                    </FormField>

                    <FormField label={t('registrationSteps.step4_breeder.zip.label')} name="breederZip" error={errors.breederZip}>
                        <input type="text" {...register("breederZip")} className={inputClass} placeholder={t('registrationSteps.step4_breeder.zip.placeholder')} disabled={sameAsOwner} />
                    </FormField>

                    <FormField label={t('registrationSteps.step4_breeder.city.label')} name="breederCity" error={errors.breederCity}>
                        <input type="text" {...register("breederCity")} className={inputClass} disabled={sameAsOwner} />
                    </FormField>

                    <Controller
                        name="breederCountry"
                        control={control}
                        defaultValue="CZ"
                        render={({ field: { onChange, value } }) => (
                            <CountrySelect
                                label={t('registrationSteps.step4_breeder.country.label')}
                                value={value || ''}
                                onChange={onChange}
                                error={errors.breederCountry?.message}
                            />
                        )}
                    />

                    <FormField label={t('registrationSteps.step4_breeder.email.label')} name="breederEmail" error={errors.breederEmail}>
                        <input type="email" {...register("breederEmail")} className={inputClass} placeholder={t('registrationSteps.step4_breeder.email.placeholder')} disabled={sameAsOwner} />
                    </FormField>

                    <FormField label={t('registrationSteps.step4_breeder.phone.label')} name="breederPhone" error={errors.breederPhone}>
                        <input type="tel" {...register("breederPhone")} className={inputClass} placeholder={t('registrationSteps.step4_breeder.phone.placeholder')} disabled={sameAsOwner} />
                    </FormField>
                </div>
            </div>
        </div>
    );
}