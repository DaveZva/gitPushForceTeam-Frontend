import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Malá pomocná komponenta pro statistiky
const StatCard = ({ value, labelKey }) => {
    const { t } = useTranslation();
    return (
        <div className="stat-card">
            <p className="value">{value}</p>
            <p className="label">{t(labelKey)}</p>
        </div>
    );
};

function Dashboard() {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();

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

                {/* Panel s historií */}
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
                        <tr>
                            <td>MVK Olomouc</td>
                            <td>12. 10. 2025</td>
                            <td>GIC Alf, CZ</td>
                            <td><span className="status">{t('status.completed')}</span></td>
                            <td><Link to="/history/1">{t('actions.detail')}</Link> <a href="#">PDF</a></td>
                        </tr>
                        <tr>
                            <td>MVK Brno</td>
                            <td>1. 6. 2025</td>
                            <td>CH Bára, CZ</td>
                            <td><span className="status">{t('status.completed')}</span></td>
                            <td><Link to="/history/2">{t('actions.detail')}</Link> <a href="#">PDF</a></td>
                        </tr>
                        <tr>
                            <td>MVK Pardubice</td>
                            <td>15. 2. 2025</td>
                            <td>Alf, Bára, Cecilka</td>
                            <td><span className="status">{t('status.completed')}</span></td>
                            <td><Link to="/history/3">{t('actions.detail')}</Link> <a href="#">PDF</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <footer className="panel-footer">
                        <Link to="/history">{t('actions.showAllHistory')}</Link>
                    </footer>
                </article>

                {/* Panel s nadcházejícími výstavami */}
                <aside className="upcoming-panel">
                    <div className="panel-header" style={{ background: 'none', border: 'none', padding: '0 0 1rem 0' }}>
                        <h2>{t('Nadcházející výstavy')}</h2>
                        <p>{t('Nové výstavy, na které se můžete přihlásit.')}</p>
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