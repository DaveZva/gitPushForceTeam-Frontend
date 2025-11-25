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

// Definice typu pro mock data (pouze pro tento dashboard)
interface HistoryItem {
    id: number;
    name: string;
    date: string;
    animals: string;
    status: 'completed';
}

interface UpcomingItem {
    name: string;
    date: string; // Pro jednoduchost string, v reálu Date ISO string
    location: string;
    link: string;
    actionKey: string;
}

function Dashboard() {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated } = useAuth();

    // Pomocná funkce pro formátování data
    const formatDate = (dateString: string) => {
        // Pokud je to rozsah (např. "14. - 15. 12."), necháme to tak,
        // nebo bychom museli mít logiku pro parsování.
        // Pro demo účely v tabulce historie (kde je jedno datum) použijeme formátovač:
        if (dateString.includes('-')) return dateString;

        const date = new Date(dateString);
        // Pokud je datum neplatné (protože v mock datech máme třeba tečky), vrátíme původní string
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString(i18n.language, {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    // Mock data pro historii (v reálné aplikaci by přišla z API)
    // Data držíme v ISO formátu (RRRR-MM-DD) pro správné formátování
    const historyData: HistoryItem[] = [
        { id: 1, name: "MVK Olomouc", date: "2025-10-12", animals: "GIC Alf, CZ", status: 'completed' },
        { id: 2, name: "MVK Brno", date: "2025-06-01", animals: "CH Bára, CZ", status: 'completed' },
        { id: 3, name: "MVK Pardubice", date: "2025-02-15", animals: "Alf, Bára, Cecilka", status: 'completed' },
    ];

    return (
        <>
            <header className="dashboard-header">
                {isAuthenticated && user ? (
                    <h1>{t('dashboard.welcome', { name: user.firstName })}!</h1>
                ) : (
                    <h1>{t('dashboard.welcome_guest')}</h1>
                )}
                <p>{t('dashboard.subtitle')}</p>
            </header>

            <section className="stat-row">
                <StatCard value="2" labelKey="dashboard.stats.active" />
                <StatCard value="1" labelKey="dashboard.stats.approved" />
                <StatCard value="4" labelKey="dashboard.stats.cats" />
            </section>

            <section className="dashboard-grid">

                <article className="history-panel">
                    <div className="panel-header">
                        <h2>{t('dashboard.history.title')}</h2>
                        <p>{t('dashboard.history.subtitle')}</p>
                    </div>
                    <table className="history-table">
                        <thead>
                        <tr>
                            <th>{t('table.show')}</th>
                            <th>{t('table.date')}</th>
                            <th>{t('table.animals')}</th>
                            <th>{t('table.status')}</th>
                            <th>{t('table.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {historyData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{formatDate(item.date)}</td>
                                <td>{item.animals}</td>
                                <td>
                                    <span className="status">
                                        {t(`status.${item.status}`)}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/history/${item.id}`}>{t('actions.detail')}</Link>
                                    {' '}
                                    <a href="#">{t('common.pdf')}</a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <footer className="panel-footer">
                        <Link to="/history">{t('actions.showAllHistory')}</Link>
                    </footer>
                </article>

                <aside className="upcoming-panel">
                    <div className="panel-header" style={{ background: 'none', border: 'none', padding: '0 0 1rem 0' }}>
                        <h2>{t('dashboard.upcoming.title')}</h2>
                        <p>{t('dashboard.upcoming.subtitle')}</p>
                    </div>

                    <div className="upcoming-card">
                        <h3>MVK Praha</h3>
                        <div className="info">
                            <strong>{t('table.date')}:</strong> 14. - 15. 12. 2025<br />
                            <strong>{t('location')}:</strong> PVA Expo Letňany
                        </div>
                        <Link to="/apply/praha" className="btn-primary">{t('actions.applyToShow')}</Link>
                    </div>

                    <div className="upcoming-card">
                        <h3>MVK Ostrava</h3>
                        <div className="info">
                            <strong>{t('table.date')}:</strong> 20. - 21. 1. 2026<br />
                            <strong>{t('location')}:</strong> Černá louka
                        </div>
                        <Link to="/shows/ostrava" className="btn-primary">{t('actions.showDetails')}</Link>
                    </div>

                    <footer className="panel-footer" style={{ textAlign: 'left', paddingLeft: '0.5rem' }}>
                        <Link to="/shows">{t('actions.showAllShows')}</Link>
                    </footer>
                </aside>

            </section>
        </>
    );
}

export default Dashboard;