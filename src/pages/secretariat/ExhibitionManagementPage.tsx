import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { secretariatApi, Show } from '../../services/api/secretariatApi';
import { useAuth } from '../../context/AuthContext';

export default function ExhibitionManagementPage() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    const [shows, setShows] = useState<Show[]>([]); // Používáme typ Show
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('cs-CZ', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        });
    };

    const getStatusClass = (status: Show['status']): string => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";

        const statuses: Record<string, string> = {
            PLANNED: 'bg-yellow-100 text-yellow-800',
            OPEN: 'bg-green-100 text-green-800',
            CLOSED: 'bg-orange-100 text-orange-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
            CANCELLED: 'bg-gray-100 text-gray-800',
        };
        return `${baseClass} ${statuses[status] || ''}`;
    };


    useEffect(() => {
        const fetchShows = async () => {
            if (!isAuthenticated) {
                setError(t('errors.notAuthenticated'));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data = await secretariatApi.getSecretariatShows();

                const sortedData = data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                setShows(sortedData);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(t(err.message) || t('errors.fetchFailed'));
                } else {
                    setError(t('errors.fetchFailed'));
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShows();
    }, [t, isAuthenticated]);

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                        {t('common.loading')}
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-red-600">
                        {error}
                    </td>
                </tr>
            );
        }

        if (shows.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                        {t('admin.shows.noShows')}
                    </td>
                </tr>
            );
        }

        return shows.map((show: Show) => (
            <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-3 font-semibold text-gray-800">{show.name}</td>
                <td className="py-4 px-3 text-gray-600">{show.venueName}</td>
                <td className="py-4 px-3 text-gray-600">
                    {formatDate(show.startDate)} - {formatDate(show.endDate)}
                </td>
                <td className="py-4 px-3">
                    <span className={getStatusClass(show.status)}>
                        {t(`statuses.${show.status}`, show.status)}
                    </span>
                </td>
                <td className="py-4 px-3">
                    <Link
                        to={`/secretariat/exhibition/edit/${show.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                    >
                        {t('common.edit')}
                    </Link>
                </td>
            </tr>
        ));
    };

    return (
        <div className="container max-w-7xl mx-auto p-4 sm:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t('admin.shows.title')}
                </h1>
                <Link
                    to="/secretariat/exhibition/new"
                    className="px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                >
                    {t('admin.shows.add')}
                </Link>
            </header>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead className="border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('admin.shows.col.name')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('admin.shows.col.venue')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('admin.shows.col.date')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('admin.shows.col.status')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('admin.shows.col.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderTableBody()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}