import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { PaymentForm } from '../../components/secretariat/PaymentForm';
import { createPaymentIntent } from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
    const { t } = useTranslation();
    const { registrationId } = useParams();
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (registrationId) {
            createPaymentIntent(registrationId)
                .then((data) => {
                    setClientSecret(data.clientSecret);
                })
                .catch((err) => {
                    console.error("Chyba:", err);
                    if (err.response && err.response.data) {
                        setError(err.response.data);
                    } else {
                        setError(t('payment.initError'));
                    }
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

                        {error ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {t('payment.errorTitle', 'Nelze provést platbu')}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {error}
                                </p>
                                <button
                                    onClick={() => navigate('/my-applications')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    {t('navigation.backToRegistrations', 'Zpět na přihlášky')}
                                </button>
                            </div>
                        ) : clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <PaymentForm
                                    clientSecret={clientSecret}
                                    registrationId={registrationId!}
                                />
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