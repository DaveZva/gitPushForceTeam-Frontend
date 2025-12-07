import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { secretariatApi, SecretariatShow } from '../../services/api/secretariatApi';
import { useTranslation } from 'react-i18next';

// Ujistěte se, že tyto komponenty existují ve vašem projektu
import { RegistrationsTab } from '../../components/RegistrationsTab'; // Cestu upravte dle vaší struktury
import { JudgesSteawardsTab } from '../../components/JudgesStewardsTab'; // Cestu upravte dle vaší struktury

export default function ShowControlCenter() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const [show, setShow] = useState<SecretariatShow | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Načtení detailu výstavy
    const loadShowDetail = async () => {
        if (!id) return;
        try {
            const data = await secretariatApi.getShowById(id);
            setShow(data);
        } catch (error) {
            console.error("Failed to load show detail", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShowDetail();
    }, [id]);

    // Handler pro generování katalogu
    const handleGenerateCatalog = async () => {
        if (!id || !show) return;
        if (!window.confirm(t('secretariat.confirmGenerate', 'Opravdu chcete uzavřít výstavu a vygenerovat katalog? Tato akce je nevratná.'))) {
            return;
        }

        setGenerating(true);
        setMessage(null);

        try {
            const result = await secretariatApi.generateCatalog(id);
            setMessage({ type: 'success', text: `${result.message} (Počet očíslovaných koček: ${result.totalCats})` });
            await loadShowDetail();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: t('secretariat.generateError', 'Chyba při generování katalogu.') });
        } finally {
            setGenerating(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Přehled' },
        { id: 'registrations', label: 'Přihlášky & Kočky' },
        { id: 'judges', label: 'Rozhodčí & Stevardi' },
        { id: 'payments', label: 'Platby' },
        { id: 'catalog', label: 'Katalog & Exporty' },
    ];

    if (loading) return <div className="p-8 text-center">Načítám data výstavy...</div>;
    if (!show) return <div className="p-8 text-center text-red-600">Výstava nenalezena</div>;

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Header Výstavy */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{show.name}</h1>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            show.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                show.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-600'
                        }`}>
                            {show.status}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        ID: {show.id} • {show.venueCity} • {new Date(show.startDate).toLocaleDateString()} - {new Date(show.endDate).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/secretariat/shows/${id}/edit`} // Pokud máte edit stránku
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                        Upravit nastavení
                    </Link>

                    {show.status !== 'CLOSED' ? (
                        <button
                            onClick={handleGenerateCatalog}
                            disabled={generating}
                            className={`px-4 py-2 text-white rounded-lg font-medium shadow-lg transition
                                ${generating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#027BFF] hover:bg-blue-600 shadow-blue-200'}`}
                        >
                            {generating ? 'Zpracovávám...' : 'Uzavřít a Generovat ID'}
                        </button>
                    ) : (
                        <Link
                            to={`/catalog/${show.id}`}
                            target="_blank"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-lg shadow-purple-200 transition"
                        >
                            Zobrazit veřejný katalog
                        </Link>
                    )}
                </div>
            </div>

            {/* Taby */}
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                                ${activeTab === tab.id
                                ? 'border-[#027BFF] text-[#027BFF]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Obsah Tabů */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Celkem koček</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{show.totalCats || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Potvrzené registrace</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">{show.confirmedRegistrations || 0}</p>
                        </div>
                        {/* Další statistiky */}
                    </div>
                )}

                {activeTab === 'registrations' && (
                    <RegistrationsTab showId={id} />
                )}

                {activeTab === 'judges' && (
                    <JudgesSteawardsTab showId={id} />
                )}

                {/* Placeholder pro ostatní taby */}
                {(activeTab === 'payments' || activeTab === 'catalog') && (
                    <div className="p-10 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        Obsah pro sekci <strong>{activeTab}</strong> se připravuje.
                    </div>
                )}
            </div>
        </div>
    );
}