import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { secretariatApi, SecretariatShow } from '../../services/api/secretariatApi';
import { RegistrationsTab } from '../../components/RegistrationsTab';
import { JudgesSteawardsTab } from '../../components/JudgesStewardsTab';
import { Button } from '../../components/ui/Button';

const DonutChart = ({ confirmed, total, max }: { confirmed: number, total: number, max: number }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const percentFilled = Math.min((total / max) * 100, 100);
    const percentConfirmed = Math.min((confirmed / max) * 100, 100);
    const strokeFilled = ((percentFilled - percentConfirmed) / 100) * circumference;
    const strokeConfirmed = (percentConfirmed / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r={radius} stroke="#F3F4F6" strokeWidth="8" fill="transparent" />
                <circle
                    cx="50%" cy="50%" r={radius}
                    stroke="#BFDBFE"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - strokeFilled - strokeConfirmed}
                    className="transition-all duration-1000 ease-out"
                />
                <circle
                    cx="50%" cy="50%" r={radius}
                    stroke="#22C55E"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - strokeConfirmed}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-gray-900">{total}</span>
                <span className="text-xs text-gray-500">/ {max}</span>
            </div>
        </div>
    );
};

export default function ShowControlCenter() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const [show, setShow] = useState<SecretariatShow | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    const handleGenerateCatalog = async () => {
        if (!id || !show) return;
        if (!window.confirm(t('secretariat.confirmGenerate'))) return;

        setGenerating(true);
        setMessage(null);

        try {
            const result = await secretariatApi.generateCatalog(id);
            setMessage({ type: 'success', text: `${t('secretariat.generateSuccess')} (${result.totalCats})` });
            await loadShowDetail();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: t('secretariat.generateError') });
        } finally {
            setGenerating(false);
        }
    };

    const getDaysRemaining = (dateString: string) => {
        const diff = new Date(dateString).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    const tabs = [
        { id: 'overview', label: t('secretariat.tabs.overview') },
        { id: 'registrations', label: t('secretariat.tabs.registrations') },
        { id: 'judges', label: t('secretariat.tabs.judges') },
        { id: 'payments', label: t('secretariat.tabs.payments') },
        { id: 'catalog', label: t('secretariat.tabs.catalog') },
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;
    if (!show) return <div className="p-8 text-center text-red-600">{t('secretariat.showNotFound')}</div>;

    const daysToDeadline = getDaysRemaining(show.registrationDeadline);
    const daysToShow = getDaysRemaining(show.startDate);
    const daysToEndShow = getDaysRemaining(show.endDate);

    return (
        <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
                <div className="w-full lg:w-auto">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight break-words">{show.name}</h1>
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide whitespace-nowrap ${
                            show.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                show.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-600'
                        }`}>
                            {t(`statuses.${show.status}`)}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span>{t('common.id')}: {show.id}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{show.venueCity}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(show.startDate).toLocaleDateString()} - {new Date(show.endDate).toLocaleDateString()}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                    <div className="w-full sm:w-auto">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/secretariat/shows/${id}/edit`)}
                            className="w-full justify-center"
                        >
                            {t('common.settings')}
                        </Button>
                    </div>

                    <div className="w-full sm:w-auto">
                        {show.status !== 'CLOSED' ? (
                            <Button
                                variant="primary"
                                onClick={handleGenerateCatalog}
                                disabled={generating}
                                className={`w-full justify-center ${generating ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:border-transparent hover:text-white' : ''}`}
                            >
                                {generating ? t('common.processing') : t('secretariat.closeAndGenerate')}
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={() => window.open(`/catalog/${show.id}`, '_blank')}
                                className="w-full justify-center bg-purple-600 border-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600"
                            >
                                {t('secretariat.viewPublicCatalog')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto pb-2 scrollbar-hide">
                <nav className="flex space-x-2 min-w-max" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm transition-all duration-300
                                    ${isActive
                                    ? 'bg-[#027BFF] text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'}
                                `}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="min-h-[400px] animate-fade-in">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2">
                            <h3 className="text-gray-900 font-bold text-lg mb-4 md:mb-6">{t('secretariat.dashboard.capacityTitle')}</h3>

                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                                <div className="flex-shrink-0">
                                    <DonutChart
                                        confirmed={show.confirmedRegistrations || 0}
                                        total={show.totalCats || 0}
                                        max={show.maxCats}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                            <span className="text-xs md:text-sm text-gray-500">{t('secretariat.stats.totalCats')}</span>
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold text-gray-900">{show.totalCats || 0}</p>
                                        <p className="text-xs text-gray-400">{((show.totalCats || 0) / show.maxCats * 100).toFixed(1)}% {t('secretariat.stats.capacity', 'kapacity')}</p>
                                    </div>

                                    <div className="bg-green-50 p-3 md:p-4 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            <span className="text-xs md:text-sm text-green-700 font-medium">{t('secretariat.stats.confirmedRegs')}</span>
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold text-green-700">{show.confirmedRegistrations || 0}</p>
                                        <p className="text-xs text-green-600">{t('common.paid')}</p>
                                    </div>

                                    <div className="bg-orange-50 p-3 md:p-4 rounded-xl border border-orange-100 sm:col-span-2 md:col-span-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                                            <span className="text-xs md:text-sm text-orange-700 font-medium">{t('secretariat.stats.pending')}</span>
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold text-orange-700">{(show.totalCats || 0) - (show.confirmedRegistrations || 0)}</p>
                                        <p className="text-xs text-orange-600">{t('common.waitingForPayment')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                            <h3 className="text-gray-900 font-bold text-lg mb-4 md:mb-6">{t('secretariat.dashboard.timelineTitle')}</h3>
                            <div className="space-y-4 md:space-y-6 flex-1">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-600">{t('secretariat.registrationDeadline')}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${daysToDeadline < 7 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {daysToDeadline > 0 ? `${daysToDeadline} ${t('common.days')}` : t('common.closed')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900">{new Date(show.registrationDeadline).toLocaleDateString()}</p>
                                </div>

                                <div className="w-full h-px bg-gray-100"></div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-600">{t('secretariat.showStart')}</span>
                                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                            {daysToShow > 0 ? `${t('common.in', 'za')} ${daysToShow} ${t('common.days')}` : t('common.now')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900">{new Date(show.startDate).toLocaleDateString()}</p>
                                </div>

                                <div className="w-full h-px bg-gray-100"></div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-600">{t('secretariat.showEnd')}</span>
                                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                            {daysToEndShow > 0 ? `${t('common.in', 'za')} ${daysToEndShow} ${t('common.days')}` : t('common.now')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900">{new Date(show.endDate).toLocaleDateString()}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full overflow-hidden">
                    {activeTab === 'registrations' && (
                        <div className="overflow-x-auto">
                            <RegistrationsTab showId={id!} />
                        </div>
                    )}

                    {activeTab === 'judges' && (
                        <div className="overflow-x-auto">
                            <JudgesSteawardsTab showId={id} />
                        </div>
                    )}
                </div>

                {(activeTab === 'payments' || activeTab === 'catalog') && (
                    <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                        <p className="text-gray-500 font-medium">{t('common.preparingContent')}</p>
                        <span className="text-sm text-gray-400 mt-1">{activeTab}</span>
                    </div>
                )}
            </div>
        </div>
    );
}