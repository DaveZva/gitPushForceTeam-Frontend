import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { registrationApi, SavedCat } from '../../services/api/registrationApi';
import { Button } from '../../components/ui/Button';
import { MyCatModal } from '../../components/MyCatModal';
import { toast } from 'react-hot-toast';

export default function MyCatsPage() {
    const { t } = useTranslation();
    const [cats, setCats] = useState<SavedCat[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState<SavedCat | null>(null);

    const loadCats = async () => {
        setLoading(true);
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
        try {
            await registrationApi.deleteCat(cat.id);
            toast.success(t('common.saveChanges'));
            loadCats();
        } catch (e) {
            toast.error(t('errors.serverError'));
        }
    };

    return (
        <div className="py-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{t('myCats.title')}</h1>
                    <p className="text-gray-500">{t('myCats.subtitle')}</p>
                </div>
                <Button onClick={handleCreate}>+ {t('myCats.addCat')}</Button>
            </div>

            {loading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : cats.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                    <p className="text-gray-500 mb-4">{t('myCats.noCats')}</p>
                    <Button variant="outline" onClick={handleCreate}>{t('myCats.addCat')}</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {cats.map(cat => (
                        <div key={cat.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{cat.titleBefore} {cat.catName} {cat.titleAfter}</h3>
                                    <span className="bg-gray-100 text-xs px-2 py-1 rounded font-bold">{cat.emsCode}</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1 mb-4">
                                    <p>{t('catForm.chipNumber')}: <span className="font-mono">{cat.chipNumber}</span></p>
                                    <p>{t('catForm.pedigreeNumber')}: {cat.pedigreeNumber}</p>
                                    <p>{t('myCats.breederLabel')}: {cat.breederName || '-'}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button size="sm" variant="outline" onClick={() => handleDelete(cat)} className="text-red-600 hover:bg-red-50 border-red-200">
                                    {t('myCats.deleteCat')}
                                </Button>
                                <Button size="sm" onClick={() => handleEdit(cat)}>
                                    {t('myCats.editCat')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <MyCatModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadCats}
                catToEdit={selectedCat}
            />
        </div>
    );
}