import React, { useState, useEffect, ReactNode } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { storageUtils } from '../../../utils/storage';
import { RegistrationFormData } from '../../../schemas/registrationSchema';

const inputClass = "w-full p-3 bg-gray-100 rounded-lg border-1 border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]";

interface FormFieldProps {
    label: string;
    name: string;
    error?: FieldError;
    children: ReactNode;
}

interface SavedOwner {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
}

export function Step3_OwnerInfo() {
    const FormField: React.FC<FormFieldProps> = ({ label, name, error, children }) => (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700 text-left">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    );

    const { t } = useTranslation();
    const { register, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
    const [savedOwners, setSavedOwners] = useState<SavedOwner[]>([]);

    useEffect(() => {
        setSavedOwners(storageUtils.getBreeders() as SavedOwner[]);
    }, []);

    const handleLoadOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ownerId = parseInt(e.target.value);
        if (ownerId) {
            const owner = savedOwners.find(b => b.id === ownerId);
            if (owner) {
                setValue("ownerFirstName", owner.firstName, { shouldValidate: true });
                setValue("ownerLastName", owner.lastName, { shouldValidate: true });
                setValue("ownerAddress", owner.address, { shouldValidate: true });
                setValue("ownerZip", owner.zip, { shouldValidate: true });
                setValue("ownerCity", owner.city, { shouldValidate: true });
                setValue("ownerEmail", owner.email, { shouldValidate: true });
                setValue("ownerPhone", owner.phone, { shouldValidate: true });
                setValue("ownerLocalOrganization", "", { shouldValidate: true });
                setValue("ownerMembershipNumber", "", { shouldValidate: true });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-[-2px]">{t('registrationSteps.step3_owner.title')}</h2>

            {savedOwners.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <FormField label={t('registrationSteps.step3_owner.loadSaved.label')} name="loadOwner" error={undefined}>
                        <select
                            onChange={handleLoadOwner}
                            defaultValue=""
                            className={inputClass}
                        >
                            <option value="">{t('registrationSteps.step3_owner.loadSaved.placeholder')}</option>
                            {savedOwners.map(owner => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.firstName} {owner.lastName} ({owner.email})
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField label={t('registrationSteps.step3_owner.localClub.label')} name="ownerLocalClub" error={errors.ownerLocalOrganization}>
                    <input type="text" {...register("ownerLocalOrganization")} className={inputClass} placeholder={t('registrationSteps.step3_owner.localClub.placeholder')} />
                    </FormField>

                <FormField label={t('registrationSteps.step3_owner.memberNumber.label')} name="ownerMemberNumber" error={errors.ownerMembershipNumber}>
                    <input type="text" {...register("ownerMembershipNumber")} className={inputClass} placeholder={t('registrationSteps.step3_owner.memberNumber.placeholder')} />
                    </FormField>

                <div className="col-span-1 md:col-span-2 border-t border-gray-200 my-2"></div>

                <FormField label={t('registrationSteps.step3_owner.firstName.label')} name="ownerFirstName" error={errors.ownerFirstName}>
                    <input type="text" {...register("ownerFirstName")} className={inputClass} />
                </FormField>

                <FormField label={t('registrationSteps.step3_owner.lastName.label')} name="ownerLastName" error={errors.ownerLastName}>
                    <input type="text" {...register("ownerLastName")} className={inputClass} />
                </FormField>

                <FormField label={t('registrationSteps.step3_owner.address.label')} name="ownerAddress" error={errors.ownerAddress}>
                    <input type="text" {...register("ownerAddress")} className={inputClass} placeholder={t('registrationSteps.step3_owner.address.placeholder')} />
                </FormField>

                <FormField label={t('registrationSteps.step3_owner.zip.label')} name="ownerZip" error={errors.ownerZip}>
                    <input type="text" {...register("ownerZip")} className={inputClass} placeholder={t('registrationSteps.step3_owner.zip.placeholder')} />
                </FormField>

                <FormField label={t('registrationSteps.step3_owner.city.label')} name="ownerCity" error={errors.ownerCity}>
                    <input type="text" {...register("ownerCity")} className={inputClass} />
                </FormField>

                <FormField label={t('registrationSteps.step3_owner.email.label')} name="ownerEmail" error={errors.ownerEmail}>
                    <input type="email" {...register("ownerEmail")} className={inputClass} placeholder={t('registrationSteps.step3_owner.email.placeholder')} />
                </FormField>

                <FormField label={t('registrationSteps.step3_owner.phone.label')} name="ownerPhone" error={errors.ownerPhone}>
                    <input type="tel" {...register("ownerPhone")} className={inputClass} placeholder={t('registrationSteps.step3_owner.phone.placeholder')} />
                </FormField>

            </div>
        </div>
    );
}