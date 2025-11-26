import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { PaymentForm } from '../../components/PaymentForm';
import { createPaymentIntent } from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
    const { t } = useTranslation();
    const { registrationId } = useParams();
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (registrationId) {
            createPaymentIntent(registrationId)
                .then((data) => {
                    setClientSecret(data.clientSecret);
                })
                .catch((err) => {
                    console.error("Chyba při inicializaci platby", err);
                    setError(t('payment.initError'));
                });
        }
    }, [registrationId, t]);

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="container max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-8 p-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-900">
                                🐱 {t('payment.title')}
                            </h1>
                            <p className="text-xl text-gray-600">
                                {t('payment.subtitle')}
                            </p>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 shadow-lg">
                                <div className="text-9xl text-center animate-bounce">
                                    🐈
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg">
                                {t('payment.secureBadge')}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-2xl">🔒</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{t('payment.features.secure.title')}</h3>
                                    <p className="text-sm text-gray-600">{t('payment.features.secure.desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-2xl">⚡</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{t('payment.features.instant.title')}</h3>
                                    <p className="text-sm text-gray-600">{t('payment.features.instant.desc')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-2xl">💳</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{t('payment.features.methods.title')}</h3>
                                    <p className="text-sm text-gray-600">{t('payment.features.methods.desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {t('payment.form.title')}
                            </h2>
                            <p className="text-gray-600">
                                {t('payment.form.registrationRef')} {registrationId}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <PaymentForm clientSecret={clientSecret} />
                            </Elements>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-4 text-gray-500">{t('payment.loading')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}