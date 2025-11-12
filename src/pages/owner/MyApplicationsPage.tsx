import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface MyApplication {
    id: number;
    registrationNumber: string;
    exhibitionName: string;
    submittedAt: string;
    status: string;
    catCount: number;
}

export default function MyApplicationsPage() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [applications, setApplications] = useState<MyApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('cs-CZ', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit' // Přidáno pro čas odeslání
        });
    };

    const getStatusClass = (status: string): string => {
        const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
        const statuses: Record<string, string> = {
            PLANNED: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            CANCELLED: 'bg-gray-100 text-gray-800',
        };
        return `${baseClass} ${statuses[status] || ''}`;
    };

    useEffect(() => {
        const fetchApplications = async () => {
            if (!isAuthenticated) {
                setError(t('errors.notAuthenticated'));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await api.get<MyApplication[]>('/my-registrations');

                // Axios dává data do 'response.data'
                setApplications(response.data);

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
        fetchApplications();
    }, [t, isAuthenticated]);

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                        {t('common.loading', 'Načítám...')}
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

        if (applications.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                        {t('myApplications.noApplications', 'Zatím nemáte žádné přihlášky.')}
                    </td>
                </tr>
            );
        }

        return applications.map((app: MyApplication) => (
            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-3 font-semibold text-gray-800">{app.registrationNumber}</td>
                <td className="py-4 px-3 text-gray-600">{app.exhibitionName}</td>
                <td className="py-4 px-3 text-gray-600">{formatDate(app.submittedAt)}</td>
                <td className="py-4 px-3 text-gray-600 text-center">{app.catCount}</td>
                <td className="py-4 px-3">
                    <span className={getStatusClass(app.status)}>
                        {t(`regStatuses.${app.status}`, app.status)}
                    </span>
                </td>
            </tr>
        ));
    };

    return (
        <div className="container max-w-7xl mx-auto p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t('nav.myApplications', 'Moje přihlášky')}
                </h1>
            </header>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead className="border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.regNumber', 'Číslo registrace')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.exhibition', 'Výstava')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.submittedAt', 'Odesláno')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600 text-center">{t('myApplications.col.cats', 'Počet koček')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.status', 'Status')}</th>
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