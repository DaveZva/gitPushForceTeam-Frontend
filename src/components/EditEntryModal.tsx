import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secretariatApi, SecretariatEntryDetail } from '../services/api/secretariatApi';
import { BREED_OPTIONS, validateEmsCode } from '../utils/emsRules';

interface Props {
    entryId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const SHOW_CLASSES = [
    { value: 'supreme_champion', labelKey: 'c1', number: '01' },
    { value: 'supreme_premior', labelKey: 'c2', number: '02' },
    { value: 'grant_inter_champion', labelKey: 'c3', number: '03' },
    { value: 'grant_inter_premier', labelKey: 'c4', number: '04' },
    { value: 'international_champion', labelKey: 'c5', number: '05' },
    { value: 'international_premier', labelKey: 'c6', number: '06' },
    { value: 'champion', labelKey: 'c7', number: '07' },
    { value: 'premier', labelKey: 'c8', number: '08' },
    { value: 'open', labelKey: 'c9', number: '09' },
    { value: 'neuter', labelKey: 'c10', number: '10' },
    { value: 'junior', labelKey: 'c11', number: '11' },
    { value: 'kitten', labelKey: 'c12', number: '12' },
    { value: 'novice_class', labelKey: 'c13a', number: '13a' },
    { value: 'control_class', labelKey: 'c13b', number: '13b' },
    { value: 'determination_class', labelKey: 'c13c', number: '13c' },
    { value: 'domestic_cat', labelKey: 'c14', number: '14' },
    { value: 'out_of_competition', labelKey: 'c15', number: '15' },
    { value: 'litter', labelKey: 'c16', number: '16' },
    { value: 'veteran', labelKey: 'c17', number: '17' },
];

export const EditEntryModal = ({ entryId, isOpen, onClose, onSave }: Props) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<SecretariatEntryDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const [breed, setBreed] = useState<string>('');
    const [emsSuffix, setEmsSuffix] = useState<string>('');
    const [catGroup, setCatGroup] = useState<string>(''); // Nové: Skupina
    const [emsError, setEmsError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && entryId) {
            setLoading(true);
            setEmsError(null);
            secretariatApi.getEntryDetail(entryId)
                .then(data => {
                    if (data.showClass) {
                        data.showClass = data.showClass.toLowerCase();
                    }

                    setFormData(data);

                    setCatGroup(data.catGroup || '');

                    if (data.emsCode) {
                        const parts = data.emsCode.split(' ');
                        const loadedBreed = parts[0];
                        const loadedSuffix = parts.slice(1).join(' ');
                        setBreed(loadedBreed);
                        setEmsSuffix(loadedSuffix);
                    } else {
                        setBreed('');
                        setEmsSuffix('');
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isOpen, entryId]);

    const handleEmsChange = (newBreed: string, newSuffix: string) => {
        setBreed(newBreed);
        setEmsSuffix(newSuffix);

        const fullEms = `${newBreed} ${newSuffix}`.trim();
        const validation = validateEmsCode(fullEms);

        if (validation === true) {
            setEmsError(null);
        } else {
            setEmsError(typeof validation === 'string' ? validation : t('validation.cat.group.invalid'));
        }
    };

    const handleSave = async () => {
        if (!formData || !entryId) return;

        const fullEms = `${breed} ${emsSuffix}`.trim();
        const validation = validateEmsCode(fullEms);

        if (validation !== true) {
            setEmsError(typeof validation === 'string' ? validation : t('validation.cat.group.invalid'));
            return;
        }

        try {
            await secretariatApi.updateEntry(entryId, {
                ...formData,
                emsCode: fullEms,
                catGroup: catGroup
            });
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert(t('common.error'));
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#027BFF] focus:border-transparent outline-none transition-all disabled:bg-gray-100";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">{t('secretariat.editModal.title')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {loading || !formData ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#027BFF]"></div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Row 1: Titles & Name */}
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 sm:col-span-3">
                                    <label className={labelClass}>{t('catForm.titleBefore')}</label>
                                    <select
                                        className={inputClass}
                                        value={formData.titleBefore || ''}
                                        onChange={e => setFormData({...formData, titleBefore: e.target.value})}
                                    >
                                        <option value="">-- {t('common.noTitle')} --</option>
                                        <option value="champion">CH</option>
                                        <option value="inter-champion">IC</option>
                                        <option value="grand-inter-champion">GIC</option>
                                        <option value="supreme-champion">SC</option>
                                        <option value="national-winner">NV</option>
                                        <option value="world-winner">WW</option>
                                        <option value="junior-world-winner">JWW</option>
                                    </select>
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <label className={labelClass}>{t('catForm.catName')}</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.catName}
                                        onChange={e => setFormData({...formData, catName: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-3">
                                    <label className={labelClass}>{t('catForm.titleAfter')}</label>
                                    <select
                                        className={inputClass}
                                        value={formData.titleAfter || ''}
                                        onChange={e => setFormData({...formData, titleAfter: e.target.value})}
                                    >
                                        <option value="">-- {t('common.noTitle')} --</option>
                                        <option value="junior-winner">JW</option>
                                        <option value="distinguished-show-merit">DSM</option>
                                        <option value="distinguished-variety-merit">DVM</option>
                                        <option value="distinguished-merit">DM</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: EMS Logic + Group */}
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 sm:col-span-5">
                                    <label className={labelClass}>{t('catForm.breed')}</label>
                                    <select
                                        className={inputClass}
                                        value={breed}
                                        onChange={e => handleEmsChange(e.target.value, emsSuffix)}
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {BREED_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-12 sm:col-span-4">
                                    <label className={labelClass}>{t('catForm.emsCodeShort')} (Suffix)</label>
                                    <input
                                        type="text"
                                        className={`${inputClass} ${emsError ? 'border-red-500 bg-red-50' : ''}`}
                                        value={emsSuffix}
                                        onChange={e => handleEmsChange(breed, e.target.value)}
                                        placeholder="n 03 22"
                                    />
                                    {emsError && <p className="text-red-500 text-xs mt-1">{emsError}</p>}
                                </div>
                                <div className="col-span-12 sm:col-span-3">
                                    <label className={labelClass}>{t('catForm.group')}</label>
                                    <select
                                        className={inputClass}
                                        value={catGroup}
                                        onChange={e => setCatGroup(e.target.value)}
                                    >
                                        <option value="">-</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>
                                                {t('catForm.groupOption', { number: i + 1 })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Gender & Show Class */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>{t('catForm.gender')}</label>
                                    <select
                                        className={inputClass}
                                        value={formData.gender}
                                        onChange={e => setFormData({...formData, gender: e.target.value})}
                                    >
                                        <option value="MALE">{t('common.male')} (1,0)</option>
                                        <option value="FEMALE">{t('common.female')} (0,1)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>{t('catForm.showClass')}</label>
                                    <select
                                        className={inputClass}
                                        value={formData.showClass}
                                        onChange={e => setFormData({...formData, showClass: e.target.value})}
                                    >
                                        <option value="">-- {t('common.select')} --</option>
                                        {SHOW_CLASSES.map(cls => (
                                            <option key={cls.value} value={cls.value}>
                                                {cls.number} - {t(`catForm.classOptions.${cls.labelKey}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 4: Identifiers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>{t('catForm.chip')}</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.chipNumber}
                                        onChange={e => setFormData({...formData, chipNumber: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('catForm.pedigree')}</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.pedigreeNumber}
                                        onChange={e => setFormData({...formData, pedigreeNumber: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-[#027BFF] text-white font-semibold rounded-xl hover:bg-[#006ce6] transition-colors shadow-lg shadow-blue-500/30 text-sm"
                    >
                        {t('common.saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
};