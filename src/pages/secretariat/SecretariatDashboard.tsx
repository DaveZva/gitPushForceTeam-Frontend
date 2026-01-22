import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secretariatApi, SecretariatShow, SecretariatStats } from "../../services/api/secretariatApi";

const StatCard = ({ title, value, trend, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {trend && <span className={`text-xs font-medium ${color}`}>{trend}</span>}
        </div>
    </div>
);

const CapacityBar = ({ show }: { show: SecretariatShow }) => {
    const current = show.totalRegistrations || 0;
    const max = show.maxCats || 1;
    const percentage = Math.min(100, Math.round((current / max) * 100));

    let colorClass = 'bg-blue-500';
    if (percentage > 80) colorClass = 'bg-orange-500';
    if (percentage >= 100) colorClass = 'bg-red-500';

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{show.name}</span>
                <span className="text-xs text-gray-500">{current} / {max} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default function SecretariatDashboard() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<SecretariatStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [shows, setShows] = useState<SecretariatShow[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const showsData = await secretariatApi.getSecretariatShows();
                setShows(showsData);

                const statsData = await secretariatApi.getGlobalStats();
                setStats(statsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;

    return (
        <div className="space-y-8 text-left">
            <header>
                <h2 className="text-2xl font-bold text-gray-900">{t('secretariat.dashboard.title')}</h2>
                <p className="text-gray-500">{t('secretariat.dashboard.welcome')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title={t('secretariat.stats.totalCats')}
                    value={stats?.totalCats || 0}
                    color="text-blue-600"
                />
                <StatCard
                    title={t('secretariat.stats.confirmedCats')}
                    value={stats?.confirmedCats || 0}
                    color="text-green-600"
                />
                <StatCard
                    title={t('secretariat.stats.users')}
                    value={stats?.totalUsers?.toLocaleString() || 0}
                    color="text-blue-600"
                />
                <StatCard
                    title={t('secretariat.stats.revenue')}
                    value={`${stats?.totalRevenue?.toLocaleString() || 0} Kč`}
                    color="text-gray-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-6">{t('secretariat.dashboard.capacityTitle', 'Stav naplnění výstav')}</h3>

                    {shows.length > 0 ? (
                        <div className="overflow-y-auto pr-2 max-h-[300px] scrollbar-thin scrollbar-thumb-gray-200">
                            {shows.map(show => (
                                <CapacityBar key={show.id} show={show} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            {t('admin.shows.noShows')}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-gray-900 mb-6">{t('secretariat.dashboard.recentRegistrations', 'Poslední registrace')}</h3>
                    <div className="flex items-center justify-center h-full text-gray-400 pb-10">
                        {t('common.preparingContent')}
                    </div>
                </div>
            </div>
        </div>
    );
}