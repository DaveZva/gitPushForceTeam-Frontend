import React, { useMemo, useState } from 'react';
import { useForm, FormProvider, SubmitHandler, useFormContext, type Resolver } from 'react-hook-form';
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
        resolver: zodResolver(showSchema) as Resolver<ShowFormData>,
        defaultValues: {
            status: 'PLANNED',
            maxCats: 200
        },
    });

    const { register, handleSubmit, formState: { errors } } = methods;

    const onSubmit: SubmitHandler<ShowFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const formatForBackend = (val: string | undefined | null): string | undefined => {
                if (!val) return undefined;
                return val.length === 16 ? `${val}:00` : val;
            };

            const payload = {
                ...data,
                startDate: formatForBackend(data.startDate)!,
                endDate: formatForBackend(data.endDate)!,
                registrationDeadline: formatForBackend(data.registrationDeadline)!,
                vetCheckStart: formatForBackend(data.vetCheckStart),
                judgingStart: formatForBackend(data.judgingStart),
                judgingEnd: formatForBackend(data.judgingEnd),
            };
            await secretariatApi.createShow(data);

            // Použití lokalizovaného textu
            alert(t('alert.createSuccess'));
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-[-2px]">
                    {t('admin.create.title')}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-xl">

                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-[#027BFF] border-b pb-2 mb-4">
                            {t('admin.create.section.basic')}
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="name" label={t('fields.name')} error={errors.name?.message} />

                            <FormField name="maxCats" label={t('fields.maxCats')} type="number" error={errors.maxCats?.message} />

                            <div className="flex flex-col">
                                <label htmlFor="status" className="mb-1 font-semibold text-gray-700">{t('fields.status')}</label>
                                <Select id="status" {...register('status')}>
                                    <option value="PLANNED">{t('statuses.PLANNED')}</option>
                                    <option value="OPEN">{t('statuses.OPEN')}</option>
                                    <option value="CLOSED">{t('statuses.CLOSED')}</option>
                                    <option value="COMPLETED">{t('statuses.COMPLETED')}</option>
                                    <option value="CANCELLED">{t('statuses.CANCELLED')}</option>
                                </Select>
                                {errors.status && <span className="text-sm text-red-600 mt-1">{errors.status.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="description" className="mb-1 font-semibold text-gray-700">{t('fields.description')}</label>
                            <textarea
                                {...register('description')}
                                className="w-full p-3 bg-gray-100 rounded-lg border-[1px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]"
                                rows={3}
                            />

                            {errors.description && (<span className="text-sm text-red-600 mt-1">{errors.description.message}</span>
                            )}
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-[#027BFF] border-b pb-2 mb-4">
                            Harmonogram
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField name="vetCheckStart" label={t('fields.vetCheckStart')} type="datetime-local" error={errors.vetCheckStart?.message} />
                            <FormField name="judgingStart" label={t('fields.judgingStart')} type="datetime-local" error={errors.judgingStart?.message} />
                            <FormField name="judgingEnd" label={t('fields.judgingEnd')} type="datetime-local" error={errors.judgingEnd?.message} />
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-[#027BFF] border-b pb-2 mb-4">
                            {t('admin.create.section.venue')}
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="venueName" label={t('fields.venueName')} error={errors.venueName?.message} />
                            <FormField name="venueAddress" label={t('fields.venueAddress')} error={errors.venueAddress?.message} />
                            <FormField name="venueCity" label={t('fields.venueCity')} error={errors.venueCity?.message} />
                            <FormField name="venueZip" label={t('fields.venueZip')} error={errors.venueZip?.message} />
                            <FormField name="venueState" label={t('fields.venueState')} error={errors.venueState?.message} />
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-[#027BFF] border-b pb-2 mb-4">
                            {t('admin.create.section.dates')}
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField name="startDate" label={t('fields.startDate')} type="datetime-local" error={errors.startDate?.message} />
                            <FormField name="endDate" label={t('fields.endDate')} type="datetime-local" error={errors.endDate?.message} />
                            <FormField name="registrationDeadline" label={t('fields.registrationDeadline')} type="datetime-local" error={errors.registrationDeadline?.message} />
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-xl font-semibold text-[#027BFF] border-b pb-2 mb-4">
                            {t('admin.create.section.organizer')}
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name="organizerName" label={t('fields.organizerName')} error={errors.organizerName?.message} />
                            <FormField name="contactEmail" label={t('fields.contactEmail')} type="email" error={errors.contactEmail?.message} />
                            <FormField name="websiteUrl" label={t('fields.websiteUrl')} type="url" error={errors.websiteUrl?.message} />
                        </div>
                    </fieldset>

                    <div className="pt-6 border-t">
                        <Button type="submit" variant="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('admin.create.submitting') : t('admin.create.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    );
}