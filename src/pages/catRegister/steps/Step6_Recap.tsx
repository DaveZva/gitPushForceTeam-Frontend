import React, { useState, useEffect, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { registrationApi, AvailableShow } from '../../../services/api/registrationApi';
import { RegistrationFormData, CatFormData } from '../../../schemas/registrationSchema';

export function Step6_Recap() {
    const { getValues } = useFormContext<RegistrationFormData>();
    const { t } = useTranslation();
    const data = getValues();

    interface RecapItemProps {
        label: string;
        value: ReactNode;
    }
    const RecapItem: React.FC<RecapItemProps> = ({ label, value }) => (
        <div className="py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <p className="text-base font-semibold text-gray-800">{value || '-'}</p>
        </div>
    );

    interface RecapSectionProps {
        title: string;
        children: ReactNode;
    }
    const RecapSection: React.FC<RecapSectionProps> = ({ title, children }) => (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-blue-700 border-b border-blue-200 pb-2 mb-4">
                {title}
            </h3>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </div>
    );

    const [shows, setShows] = useState<AvailableShow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadShows = async () => {
            try {
                const availableShows = await registrationApi.getAvailableShows();
                setShows(availableShows);
            } catch (error) {
                console.error("Chyba při načítání výstav v rekapitulaci:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadShows();
    }, []);

    const selectedShow = shows.find(show => String(show.id) === String(data.showId));
    const showName = isLoading ? t('common.loading') : (selectedShow ? `${selectedShow.name} (${selectedShow.date})` : data.showId);

    const daysMap: Record<string, string> = { sat: t('common.sat'), sun: t('common.sun'), both: t('common.both') };
    const genderMap: Record<string, string> = { male: t('catForm.male'), female: t('catForm.female') };
    const neuteredMap: Record<string, string> = { yes: t('common.yes'), no: t('common.no') };

    const classMap: Record<string, string> = {
        supreme_champion: t('catForm.classOptions.c1'),
        supreme_premior: t('catForm.classOptions.c2'),
        grant_inter_champion: t('catForm.classOptions.c3'),
        grant_inter_premier: t('catForm.classOptions.c4'),
        international_champion: t('catForm.classOptions.c5'),
        international_premier: t('catForm.classOptions.c6'),
        champion: t('catForm.classOptions.c7'),
        premier: t('catForm.classOptions.c8'),
        open: t('catForm.classOptions.c9'),
        neuter: t('catForm.classOptions.c10'),
        junior: t('catForm.classOptions.c11'),
        kitten: t('catForm.classOptions.c12'),
        novice_class: t('catForm.classOptions.c13a'),
        control_class: t('catForm.classOptions.c13b'),
        determination_class: t('catForm.classOptions.c13c'),
        domestic_cat: t('catForm.classOptions.c14'),
        out_of_competition: t('catForm.classOptions.c15'),
        litter: t('catForm.classOptions.c16'),
        veteran: t('catForm.classOptions.c17'),
    };

    const cageMap: Record<string, string> = {
        own_cage: t('catForm.cageOptions.own'),
        rent_small: t('catForm.cageOptions.rentSmall'),
        rent_large: t('catForm.cageOptions.rentLarge'),
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">{t('recap.title')}</h2>
            <p className="text-gray-600">
                {t('recap.checkData')}
            </p>

            <div className="space-y-6">
                <RecapSection title={t('recap.exhibition')}>
                    <RecapItem label={t('recap.showName')} value={showName} />
                    <RecapItem label={t('recap.days')} value={daysMap[data.days]} />
                </RecapSection>

                {data.cats && data.cats.map((cat, index) => (
                    <RecapSection title={`${t('recap.cat')} ${index + 1}`} key={index}>
                        <RecapItem label={t('catForm.name')} value={`${cat.titleBefore || ''} ${cat.catName} ${cat.titleAfter || ''}`.trim()} />
                        <RecapItem label={t('catForm.gender')} value={genderMap[cat.gender]} />
                        <RecapItem label={t('catForm.neutered')} value={neuteredMap[cat.neutered]} />
                        <RecapItem label={t('catForm.birthDate')} value={cat.birthDate} />
                        <RecapItem label={t('catForm.emsCode')} value={cat.emsCode} />
                        <RecapItem label={t('catForm.showClass')} value={classMap[cat.showClass] || cat.showClass} />
                        <RecapItem label={t('catForm.chipNumber')} value={cat.chipNumber} />
                        <RecapItem label={t('catForm.cageType')} value={cageMap[cat.cageType] || cat.cageType} />
                    </RecapSection>
                ))}

                <RecapSection title={t('recap.breeder')}>
                    <RecapItem label={t('recap.name')} value={`${data.breederFirstName} ${data.breederLastName}`} />
                    <RecapItem label={t('recap.address')} value={`${data.breederAddress}, ${data.breederZip} ${data.breederCity}`} />
                    <RecapItem label={t('recap.email')} value={data.breederEmail} />
                    <RecapItem label={t('recap.phone')} value={data.breederPhone} />
                </RecapSection>

                <RecapSection title={t('recap.exhibitor')}>
                    {data.sameAsBreeder ? (
                        <p className="p-3 text-gray-700 bg-gray-100 rounded-md">
                            {t('recap.sameAsBreeder')}
                        </p>
                    ) : (
                        <>
                            <RecapItem label={t('recap.name')} value={`${data.exhibitorFirstName} ${data.exhibitorLastName}`} />
                            <RecapItem label={t('recap.address')} value={`${data.exhibitorAddress}, ${data.exhibitorZip} ${data.exhibitorCity}`} />
                            <RecapItem label={t('recap.email')} value={data.exhibitorEmail} />
                            <RecapItem label={t('recap.phone')} value={data.exhibitorPhone} />
                        </>
                    )}
                </RecapSection>

                <RecapSection title={t('recap.notesAndConsent')}>
                    <RecapItem label={t('recap.notes')} value={data.notes} />
                    <RecapItem label={t('recap.dataAccuracy')} value={data.dataAccuracy ? `✓ ${t('common.agreed')}` : `X ${t('common.notAgreed')}`} />
                    <RecapItem label={t('recap.gdprConsent')} value={data.gdprConsent ? `✓ ${t('common.agreed')}` : `X ${t('common.notAgreed')}`} />
                </RecapSection>
            </div>
        </div>
    );
}