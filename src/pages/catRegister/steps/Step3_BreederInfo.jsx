import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { storageUtils } from '../../../utils/storage';

// Běžný vzhled inputu
const inputClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

const FormField = ({ label, name, error, children }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-sm font-semibold text-gray-700">
            {label}
        </label>
        {children}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
);

export function Step3_BreederInfo() {
    const { register, setValue, formState: { errors } } = useFormContext();
    const [savedBreeders, setSavedBreeders] = useState([]);

    useEffect(() => {
        setSavedBreeders(storageUtils.getBreeders());
    }, []);

    const handleLoadBreeder = (e) => {
        const breederId = parseInt(e.target.value);
        if (breederId) {
            const breeder = savedBreeders.find(b => b.id === breederId);
            if (breeder) {
                // Použijeme setValue z React Hook Form
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
            <h2 className="text-2xl font-bold text-gray-800">Údaje o chovateli</h2>

            {savedBreeders.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <FormField label="Načíst uloženého chovatele" name="loadBreeder">
                        <select
                            onChange={handleLoadBreeder}
                            defaultValue=""
                            className={inputClass}
                        >
                            <option value="">-- Vyberte ze seznamu --</option>
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
                <FormField label="Jméno *" name="breederFirstName" error={errors.breederFirstName}>
                    <input type="text" {...register("breederFirstName")} className={inputClass} />
                </FormField>

                <FormField label="Příjmení *" name="breederLastName" error={errors.breederLastName}>
                    <input type="text" {...register("breederLastName")} className={inputClass} />
                </FormField>

                <FormField label="Ulice a číslo popisné *" name="breederAddress" error={errors.breederAddress}>
                    <input type="text" {...register("breederAddress")} className={inputClass} placeholder="Např. Hlavní 123" />
                </FormField>

                <FormField label="PSČ *" name="breederZip" error={errors.breederZip}>
                    <input type="text" {...register("breederZip")} className={inputClass} placeholder="123 45" />
                </FormField>

                <FormField label="Město *" name="breederCity" error={errors.breederCity}>
                    <input type="text" {...register("breederCity")} className={inputClass} />
                </FormField>

                <FormField label="Email *" name="breederEmail" error={errors.breederEmail}>
                    <input type="email" {...register("breederEmail")} className={inputClass} placeholder="email@example.com" />
                </FormField>

                <FormField label="Telefon *" name="breederPhone" error={errors.breederPhone}>
                    <input type="tel" {...register("breederPhone")} className={inputClass} placeholder="+420 123 456 789" />
                </FormField>
            </div>
        </div>
    );
}