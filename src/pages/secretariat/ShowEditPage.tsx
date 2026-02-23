import React, { useEffect, useState } from 'react';
import { useForm, Resolver, Controller } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { createShowSchema, ShowFormData } from '../../schemas/showSchema';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelect } from '../../components/ui/CountrySelect';
import { secretariatApi } from '../../services/api/secretariatApi';
import { MainHeader } from '../../components/MainHeader';

export default function ShowEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<ShowFormData>({
        resolver: zodResolver(createShowSchema(t)) as Resolver<ShowFormData>
    });

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const data: any = await secretariatApi.getShowById(id);

                const formatDateTime = (isoString?: string | null) => {
                    if (!isoString) return '';
                    return String(isoString).slice(0, 16);
                };

                const formattedData = {
                    ...data,
                    contactEmail: data.organizerContactEmail || data.contactEmail,
                    websiteUrl: data.organizerWebsiteUrl || data.websiteUrl,

                    startDate: formatDateTime(data.startDate),
                    endDate: formatDateTime(data.endDate),
                    registrationDeadline: formatDateTime(data.registrationDeadline),
                    vetCheckStart: formatDateTime(data.vetCheckStart),
                    judgingStart: formatDateTime(data.judgingStart),
                    judgingEnd: formatDateTime(data.judgingEnd),

                    status: data.status || 'PLANNED',
                    venueState: data.venueState || 'CZ'
                };

                reset(formattedData);
            } catch (err) {
                console.error(err);
                setLoadError(t('error.loadFailed', 'Nepodařilo se načíst data výstavy.'));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, reset, t]);

    const onSubmit = async (data: ShowFormData) => {
        if (!id) return;
        try {
            const formatForBackend = (val: string | undefined): string => {
                if (!val) return "";
                return val.length === 16 ? `${val}:00` : val;
            };

            const payload: ShowFormData = {
                ...data,
                startDate: formatForBackend(data.startDate),
                endDate: formatForBackend(data.endDate),
                registrationDeadline: formatForBackend(data.registrationDeadline),
                vetCheckStart: formatForBackend(data.vetCheckStart),
                judgingStart: formatForBackend(data.judgingStart),
                judgingEnd: formatForBackend(data.judgingEnd),
            };

            await secretariatApi.updateShow(id, payload);
            navigate(`/secretariat/shows/${id}`);
        } catch (err) {
            console.error(err);
            alert(t('error.saveFailed', 'Chyba při ukládání změn.'));
        }
    };

    const FormField = ({ label, error, children }: { label: string, error?: string, children: React.ReactNode }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );

    if (isLoading) return <LoadingSpinner className="py-24" />;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <MainHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <nav className="text-sm text-gray-500 mb-2">
                        <Link to="/secretariat" className="hover:text-blue-600">Sekretariát</Link>
                        <span className="mx-2">/</span>
                        <Link to={`/secretariat/shows/${id}`} className="hover:text-blue-600">Detail</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">Editace</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-900">Upravit výstavu</h1>
                </div>

                <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    {loadError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                            {loadError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Název výstavy" error={errors.name?.message}>
                                <Input {...register('name')} placeholder="Např. Mezinárodní výstava koček Praha" />
                            </FormField>

                            <FormField label="Stav" error={errors.status?.message}>
                                <select
                                    {...register('status')}
                                    className="w-full p-3 bg-gray-100 rounded-lg border-[1px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]"
                                >
                                    <option value="PLANNED">PLANNED (Připravuje se)</option>
                                    <option value="OPEN">OPEN (Otevřeno)</option>
                                    <option value="CLOSED">CLOSED (Uzavřeno)</option>
                                    <option value="COMPLETED">COMPLETED (Proběhlo)</option>
                                    <option value="CANCELLED">CANCELLED (Zrušeno)</option>
                                </select>
                            </FormField>
                        </div>

                        <FormField label="Popis" error={errors.description?.message}>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full p-3 bg-gray-100 rounded-lg border-[1px] border-transparent focus:outline-none focus:ring-1 focus:ring-[#027BFF] focus:border-[#027BFF]"
                            />
                        </FormField>

                        <FormField label={t('fields.maxCats')} error={errors.maxCats?.message}>
                            <Input type="number" {...register('maxCats')} />
                        </FormField>

                        <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t">Místo konání</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Název haly / místa" error={errors.venueName?.message}>
                                <Input {...register('venueName')} />
                            </FormField>
                            <FormField label="Ulice a číslo" error={errors.venueAddress?.message}>
                                <Input {...register('venueAddress')} />
                            </FormField>
                            <FormField label="Město" error={errors.venueCity?.message}>
                                <Input {...register('venueCity')} />
                            </FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="PSČ" error={errors.venueZip?.message}>
                                    <Input {...register('venueZip')} />
                                </FormField>

                                <FormField label="Stát" error={errors.venueState?.message}>
                                    <Controller
                                        name="venueState"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <CountrySelect
                                                value={value || ''}
                                                onChange={onChange}
                                                placeholder={t('common.select')}
                                            />
                                        )}
                                    />
                                </FormField>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t">Termíny</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField label="Začátek akce" error={errors.startDate?.message}>
                                <Input type="datetime-local" {...register('startDate')} />
                            </FormField>
                            <FormField label="Konec akce" error={errors.endDate?.message}>
                                <Input type="datetime-local" {...register('endDate')} />
                            </FormField>
                            <FormField label="Uzávěrka registrací" error={errors.registrationDeadline?.message}>
                                <Input type="datetime-local" {...register('registrationDeadline')} />
                            </FormField>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t">Harmonogram</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField label={t('fields.vetCheckStart')} error={errors.vetCheckStart?.message}>
                                <Input type="datetime-local" {...register('vetCheckStart')} />
                            </FormField>
                            <FormField label={t('fields.judgingStart')} error={errors.judgingStart?.message}>
                                <Input type="datetime-local" {...register('judgingStart')} />
                            </FormField>
                            <FormField label={t('fields.judgingEnd')} error={errors.judgingEnd?.message}>
                                <Input type="datetime-local" {...register('judgingEnd')} />
                            </FormField>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t">Organizátor</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Název organizace" error={errors.organizerName?.message}>
                                <Input {...register('organizerName')} />
                            </FormField>
                            <FormField label="Kontaktní email" error={errors.organizerContactEmail?.message}>
                                <Input {...register('organizerContactEmail')} />
                            </FormField>
                            <FormField label="Webová stránka" error={errors.websiteUrl?.message}>
                                <Input {...register('websiteUrl')} />
                            </FormField>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t mt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(`/secretariat/shows/${id}`)}
                            >
                                Zrušit
                            </Button>

                            <Button
                                type="submit"
                                variant="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Ukládám...' : 'Uložit změny'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}