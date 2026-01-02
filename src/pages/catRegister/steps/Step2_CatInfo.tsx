import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CatForm } from './CatForm';
import { RegistrationFormData } from '../../../schemas/registrationSchema';
import { defaultCatValues } from '../CatRegistrationForm';
import { registrationApi, SavedCat } from '../../../services/api/registrationApi';

export function Step2_CatInfo() {
    const { t } = useTranslation();
    const { watch, setValue } = useFormContext<RegistrationFormData>();

    const [savedCats, setSavedCats] = useState<SavedCat[]>([]);
    const [alreadyRegisteredIds, setAlreadyRegisteredIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const showId = watch('showId');
    const currentCat = watch('cats.0');

    useEffect(() => {
        const cats = watch('cats');
        if (!cats || cats.length === 0) {
            setValue('cats', [{ ...defaultCatValues, isSaved: false }]);
        }
    }, [setValue, watch]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [myCats, registeredIds] = await Promise.all([
                    registrationApi.getMyCats(),
                    showId ? registrationApi.getRegisteredCatIdsForShow(showId) : Promise.resolve([])
                ]);
                setSavedCats(myCats);
                setAlreadyRegisteredIds(registeredIds);
            } catch (error) {
                console.error("Chyba při načítání", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [showId]);

    const handleSelectSavedCat = (cat: SavedCat) => {
        if (currentCat?.chipNumber === cat.chipNumber && currentCat?.isSaved) {
            handleResetToManual();
            return;
        }

        setValue('cats.0', {
            ...defaultCatValues,
            isSaved: true,
            catName: cat.catName,
            chipNumber: cat.chipNumber || '',
            emsCode: cat.emsCode,
            group: cat.group || '',
            birthDate: cat.birthDate,
            pedigreeNumber: cat.pedigreeNumber || '',
            gender: cat.gender.toLowerCase() as 'male' | 'female',
            titleBefore: cat.titleBefore || '',
            titleAfter: cat.titleAfter || '',

            motherName: cat.motherName || '',
            motherTitleBefore: cat.motherTitleBefore || '',
            motherTitleAfter: cat.motherTitleAfter || '',
            motherEmsCode: cat.motherEmsCode || '',
            motherBirthDate: cat.motherBirthDate || '',
            motherChipNumber: cat.motherChipNumber || '',
            motherPedigreeNumber: cat.motherPedigreeNumber || '',
            motherGender: 'female',

            fatherName: cat.fatherName || '',
            fatherTitleBefore: cat.fatherTitleBefore || '',
            fatherTitleAfter: cat.fatherTitleAfter || '',
            fatherEmsCode: cat.fatherEmsCode || '',
            fatherBirthDate: cat.fatherBirthDate || '',
            fatherChipNumber: cat.fatherChipNumber || '',
            fatherPedigreeNumber: cat.fatherPedigreeNumber || '',
            fatherGender: 'male',
        }, { shouldValidate: true });
    };

    const handleResetToManual = () => {
        setValue('cats.0', {
            ...defaultCatValues,
            isSaved: false
        });
    };

    return (
        <div className="space-y-8">

            <div>
                <div className="flex flex-col items-center justify-center text-center mb-8 gap-3">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {t('registration.step2.choose_saved_title')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {t('registration.step2.choose_saved_desc')}
                        </p>
                    </div>

                    {currentCat?.isSaved && (
                        <button
                            type="button"
                            onClick={handleResetToManual}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {t('registration.step2.clear_selection')}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                        <div className="text-gray-500 text-sm">{t('common.loading')}</div>
                    </div>
                ) : savedCats.length === 0 ? (
                    <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-sm">
                        {t('registration.step2.no_saved_cats')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
                        {savedCats.map((cat) => {
                            const isRegisteredInDb = alreadyRegisteredIds.includes(cat.id);
                            const isSelected = currentCat?.chipNumber === cat.chipNumber && currentCat?.isSaved;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    disabled={isRegisteredInDb}
                                    onClick={() => handleSelectSavedCat(cat)}
                                    className={`group relative flex flex-col items-start p-4 text-left rounded-xl border transition-all duration-200
                                        ${isRegisteredInDb
                                        ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-md'
                                            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5'
                                    }
                                    `}
                                >
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">
                                                {cat.emsCode}
                                            </span>
                                            {isRegisteredInDb && (
                                                <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                                                    {t('status.registered')}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className={`font-bold text-sm truncate w-full mb-0.5 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {cat.catName}
                                        </h4>
                                        <p className="text-xs text-gray-400 truncate h-4">{cat.chipNumber}</p>
                                    </div>

                                    {/* Indikátor výběru - fajfka */}
                                    {isSelected && (
                                        <div className="absolute top-[-8px] right-[-8px] bg-blue-600 text-white rounded-full p-1 shadow-sm border-2 border-white">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
                <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900">
                        {t('registration.step2.cat_details_title')}
                    </h3>
                </div>

                <CatForm catIndex={0} onRemove={null} />
            </div>
        </div>
    );
}