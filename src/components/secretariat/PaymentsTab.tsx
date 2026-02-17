import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secretariatApi, SecretariatPayment } from '../../services/api/secretariatApi';
import { Button } from '../ui/Button';

interface PaymentsTabProps {
    showId: string | number;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ showId }) => {
    const { t } = useTranslation();
    const [payments, setPayments] = useState<SecretariatPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');

    const loadPayments = async () => {
        try {
            setLoading(true);
            const data = await secretariatApi.getPaymentsByShow(showId);
            setPayments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, [showId]);

    const handleConfirmPayment = async (regId: number) => {
        if (!window.confirm(t('secretariat.confirmGenerate'))) return;
        try {
            await secretariatApi.confirmPayment(regId);
            await loadPayments();
        } catch (error) {
            console.error(error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0
        }).format(amount / 100);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('cs-CZ', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredPayments = payments.filter(p => {
        if (filter === 'PAID') return p.status === 'CONFIRMED';
        if (filter === 'UNPAID') return p.status !== 'CONFIRMED';
        return true;
    });

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

    return (
        <div className="space-y-4">
            <div className="flex gap-2 mb-4">
                <Button
                    variant={filter === 'ALL' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('ALL')}
                >
                    {t('secretariat.payments.filterAll')}
                </Button>
                <Button
                    variant={filter === 'UNPAID' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('UNPAID')}
                >
                    {t('secretariat.payments.filterUnpaid')}
                </Button>
                <Button
                    variant={filter === 'PAID' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('PAID')}
                >
                    {t('secretariat.payments.filterPaid')}
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.payments.col.regNumber')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.payments.col.owner')}</th>
                            <th className="p-4 font-medium text-gray-500 text-center">{t('secretariat.payments.col.cats')}</th>
                            <th className="p-4 font-medium text-gray-500 text-right">{t('secretariat.payments.col.amount')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.payments.col.status')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.payments.col.method')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.payments.col.date')}</th>
                            <th className="p-4 font-medium text-gray-500 text-right">{t('secretariat.payments.col.actions')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">
                                    {t('admin.shows.noShows')}
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((payment) => (
                                <tr key={payment.registrationId} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">
                                        #{payment.registrationNumber}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{payment.ownerName}</div>
                                        <div className="text-xs text-gray-500">{payment.ownerEmail}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                                                {payment.catCount}
                                            </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-medium">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="p-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                payment.status === 'CONFIRMED'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {t(`regStatuses.${payment.status}`)}
                                            </span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {payment.paymentMethod === 'STRIPE'
                                            ? t('secretariat.payments.methodStripe')
                                            : payment.paymentMethod === 'MANUAL'
                                                ? t('secretariat.payments.methodManual')
                                                : '-'}
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs">
                                        {formatDate(payment.paidAt)}
                                    </td>
                                    <td className="p-4 text-right">
                                        {payment.status !== 'CONFIRMED' && (
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleConfirmPayment(payment.registrationId)}
                                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300"
                                            >
                                                {t('secretariat.payments.confirmBtn')}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};