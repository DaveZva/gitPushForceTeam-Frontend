import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {secretariatApi, SecretariatShow, SecretariatStats} from "../../services/api/secretariatApi";

const StatCard = ({ title, value, trend, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {trend && <span className={`text-xs font-medium ${color}`}>{trend}</span>}
        </div>
    </div>
);

export default function SecretariatDashboard() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<SecretariatStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [shows, setShows] = useState<SecretariatShow[]>([]);

    useEffect(() => {
        console.log("Dashboard: Začínám načítat data...");

        const load = async () => {
            try {
                const showsData = await secretariatApi.getSecretariatShows();

                console.log("Dashboard: Výstavy načteny:", showsData);
                setShows(showsData);

                const statsData = await secretariatApi.getGlobalStats();
                console.log("Dashboard: Statistiky načteny:", statsData);
            } catch (err) {
                console.error("Dashboard CHYBA:", err);
            } finally {
                setLoading(false);
                console.log("Dashboard: Načítání ukončeno.");
            }
        };

        load();
    }, []);

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

    return (
        <div className="space-y-8 text-left">
            <header>
                <h2 className="text-2xl font-bold text-gray-900">{t('secretariat.dashboard.title')}</h2>
                <p className="text-gray-500">{t('secretariat.dashboard.welcome')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title={t('secretariat.stats.totalCats') || "Celkem koček"}
                    value={stats?.totalCats || 0}
                    color="text-blue-600"
                />
                <StatCard
                    title={t('secretariat.stats.confirmedCats') || "Zaplacené"}
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
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-gray-900 mb-4">Poslední registrace</h3>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Zde bude seznam posledních 5 registrací...
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-gray-900 mb-4">Stav naplnění výstav</h3>
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Zde budou grafy naplněnosti...
                    </div>
                </div>
            </div>
        </div>
    );
}