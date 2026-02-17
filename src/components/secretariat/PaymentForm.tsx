import React, { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface PaymentFormProps {
    clientSecret: string;
    registrationId: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, registrationId }) => {
    const { t } = useTranslation();
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;

        const clientSecretParams = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecretParams) return;

        stripe.retrievePaymentIntent(clientSecretParams).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage(t('payment.success'));
                    break;
                case "processing":
                    setMessage(t('payment.processingStatus'));
                    break;
                case "requires_payment_method":
                    setMessage(t('payment.requiresPaymentMethod'));
                    break;
                default:
                    setMessage(t('payment.genericError'));
                    break;
            }
        });
    }, [stripe, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/result?registration_id=${registrationId}`,            },
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || t('payment.validationError'));
            } else {
                setMessage(t('payment.unexpectedError'));
            }
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
                <PaymentElement
                    id="payment-element"
                    options={{
                        layout: "tabs",
                    }}
                />
            </div>

            {message && (
                <div className={`p-4 rounded-xl border-l-4 ${
                    message.includes('success') || message.includes('úspěšně')
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-red-50 border-red-500 text-red-700'
                }`}>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">
                            {message.includes('success') || message.includes('úspěšně') ? '✅' : '⚠️'}
                        </span>
                        <p className="font-medium">{message}</p>
                    </div>
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !stripe || !elements}
                className="w-full py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('payment.processing')}
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        🔒 {t('payment.pay')}
                    </span>
                )}
            </Button>

            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    {t('payment.sslSecure')}
                </div>
                <div className="text-gray-300">|</div>
                <div className="text-sm text-gray-500 font-semibold">
                    {t('payment.poweredByStripe')}
                </div>
            </div>
        </form>
    );
};