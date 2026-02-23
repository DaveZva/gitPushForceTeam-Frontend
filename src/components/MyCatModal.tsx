import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { registrationApi, SavedCat } from '../services/api/registrationApi';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface MyCatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    catToEdit: SavedCat | null;
}

const Icons = {
    Close: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
};

export const MyCatModal: React.FC<MyCatModalProps> = ({ isOpen, onClose, onSuccess, catToEdit }) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Použijeme useForm pro správu formuláře
    const { register, handleSubmit, reset, setValue } = useForm<Partial<SavedCat>>();

    // Resetování formuláře při otevření/změně kočky
    useEffect(() => {
        if (isOpen) {
            if (catToEdit) {
                // Naplnění formuláře daty k editaci
                Object.keys(catToEdit).forEach(key => {
                    setValue(key as keyof SavedCat, catToEdit[key as keyof SavedCat]);
                });
            } else {
                // Vyčištění pro novou kočku
                reset({
                    catName: '',
                    emsCode: '',
                    pedigreeNumber: '',
                    chipNumber: '',
                    birthDate: '',
                    gender: 'MALE'
                });
            }
        }
    }, [isOpen, catToEdit, reset, setValue]);

    const onSubmit = async (data: Partial<SavedCat>) => {
        setIsSubmitting(true);
        try {
            if (catToEdit && catToEdit.id) {
                await registrationApi.updateCat(catToEdit.id, data);
                toast.success(t('common.savedSuccessfully'));
            } else {
                await registrationApi.createCat(data);
                toast.success(t('common.createdSuccessfully'));
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(t('errors.saveFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {catToEdit ? t('myCats.editCat') : t('myCats.addCat')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                    >
                        <Icons.Close />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="cat-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Základní informace */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 border-b pb-2">{t('catForm.sectionBasic')}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.catName')} *</label>
                                    <Input {...register('catName', { required: true })} placeholder="např. Fluffy" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.emsCode')} *</label>
                                    <Input {...register('emsCode', { required: true })} placeholder="např. MCO n 03" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.titleBefore')}</label>
                                    <Input {...register('titleBefore')} placeholder="IC" />
                                </div>
                                <div className="col-span-1 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.titleAfter')}</label>
                                    <Input {...register('titleAfter')} placeholder="DSM" />
                                </div>
                                <div className="col-span-1 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.sex')} *</label>
                                    <Select {...register('gender', { required: true })}>
                                        <option value="MALE">1.0 (Male)</option>
                                        <option value="FEMALE">0.1 (Female)</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.birthDate')} *</label>
                                    <Input type="date" {...register('birthDate', { required: true })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.chipNumber')}</label>
                                    <Input {...register('chipNumber')} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">{t('catForm.pedigreeNumber')}</label>
                                <Input {...register('pedigreeNumber')} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">{t('myCats.breederLabel')}</label>
                                <Input {...register('breederName')} placeholder={t('catForm.breederNamePlaceholder')} />
                            </div>
                        </div>

                        {/* Rodiče (volitelné) */}
                        <div className="space-y-4 pt-2">
                            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 border-b pb-2">{t('catForm.sectionParents')}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.father')}</label>
                                    <Input {...register('fatherName')} placeholder={t('catForm.fatherPlaceholder')} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">{t('catForm.mother')}</label>
                                    <Input {...register('motherName')} placeholder={t('catForm.motherPlaceholder')} />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <LoadingSpinner size="sm" /> : t('common.save')}
                    </Button>
                </div>
            </div>
        </div>
    );
};