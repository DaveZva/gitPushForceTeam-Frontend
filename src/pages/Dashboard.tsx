import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface StatCardProps {
    value: string | number;
    labelKey: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, labelKey }) => {
    const { t } = useTranslation();
    return (
        <div className="stat-card">
            <p className="value">{value}</p>
            <p className="label">{t(labelKey)}</p>
        </div>
    );
};

export default function Dashboard() {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated } = useAuth();

    const formatDate = (dateString: string) => {
        if (dateString.includes('-')) return dateString;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString(i18n.language, {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    const historyData = [
        { id: 1, name: "MVK Olomouc", date: "2025-10-12", animals: "GIC Alf, CZ", status: 'completed' },
        { id: 2, name: "MVK Brno", date: "2025-06-01", animals: "CH Bára, CZ", status: 'completed' },
        { id: 3, name: "MVK Pardubice", date: "2025-02-15", animals: "Alf, Bára, Cecilka", status: 'completed' },
    ];

    const upcomingShows = [
        { name: "MVK Praha", date: "14. – 15. 12. 2025", location: "PVA Expo Letňany", link: "/apply/praha" },
        { name: "MVK Ostrava", date: "20. – 21. 1. 2026", location: "Černá louka", link: "/shows/ostrava" },
        { name: "MVK Brno", date: "10. – 11. 3. 2026", location: "Výstaviště Brno", link: "/shows/brno" },
        { name: "MVK Plzeň", date: "5. – 6. 4. 2026", location: "Parkhotel Plzeň", link: "/shows/plzen" }
    ];

    return (
        <>
            {/* HLAVIČKA */}
            <header className="dashboard-header">
                {isAuthenticated && user ? (
                    <h1>{t('dashboard.welcome', { name: user.firstName })}!</h1>
                ) : (
                    <h1>{t('dashboard.welcome_guest')}</h1>
                )}
                <p>{t('dashboard.subtitle')}</p>
            </header>

            {/* STATISTIKY */}
            <section className="stat-row">
                <StatCard value="2" labelKey="dashboard.stats.active" />
                <StatCard value="1" labelKey="dashboard.stats.approved" />
                <StatCard value="4" labelKey="dashboard.stats.cats" />
            </section>

            {/* NADCHÁZEJÍCÍ VÝSTAVY – NOVÝ BLOK */}
            <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-[-1px] text-left">
                    {t('dashboard.upcoming.title')}
                </h2>

                <p className="text-gray-500 mb-6 text-left">
                    {t('dashboard.upcoming.subtitle')}
                </p>

                {/* 2 BOXY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* BOX 1 */}
                    <div className="relative backdrop-blur-xl bg-white/40 border border-white/60
                        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                        rounded-2xl p-8 h-60 flex flex-col justify-between">

                        {/* IKONA (CIRCLE + GLOW) */}
                        <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-[#027BFF]/20
                            flex items-center justify-center shadow-[0_0_20px_rgba(2,123,255,0.3)]">
                            <svg className="w-7 h-7 text-[#027BFF]" fill="none" stroke="currentColor" strokeWidth="2"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0
                             00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>

                        {/* OBSAH */}
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-[-1.5px] mb-4">
                                MVK Praha
                            </h3>

                            <p className="text-sm font-medium text-gray-800 mb-1">
                                {t('table.date')}: 14 – 15. 12. 2025
                            </p>

                            <p className="text-sm text-gray-600">
                                {t('location')}: PVA Expo Letňany
                            </p>
                        </div>

                        <Link
                            to="/catalog"
                            className="w-full py-3 mt-4 rounded-xl font-semibold text-center
                           bg-[#027BFF] text-white border-2 border-[#027BFF]
                           hover:bg-transparent hover:text-[#027BFF]
                           transition-all duration-300"
                        >
                            {t('actions.showDetails')}
                        </Link>
                    </div>

                    {/* BOX 2 */}
                    <div className="relative backdrop-blur-xl bg-white/40 border border-white/60
                        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                        rounded-2xl p-8 h-60 flex flex-col justify-between">

                        {/* IKONA */}
                        <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-[#027BFF]/20
                            flex items-center justify-center shadow-[0_0_20px_rgba(2,123,255,0.3)]">
                            <svg className="w-7 h-7 text-[#027BFF]" fill="none" stroke="currentColor" strokeWidth="2"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0
                             00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-[-1.5px] mb-4">
                                MVK Ostrava
                            </h3>

                            <p className="text-sm font-medium text-gray-800 mb-1">
                                {t('table.date')}: 20 – 21. 1. 2026
                            </p>

                            <p className="text-sm text-gray-600">
                                {t('location')}: Černá louka
                            </p>
                        </div>

                        <Link
                            to="/catalog"
                            className="w-full py-3 mt-4 rounded-xl font-semibold text-center
                           bg-[#027BFF] text-white border-2 border-[#027BFF]
                           hover:bg-transparent hover:text-[#027BFF]
                           transition-all duration-300"
                        >
                            {t('actions.showDetails')}
                        </Link>
                    </div>

                </div>
            </section>

            {/* HISTORIE PŘIHLÁŠEK */}
            <section className="bg-white rounded-2xl shadow-xl p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-[-1px]">
                    {t('dashboard.history.title')}
                </h2>
                <p className="text-gray-600 mb-6">{t('dashboard.history.subtitle')}</p>

                {/* DESKTOP TABLE */}
                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="text-sm text-gray-700 border-b">
                            <th className="p-3 text-left font-semibold">{t('table.show')}</th>
                            <th className="p-3 text-center font-semibold">{t('table.date')}</th>
                            <th className="p-3 text-center font-semibold">{t('table.animals')}</th>
                            <th className="p-3 text-center font-semibold">{t('table.status')}</th>
                            <th className="p-3 text-center font-semibold">{t('table.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {historyData.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="p-4 text-left">{item.name}</td>
                                <td className="p-4 text-center">{formatDate(item.date)}</td>
                                <td className="p-4 text-center">{item.animals}</td>
                                <td className="p-4 text-center">
                    <span className="text-gray-700 font-medium">
                        {t(`status.${item.status}`)}
                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-4">
                                        <Link
                                            to={`/history/${item.id}`}
                                            className="text-[#027BFF] font-medium"
                                        >
                                            {t('actions.detail')}
                                        </Link>
                                        <a
                                            href="#"
                                            className="text-[#027BFF] font-medium"
                                        >
                                            {t('common.pdf')}
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden flex flex-col gap-4">
                    {historyData.map((item) => (
                        <div key={item.id} className="border rounded-xl p-4 shadow-sm">
                            <p className="font-bold text-gray-900 text-lg mb-1">{item.name}</p>
                            <p className="text-sm text-gray-600">{t('table.date')}: {formatDate(item.date)}</p>
                            <p className="text-sm text-gray-600">{t('table.animals')}: {item.animals}</p>
                            <p className="text-sm text-gray-600 mb-2">
                                {t('table.status')}: <span className="font-semibold">{t(`status.${item.status}`)}</span>
                            </p>

                            <div className="flex gap-4 pt-2 border-t mt-2">
                                <Link to={`/history/${item.id}`} className="text-[#027BFF] font-semibold">
                                    {t('actions.detail')}
                                </Link>
                                <a href="#" className="text-[#027BFF] font-semibold">
                                    {t('common.pdf')}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="mt-6">
                    <Link to="/history" className="text-[#027BFF] font-semibold">
                        {t('actions.showAllHistory')}
                    </Link>
                </footer>
            </section>
        </>
    );
}