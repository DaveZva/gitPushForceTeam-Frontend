import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { registrationApi, SavedCat } from '../../services/api/registrationApi';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { MyCatModal } from '../../components/MyCatModal';

const Icons = {
    Plus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    ),
    Trash: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    ),
    Pencil: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
    ),
    Cat: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
    )
};

export default function MyCatsPage() {
    const { t } = useTranslation();
    const [cats, setCats] = useState<SavedCat[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState<SavedCat | null>(null);
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    const loadCats = async () => {
        try {
            const data = await registrationApi.getMyCats();
            setCats(data);
        } catch (e) {
            toast.error(t('errors.fetchFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCats();
    }, []);

    const handleCreate = () => {
        setSelectedCat(null);
        setModalOpen(true);
    };

    const handleEdit = (cat: SavedCat) => {
        setSelectedCat(cat);
        setModalOpen(true);
    };

    const handleDelete = async (cat: SavedCat) => {
        if (!window.confirm(t('myCats.deleteConfirm'))) return;

        setDeletingId(cat.id);
        try {
            await registrationApi.deleteCat(cat.id);
            setCats(prev => prev.filter(c => c.id !== cat.id));
            toast.success(t('common.deletedSuccessfully'));
        } catch (e) {
            toast.error(t('errors.serverError'));
        } finally {
            setDeletingId(null);
        }
    };

    const handleModalSuccess = () => {
        loadCats();
        setModalOpen(false);
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="py-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('myCats.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('myCats.subtitle')}</p>
                </div>
                <Button onClick={handleCreate} className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                    <Icons.Plus />
                    {t('myCats.addCat')}
                </Button>
            </div>

            {cats.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <Icons.Cat />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('myCats.noCatsTitle')}</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">{t('myCats.noCatsDescription')}</p>
                    <Button variant="secondary" onClick={handleCreate} className="flex items-center gap-2">
                        <Icons.Plus />
                        {t('myCats.addCat')}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cats.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-bold text-xl text-gray-900 truncate">
                                            {cat.titleBefore} {cat.catName} {cat.titleAfter}
                                        </h3>
                                        <p className="text-sm text-gray-500">{cat.birthDate} • {cat.gender === 'MALE' ? '1.0' : '0.1'}</p>
                                    </div>
                                    <span className="bg-blue-50 text-[#027BFF] text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                                        {cat.emsCode}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                                        <span className="text-gray-500">{t('catForm.chipNumber')}</span>
                                        <span className="font-mono font-medium text-gray-700">{cat.chipNumber || '---'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                                        <span className="text-gray-500">{t('catForm.pedigreeNumber')}</span>
                                        <span className="font-medium text-gray-700 truncate max-w-[150px]" title={cat.pedigreeNumber}>
                                            {cat.pedigreeNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-gray-500">{t('myCats.breederLabel')}</span>
                                        <span className="font-medium text-gray-700 truncate max-w-[150px]" title={cat.breederName}>
                                            {cat.breederName || '---'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Button
                                    //size="sm"
                                    variant="secondary"
                                    onClick={() => handleEdit(cat)}
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    <Icons.Pencil />
                                    {t('common.edit')}
                                </Button>
                                <Button
                                    variant="outlineDanger"
                                    onClick={() => handleDelete(cat)}
                                    disabled={deletingId === cat.id}
                                    className="px-3"
                                >
                                    {deletingId === cat.id ? <LoadingSpinner size="sm" /> : <Icons.Trash />}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <MyCatModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleModalSuccess}
                catToEdit={selectedCat}
            />
        </div>
    );
}