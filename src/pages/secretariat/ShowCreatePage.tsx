import React, { useMemo, useState } from 'react';
import {useForm, FormProvider, SubmitHandler, useFormContext, type Resolver} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createShowSchema, ShowFormData } from '../../schemas/showSchema';
import { secretariatApi } from '../../services/api/secretariatApi';
import { Button, Input, Select } from '../../components/ui';

const FormField: React.FC<{ name: string, label: string, type?: string, error?: string }> = ({ name, label, type = 'text', error }) => {
    const { register } = useFormContext();
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 font-semibold text-gray-700">{label}</label>
            <Input id={name} type={type} {...register(name)} className={error ? 'border-red-500' : ''} />
            {error && <span className="text-sm text-red-600 mt-1">{error}</span>}
        </div>
    );
};

export function ShowCreatePage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showSchema = useMemo(() => createShowSchema(t), [i18n.language, t]);

    const methods = useForm<ShowFormData>({
        resolver: zodResolver(showSchema) as Resolver<ShowFormData>, // <-- TOTO PŘIDEJ
        defaultValues: {
            status: 'PLANNED',
        },
    });

    const { register, handleSubmit, formState: { errors } } = methods;

    const onSubmit: SubmitHandler<ShowFormData> = async (data) => {
        setIsSubmitting(true);
        console.log("Data k odeslání:", data);
        try {
            await secretariatApi.createShow(data);

            alert(t('alert.createSuccess', 'Výstava byla úspěšně vytvořena.')); // Přidán výchozí text
            navigate('/');

        } catch (error: unknown) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="max-w-4xl mx-auto p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {t('exhibitionCreate.title', 'Vytvořit novou výstavu')}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-xl">

                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Základní informace</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="name" label={t('exhibitionCreate.name', 'Název výstavy')} error={errors.name?.message} />

                            <div className="flex flex-col">
                                <label htmlFor="status" className="mb-1 font-semibold text-gray-700">{t('exhibitionCreate.status', 'Status')}</label>
                                <Select id="status" {...register('status')}>
                                    <option value="PLANNED">{t('exhibitionStatus.PLANNED', 'Plánovaná')}</option>
                                    <option value="OPEN">{t('exhibitionStatus.OPEN', 'Otevřená')}</option>
                                    <option value="CLOSED">{t('exhibitionStatus.CLOSED', 'Uzavřená')}</option>
                                    <option value="COMPLETED">{t('exhibitionStatus.COMPLETED', 'Dokončená')}</option>
                                    <option value="CANCELLED">{t('exhibitionStatus.CANCELLED', 'Zrušená')}</option>
                                </Select>
                                {errors.status && <span className="text-sm text-red-600 mt-1">{errors.status.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="description" className="mb-1 font-semibold text-gray-700">{t('exhibitionCreate.description', 'Popis')}</label>
                            <textarea
                                id="description"
                                {...register('description')}
                                rows={4}
                                className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.description && <span className="text-sm text-red-600 mt-1">{errors.description.message}</span>}
                        </div>
                    </fieldset>

                    {/* Sekce 2: Místo konání */}
                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Místo konání</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="venueName" label={t('exhibitionCreate.venueName', 'Název místa')} error={errors.venueName?.message} />
                            <FormField name="venueAddress" label={t('exhibitionCreate.venueAddress', 'Adresa')} error={errors.venueAddress?.message} />
                            <FormField name="venueCity" label={t('exhibitionCreate.venueCity', 'Město')} error={errors.venueCity?.message} />
                            <FormField name="venueZip" label={t('exhibitionCreate.venueZip', 'PSČ')} error={errors.venueZip?.message} />
                            <FormField name="venueState" label={t('exhibitionCreate.venueState', 'Stát/Region')} error={errors.venueState?.message} />
                        </div>
                    </fieldset>

                    {/* Sekce 3: Termíny */}
                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Termíny</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField name="startDate" label={t('exhibitionCreate.startDate', 'Datum začátku')} type="datetime-local" error={errors.startDate?.message} />
                            <FormField name="endDate" label={t('exhibitionCreate.endDate', 'Datum konce')} type="datetime-local" error={errors.endDate?.message} />
                            <FormField name="registrationDeadline" label={t('exhibitionCreate.registrationDeadline', 'Uzávěrka registrací')} type="datetime-local" error={errors.registrationDeadline?.message} />
                        </div>
                    </fieldset>

                    {/* Sekce 4: Organizátor */}
                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">Organizátor</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="organizerName" label={t('exhibitionCreate.organizerName', 'Jméno organizátora')} error={errors.organizerName?.message} />
                            <FormField name="contactEmail" label={t('exhibitionCreate.contactEmail', 'Kontaktní email')} type="email" error={errors.contactEmail?.message} />
                            <FormField name="websiteUrl" label={t('exhibitionCreate.websiteUrl', 'Webová stránka')} type="url" error={errors.websiteUrl?.message} />
                        </div>
                    </fieldset>

                    <div className="pt-6 border-t">
                        <Button type="submit" variant="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('form.submitting', 'Vytvářím...') : t('exhibitionCreate.submitButton', 'Vytvořit výstavu')}
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}