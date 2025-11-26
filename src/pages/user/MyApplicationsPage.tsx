import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PdfBadgeIcon from '../../components/ui/PDFIcon';

interface MyApplication {
    id: number;
    registrationNumber: string;
    exhibitionName: string;
    submittedAt: string;
    status: string;
    catCount: number;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default function MyApplicationsPage() {
    // 1. Získání i18n pro dynamické datum
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<MyApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '-';
        // 2. Použití i18n.language
        return new Date(dateString).toLocaleDateString(i18n.language, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
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

    const handleDownloadPdf = async (registrationNumber: string) => {
        setDownloadingId(registrationNumber);
        try {
            const response = await api.get(
                `/my-registrations/pdf/${registrationNumber}`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = `registrace-${registrationNumber}.pdf`;
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Chyba při stahování PDF:", error);
            alert(t('alert.pdfDownloadError'));
        } finally {
            setDownloadingId(null);
        }
    };

    const handlePay = (registrationId: number) => {
        navigate(`/payment/${registrationId}`);
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
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                        {t('common.loading')}
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={6} className="py-8 text-center text-red-600">
                        {error}
                    </td>
                </tr>
            );
        }

        if (applications.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                        {t('myApplications.noApplications')}
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
                        {t(`regStatuses.${app.status}`)}
                    </span>
                </td>
                <td className="py-4 px-3 text-center flex items-center justify-center gap-2">
                    <button
                        onClick={() => handleDownloadPdf(app.registrationNumber)}
                        disabled={downloadingId === app.registrationNumber}
                        className="p-2 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait"
                        title={t('myApplications.downloadPdf')}
                    >
                        {downloadingId === app.registrationNumber ? (
                            <LoadingSpinner />
                        ) : (
                            <PdfBadgeIcon className="h-5 w-5" />
                        )}
                    </button>

                    {app.status === 'PLANNED' && (
                        <button
                            onClick={() => handlePay(app.id)}
                            className="px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 bg-green-600 text-white border-2 border-transparent hover:bg-transparent hover:border-green-600 hover:text-green-600 shadow-lg"
                            title={t('actions.pay')}
                        >
                            {t('actions.pay')}
                        </button>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <div className="container max-w-7xl mx-auto p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-[-2px]">
                    {t('nav.myApplications')}
                </h1>
            </header>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead className="border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.regNumber')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.exhibition')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.submittedAt')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600 text-center">{t('myApplications.col.cats')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600">{t('myApplications.col.status')}</th>
                        <th className="py-3 px-3 text-sm font-semibold text-gray-600 text-center">{t('myApplications.col.actions')}</th>
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