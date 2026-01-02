import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secretariatApi, SecretariatEntryDetail } from '../services/api/secretariatApi';

interface Props {
    entryId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const EditEntryModal = ({ entryId, isOpen, onClose, onSave }: Props) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<SecretariatEntryDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && entryId) {
            setLoading(true);
            secretariatApi.getEntryDetail(entryId)
                .then(setFormData)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isOpen, entryId]);

    const handleSave = async () => {
        if (!formData || !entryId) return;
        try {
            await secretariatApi.updateEntry(entryId, formData);
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert(t('common.error'));
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#027BFF] focus:border-transparent outline-none transition-all";
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
                            <div>
                                <label className={labelClass}>{t('catForm.catName')}</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={formData.catName}
                                    onChange={e => setFormData({...formData, catName: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>{t('catForm.emsCode')}</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.emsCode}
                                        onChange={e => setFormData({...formData, emsCode: e.target.value})}
                                    />
                                </div>
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
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>{t('catForm.showClass')}</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.showClass}
                                        onChange={e => setFormData({...formData, showClass: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('catalog.catalogNumber')}</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder={t('secretariat.editModal.notAssigned')}
                                        value={formData.catalogNumber || ''}
                                        onChange={e => setFormData({...formData, catalogNumber: e.target.value})}
                                    />
                                </div>
                            </div>

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