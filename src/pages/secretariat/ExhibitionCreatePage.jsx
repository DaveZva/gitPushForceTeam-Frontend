import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { exhibitionSchema } from '../../schemas/exhibitionSchema';
import { secretariatApi } from '../../services/api/secretariatApi';

// Pomocné komponenty pro formulář (aby se neporušil Fast Refresh)
const FormField = ({ label, name, children, error }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-sm font-semibold text-gray-700">
            {label}
        </label>
        {children}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
);

const SectionHeader = ({ title }) => (
    <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 mt-4">
        {title}
    </h3>
);

// Běžný vzhled inputu
const inputClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

export default function ExhibitionCreatePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);

    const methods = useForm({
        resolver: zodResolver(exhibitionSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "PLANNED", // Výchozí status
            venueName: "",
            venueAddress: "",
            venueCity: "",
            venueState: "",
            venueZip: "",
            startDate: "",
            endDate: "",
            registrationDeadline: "",
            organizerName: "",
            contactEmail: "",
            websiteUrl: "",
        },
    });

    const { register, handleSubmit, formState: { errors } } = methods;

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            await secretariatApi.createExhibition(data);
            alert(t('alert.createSuccess'));
            navigate('/secretariat/exhibition'); // Přejdeme zpět na seznam
        } catch (error) {
            setApiError(error.message || t('alert.createError'));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto p-4 sm:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t('admin.create.title')}
                </h1>
                <Link
                    to="/admin/shows"
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                    {t('admin.create.back')}
                </Link>
            </header>

            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* --- Základní info --- */}
                        <SectionHeader title={t('admin.create.section.basic')} />
                        <div className="md:col-span-2">
                            <FormField label={t('fields.name')} name="name" error={errors.name}>
                                <input type="text" {...register("name")} className={inputClass} />
                            </FormField>
                        </div>

                        <div className="md:col-span-2">
                            <FormField label={t('fields.description')} name="description" error={errors.description}>
                                <textarea {...register("description")} rows="4" className={inputClass} />
                            </FormField>
                        </div>

                        <FormField label={t('fields.status')} name="status" error={errors.status}>
                            <select {...register("status")} className={inputClass}>
                                <option value="PLANNED">{t('statuses.PLANNED')}</option>
                                <option value="OPEN">{t('statuses.OPEN')}</option>
                                <option value="CLOSED">{t('statuses.CLOSED')}</option>
                                <option value="COMPLETED">{t('statuses.COMPLETED')}</option>
                                <option value="CANCELLED">{t('statuses.CANCELLED')}</option>
                            </select>
                        </FormField>

                        {/* --- Místo konání --- */}
                        <SectionHeader title={t('admin.create.section.venue')} />
                        <FormField label={t('fields.venueName')} name="venueName" error={errors.venueName}>
                            <input type="text" {...register("venueName")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.venueAddress')} name="venueAddress" error={errors.venueAddress}>
                            <input type="text" {...register("venueAddress")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.venueCity')} name="venueCity" error={errors.venueCity}>
                            <input type="text" {...register("venueCity")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.venueState')} name="venueState" error={errors.venueState}>
                            <input type="text" {...register("venueState")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.venueZip')} name="venueZip" error={errors.venueZip}>
                            <input type="text" {...register("venueZip")} className={inputClass} />
                        </FormField>

                        {/* --- Data --- */}
                        <SectionHeader title={t('admin.create.section.dates')} />
                        <FormField label={t('fields.startDate')} name="startDate" error={errors.startDate}>
                            <input type="datetime-local" {...register("startDate")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.endDate')} name="endDate" error={errors.endDate}>
                            <input type="datetime-local" {...register("endDate")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.registrationDeadline')} name="registrationDeadline" error={errors.registrationDeadline}>
                            <input type="datetime-local" {...register("registrationDeadline")} className={inputClass} />
                        </FormField>

                        {/* --- Organizátor --- */}
                        <SectionHeader title={t('admin.create.section.organizer')} />
                        <FormField label={t('fields.organizerName')} name="organizerName" error={errors.organizerName}>
                            <input type="text" {...register("organizerName")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.contactEmail')} name="contactEmail" error={errors.contactEmail}>
                            <input type="email" {...register("contactEmail")} className={inputClass} />
                        </FormField>
                        <FormField label={t('fields.websiteUrl')} name="websiteUrl" error={errors.websiteUrl}>
                            <input type="url" {...register("websiteUrl")} className={inputClass} placeholder="https://..." />
                        </FormField>
                    </div>

                    {/* --- Odeslání --- */}
                    <div className="flex justify-end mt-8">
                        {apiError && (
                            <p className="text-sm text-red-600 mr-4 self-center">{apiError}</p>
                        )}
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('admin.create.submitting') : t('admin.create.submit')}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
