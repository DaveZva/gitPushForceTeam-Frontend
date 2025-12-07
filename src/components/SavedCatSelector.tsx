import React, { useEffect, useState } from 'react';
import { registrationApi, SavedCat } from '../services/api/registrationApi';
import { useTranslation } from 'react-i18next';

interface Props {
    showId: string;
    onSelect: (cat: SavedCat) => void;
    onCancel: () => void;
}

export const SavedCatSelector: React.FC<Props> = ({ showId, onSelect, onCancel }) => {
    const { t } = useTranslation();
    const [cats, setCats] = useState<SavedCat[]>([]);
    const [registeredIds, setRegisteredIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [myCats, regIds] = await Promise.all([
                    registrationApi.getMyCats(),
                    registrationApi.getRegisteredCatIdsForShow(showId)
                ]);
                setCats(myCats);
                setRegisteredIds(regIds);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showId]);

    if (loading) return <div className="p-4 text-center">Načítám vaše kočky...</div>;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Vybrat z mých koček</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={onCancel}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#027BFF] hover:bg-blue-50 transition gap-3 min-h-[160px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-[#027BFF] flex items-center justify-center text-xl font-bold">+</div>
                        <span className="font-semibold text-[#027BFF]">Nová kočka (vypsat ručně)</span>
                    </button>

                    {cats.map(cat => {
                        const isRegistered = registeredIds.includes(cat.id);
                        return (
                            <div
                                key={cat.id}
                                onClick={() => !isRegistered && onSelect(cat)}
                                className={`relative p-4 rounded-xl border text-left transition-all
                                    ${isRegistered
                                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                                    : 'bg-white border-gray-200 hover:border-[#027BFF] hover:shadow-md cursor-pointer group'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 group-hover:text-[#027BFF]">{cat.catName}</h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{cat.gender}</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>EMS: <strong>{cat.emsCode}</strong></p>
                                    <p className="text-xs text-gray-400">Čip: {cat.chipNumber}</p>
                                </div>

                                {isRegistered && (
                                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            Již registrována
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};