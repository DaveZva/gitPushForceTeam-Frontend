import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Pomocná komponenta FormField (přesunuta dovnitř)
const FormField = ({ label, name, children, error }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-sm font-semibold text-gray-700">
            {label}
        </label>
        {children}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
);

// Běžný vzhled inputu a selectu
const inputClass = "w-full p-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500";

// --- Pomocná komponenta pro grid ---
const FormGrid = ({ children }) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children}
    </div>
);

// --- Komponenta pro 1 kočku ---
export function CatForm({ catIndex, onRemove }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('basic'); // Vracíme zpět stav pro záložky
    const { register, formState: { errors }, watch, setValue } = useFormContext();

    // Dynamické cesty k polím
    const fieldName = (name) => `cats.${catIndex}.${name}`;
    const fieldError = (name) => errors.cats?.[catIndex]?.[name];

    // EMS kód handler
    const emsPrefix = watch(fieldName("emsCode"))?.substring(0, 3) || '';
    const emsSuffix = watch(fieldName("emsCode"))?.substring(4) || '';

    const handleEmsChange = (e) => {
        const { name, value } = e.target;
        const newPrefix = (name === "emsPrefix") ? value : emsPrefix;
        const newSuffix = (name === "emsSuffix") ? value : emsSuffix;

        setValue(fieldName('emsCode'), `${newPrefix} ${newSuffix}`.trim(), { shouldValidate: true });
    };

    // --- Tlačítko pro záložku (přesunuto dovnitř) ---
    const TabButton = ({ label, isActive, onClick }) => (
        <button
            type="button"
            className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <FormGrid>
                        {/* --- ZÁKLADNÍ ÚDAJE --- */}
                        <FormField label={t('catForm.titleBefore')} name={fieldName("titleBefore")} error={fieldError("titleBefore")}>
                            <select {...register(fieldName("titleBefore"))} className={inputClass}>
                                <option value="">-- {t('common.noTitle')} --</option>
                                <option value="champion">CH</option>
                                <option value="inter-champion">IC</option>
                                <option value="grand-inter-champion">GIC</option>
                                <option value="supreme-champion">SC</option>
                                <option value="national-winner">NV</option>
                                <option value="world-winner">WW</option>
                                <option value="junior-world-winner">JWW</option>
                            </select>
                        </FormField>

                        <FormField label={t('catForm.catName')} name={fieldName("catName")} error={fieldError("catName")}>
                            <input type="text" {...register(fieldName("catName"))} className={inputClass} placeholder="Molly" />
                        </FormField>

                        <FormField label={t('catForm.titleAfter')} name={fieldName("titleAfter")} error={fieldError("titleAfter")}>
                            <select {...register(fieldName("titleAfter"))} className={inputClass}>
                                <option value="">-- {t('common.noTitle')} --</option>
                                <option value="junior-winner">JW</option>
                                <option value="distinguished-show-merit">DSM</option>
                                <option value="distinguished-variety-merit">DVM</option>
                                <option value="distinguished-merit">DM</option>
                            </select>
                        </FormField>

                        <FormField label={t('catForm.chipNumber')} name={fieldName("chipNumber")} error={fieldError("chipNumber")}>
                            <input type="text" {...register(fieldName("chipNumber"))} className={inputClass} placeholder="15 místné číslo" />
                        </FormField>

                        <FormField label={t('catForm.gender')} name={fieldName("gender")} error={fieldError("gender")}>
                            <select {...register(fieldName("gender"))} className={inputClass}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="male">{t('catForm.male')}</option>
                                <option value="female">{t('catForm.female')}</option>
                            </select>
                        </FormField>

                        <FormField label={t('catForm.neutered')} name={fieldName("neutered")} error={fieldError("neutered")}>
                            <select {...register(fieldName("neutered"))} className={inputClass}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="yes">{t('common.yes')}</option>
                                <option value="no">{t('common.no')}</option>
                            </select>
                        </FormField>

                        <FormField label={t('catForm.emsCode')} name={fieldName("emsCode")} error={fieldError("emsCode")}>
                            <div className="flex gap-2">
                                <select
                                    name="emsPrefix"
                                    value={emsPrefix}
                                    onChange={handleEmsChange}
                                    className={`${inputClass} w-1/3`}
                                >
                                    <option value="">???</option>
                                    <option value="BRI">BRI</option>
                                    <option value="PER">PER</option>
                                    <option value="MCO">MCO</option>
                                    <option value="SIA">SIA</option>
                                    <option value="BEN">BEN</option>
                                    <option value="RAG">RAG</option>
                                    <option value="SFO">SFO</option>
                                    <option value="OTH">OTH</option>
                                </select>
                                <input
                                    type="text"
                                    name="emsSuffix"
                                    value={emsSuffix}
                                    onChange={handleEmsChange}
                                    className={`${inputClass} w-2/3`}
                                    placeholder="ns 24"
                                />
                            </div>
                        </FormField>

                        <FormField label={t('catForm.birthDate')} name={fieldName("birthDate")} error={fieldError("birthDate")}>
                            <input type="date" {...register(fieldName("birthDate"))} className={inputClass} />
                        </FormField>

                        <FormField label={t('catForm.showClass')} name={fieldName("showClass")} error={fieldError("showClass")}>
                            <select {...register(fieldName("showClass"))} className={inputClass}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="class7">{t('catForm.classOptions.c7')}</option>
                                <option value="class6">{t('catForm.classOptions.c6')}</option>
                                <option value="class5">{t('catForm.classOptions.c5')}</option>
                                <option value="class4">{t('catForm.classOptions.c4')}</option>
                                <option value="class3">{t('catForm.classOptions.c3')}</option>
                                <option value="class2">{t('catForm.classOptions.c2')}</option>
                                <option value="class1">{t('catForm.classOptions.c1')}</option>
                            </select>
                        </FormField>

                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("pedigreeNumber")} error={fieldError("pedigreeNumber")}>
                            <input type="text" {...register(fieldName("pedigreeNumber"))} className={inputClass} placeholder="CSZ FO 1234/18" />
                        </FormField>

                        <FormField label={t('catForm.cageType')} name={fieldName("cageType")} error={fieldError("cageType")}>
                            <select {...register(fieldName("cageType"))} className={inputClass}>
                                <option value="">-- {t('common.select')} --</option>
                                <option value="own_cage">{t('catForm.cageOptions.own')}</option>
                                <option value="rent_small">{t('catForm.cageOptions.rentSmall')}</option>
                                <option value="rent_large">{t('catForm.cageOptions.rentLarge')}</option>
                            </select>
                        </FormField>
                    </FormGrid>
                );
            case 'pedigree': // Matka
                return (
                    <FormGrid>
                        {/* --- RODOKMEN - MATKA --- */}
                        <FormField label={t('catForm.titleBefore')} name={fieldName("motherTitleBefore")} error={fieldError("motherTitleBefore")}>
                            <input type="text" {...register(fieldName("motherTitleBefore"))} className={inputClass} placeholder="CH" />
                        </FormField>
                        <FormField label={t('catForm.name')} name={fieldName("motherName")} error={fieldError("motherName")}>
                            <input type="text" {...register(fieldName("motherName"))} className={inputClass} placeholder={t('catForm.motherNamePlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.titleAfter')} name={fieldName("motherTitleAfter")} error={fieldError("motherTitleAfter")}>
                            <input type="text" {...register(fieldName("motherTitleAfter"))} className={inputClass} />
                        </FormField>
                        <FormField label={t('catForm.breed')} name={fieldName("motherBreed")} error={fieldError("motherBreed")}>
                            <input type="text" {...register(fieldName("motherBreed"))} className={inputClass} placeholder={t('catForm.breedPlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.emsCodeShort')} name={fieldName("motherEmsCode")} error={fieldError("motherEmsCode")}>
                            <input type="text" {...register(fieldName("motherEmsCode"))} className={inputClass} />
                        </FormField>
                        <FormField label={t('catForm.color')} name={fieldName("motherColor")} error={fieldError("motherColor")}>
                            <input type="text" {...register(fieldName("motherColor"))} className={inputClass} />
                        </FormField>
                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("motherPedigreeNumber")} error={fieldError("motherPedigreeNumber")}>
                            <input type="text" {...register(fieldName("motherPedigreeNumber"))} className={inputClass} />
                        </FormField>
                    </FormGrid>
                );
            case 'father': // Otec
                return (
                    <FormGrid>
                        {/* --- RODOKMEN - OTEC --- */}
                        <FormField label={t('catForm.titleBefore')} name={fieldName("fatherTitleBefore")} error={fieldError("fatherTitleBefore")}>
                            <input type="text" {...register(fieldName("fatherTitleBefore"))} className={inputClass} placeholder="GIC" />
                        </FormField>
                        <FormField label={t('catForm.name')} name={fieldName("fatherName")} error={fieldError("fatherName")}>
                            <input type="text" {...register(fieldName("fatherName"))} className={inputClass} placeholder={t('catForm.fatherNamePlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.titleAfter')} name={fieldName("fatherTitleAfter")} error={fieldError("fatherTitleAfter")}>
                            <input type="text" {...register(fieldName("fatherTitleAfter"))} className={inputClass} />
                        </FormField>
                        <FormField label={t('catForm.breed')} name={fieldName("fatherBreed")} error={fieldError("fatherBreed")}>
                            <input type="text" {...register(fieldName("fatherBreed"))} className={inputClass} placeholder={t('catForm.breedPlaceholder')} />
                        </FormField>
                        <FormField label={t('catForm.emsCodeShort')} name={fieldName("fatherEmsCode")} error={fieldError("fatherEmsCode")}>
                            <input type="text" {...register(fieldName("fatherEmsCode"))} className={inputClass} />
                        </FormField>
                        <FormField label={t('catForm.color')} name={fieldName("fatherColor")} error={fieldError("fatherColor")}>
                            <input type="text" {...register(fieldName("fatherColor"))} className={inputClass} />
                        </FormField>
                        <FormField label={t('catForm.pedigreeNumber')} name={fieldName("fatherPedigreeNumber")} error={fieldError("fatherPedigreeNumber")}>
                            <input type="text" {...register(fieldName("fatherPedigreeNumber"))} className={inputClass} />
                        </FormField>
                    </FormGrid>
                );
            default:
                return null;
        }
    };

    return (
        // Wrapper pro jednu kočku
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex flex-col items-stretch gap-6 mb-8 md:flex-row md:items-center md:justify-between">

                {/* --- Taby (vráceny zpět) --- */}
                <div className="flex flex-col flex-grow p-1 bg-gray-100 rounded-full md:flex-row">
                    <TabButton
                        label={t('catForm.tabs.basic')}
                        isActive={activeTab === 'basic'}
                        onClick={() => setActiveTab('basic')}
                    />
                    <TabButton
                        label={t('catForm.tabs.mother')}
                        isActive={activeTab === 'pedigree'}
                        onClick={() => setActiveTab('pedigree')}
                    />
                    <TabButton
                        label={t('catForm.tabs.father')}
                        isActive={activeTab === 'father'}
                        onClick={() => setActiveTab('father')}
                    />
                </div>

                {/* Tlačítko pro odebrání (zobrazí se jen pokud onRemove existuje) */}
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-5 py-3 font-semibold text-red-600 transition-colors bg-white border-2 border-red-200 rounded-full hover:bg-red-50 whitespace-nowrap"
                    >
                        {t('catForm.removeCat')}
                    </button>
                )}
            </div>

            <div className="pt-4">
                {renderTabContent()}
            </div>
        </div>
    );
}