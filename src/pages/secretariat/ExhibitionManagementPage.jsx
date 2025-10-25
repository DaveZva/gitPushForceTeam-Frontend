import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './ExhibitionManagementPage.module.css';
import { getAllAdminShows } from '../../services/api'; // <-- KROK 1: Import API


const formatDate = (dateString) => { /* ... */ };
const getStatusClass = (status) => { /* ... */ };


export default function ExhibitionManagementPage() {
    const { t } = useTranslation();
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // KROK 2: Úprava useEffect pro volání API
    useEffect(() => {
        const fetchShows = async () => {
            try {
                setLoading(true);
                setError(null);

                // Voláme funkci z api.js
                const data = await getAllAdminShows();

                // Třídění už dělá backend, takže data jen uložíme
                setShows(data);

            } catch (err) {
                // Zachytíme chyby (např. 401 Unauthorized, pokud admin není přihlášen)
                setError(err.message || t('errors.fetchFailed', 'Nepodařilo se načíst data.'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [t]);


    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="5">{t('common.loading', 'Načítání dat...')}</td>
                </tr>
            );
        }

        // Případ 2: Chyba
        if (error) {
            return (
                <tr>
                    {/* Používáme třídu z tvého App.css, kterou už máš */}
                    <td colSpan="5" className="error">{error}</td>
                </tr>
            );
        }

        if (shows.length === 0) {
            return (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        {t('admin.shows.noShows', 'Zatím nebyly naplánovány ani neproběhly žádné výstavy.')}
                    </td>
                </tr>
            );
        }

        return shows.map(show => (
            <tr key={show.id}>
                <td><strong>{show.name}</strong></td>
                <td>{show.venueName}</td>
                <td>{formatDate(show.startDate)} - {formatDate(show.endDate)}</td>
                <td>
          <span className={getStatusClass(show.status)}>
            {/* Přidáme překlad pro statusy */}
              {t(`statuses.${show.status}`, show.status)}
          </span>
                </td>
                <td>
                    <Link to={`/admin/shows/edit/${show.id}`} className={styles.editLink}>
                        {t('common.edit', 'Upravit')}
                    </Link>
                </td>
            </tr>
        ));
    };

    return (
        <div className={styles.adminPageContainer}>
            {/* Hlavička stránky (zůstává stejná) */}
            <header className={styles.pageHeader}>
                <h1 className="dashboard-header">{t('admin.shows.title', 'Správa výstav')}</h1>
                <Link to="/admin/shows/new" className="btn-primary">
                    {t('admin.shows.add', 'Přidat výstavu')}
                </Link>
            </header>

            {/* Panel se seznamem (zůstává stejný) */}
            <div className="history-panel">
                <table className="history-table">
                    <thead>
                    <tr>
                        <th>{t('admin.shows.col.name', 'Název výstavy')}</th>
                        <th>{t('admin.shows.col.venue', 'Místo konání')}</th>
                        <th>{t('admin.shows.col.date', 'Datum konání')}</th>
                        <th>{t('admin.shows.col.status', 'Status')}</th>
                        <th>{t('admin.shows.col.actions', 'Akce')}</th>
                    </tr>
                    </thead>

                    {/* Tělo tabulky teď renderuje naše nová funkce */}
                    <tbody>
                    {renderTableBody()}
                    </tbody>

                </table>
            </div>
        </div>
    );
}