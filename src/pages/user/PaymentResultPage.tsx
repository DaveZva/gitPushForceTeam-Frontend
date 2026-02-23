import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { getRegistrationDetail } from '../../services/api/registrationApi';

type ResultStatus = 'loading' | 'success' | 'processing' | 'failed' | 'error';

export const PaymentResultPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const stripe = useStripe();
    const navigate = useNavigate();

    const [status, setStatus] = useState<ResultStatus>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [recapData, setRecapData] = useState<{
        regId?: string;
        regNumber?: string;
        transactionId?: string;
        amount?: number;
    } | null>(null);

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = searchParams.get('payment_intent_client_secret');
        const redirectStatus = searchParams.get('redirect_status');
        const regIdFromUrl = searchParams.get('registration_id');

        if (!clientSecret) {
            setStatus('error');
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent, error }) => {
            if (error) {
                setStatus('failed');
                setErrorMessage(error.message || t('paymentResult.failedMessage'));
                return;
            }

            if (!paymentIntent) return;

            const regIdToUse = regIdFromUrl || (paymentIntent as any).metadata?.registration_id;

            console.log("Celý PaymentIntent:", paymentIntent);
            console.log("Metadata:", (paymentIntent as any).metadata);
            console.log("Hledám ID:", (paymentIntent as any).metadata?.registration_id);

            switch (paymentIntent.status) {
                case 'succeeded':
                case 'processing':
                    if (redirectStatus === 'succeeded' || paymentIntent.status === 'succeeded') {
                        try {
                            if (regIdToUse) {
                                const regDetail = await getRegistrationDetail(regIdToUse);

                                setRecapData({
                                    regId: regIdToUse,
                                    regNumber: regDetail.registrationNumber,
                                    transactionId: paymentIntent.id,
                                    amount: paymentIntent.amount
                                });
                            } else {
                                setRecapData({
                                    transactionId: paymentIntent.id,
                                    amount: paymentIntent.amount
                                });
                            }
                            setStatus('success');
                        } catch (err) {
                            console.error("Chyba při načítání detailů z BE:", err);
                            setRecapData({
                                regId: regIdToUse,
                                transactionId: paymentIntent.id,
                                amount: paymentIntent.amount
                            });
                            setStatus('success');
                        }
                    }
                    break;
                case 'requires_payment_method':
                case 'requires_action':
                    setStatus('failed');
                    setErrorMessage(t('paymentResult.failedMessage'));
                    if (regIdToUse) {
                        setRecapData({ regId: regIdToUse });
                    }
                    break;

                default:
                    setStatus('failed');
                    break;
            }
        });

    }, [stripe, searchParams, t]);

    if (status === 'loading' || status === 'processing') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">
                    {status === 'processing' ? t('paymentResult.processingTitle') : t('common.loading')}
                </h2>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border-t-4 border-green-500">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                            {t('paymentResult.successTitle')}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {t('paymentResult.successMessage')}
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-8">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-500">
                                    {t('paymentResult.registrationNumber', 'Registrační číslo')}:
                                </span>
                                <span className="font-bold text-xl text-blue-600">
                                    {recapData?.regNumber || recapData?.regId || "Nenačteno"}
                                </span>
                            </div>

                            {recapData?.amount && (
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">{t('paymentResult.totalAmount')}:</span>
                                    <span className="font-bold text-green-600">
                                        {(recapData.amount / 100).toLocaleString()} CZK
                                    </span>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            className="w-full py-3 text-lg"
                            onClick={() => navigate('/my-applications')}
                        >
                            {t('paymentResult.backToApplications')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
            <div className="text-center">Chyba</div>
        </div>
    );
};