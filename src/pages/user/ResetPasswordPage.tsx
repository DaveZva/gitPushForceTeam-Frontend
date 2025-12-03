import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordConfirm } from '../../services/api';
import { createResetPasswordSchema, ResetPasswordFormData } from '../../schemas/authSchema';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const token = searchParams.get('token');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [apiError, setApiError] = useState<string>('');
    const validationSchema = useMemo(() => createResetPasswordSchema(t), [t]);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(validationSchema),
        mode: 'onTouched'
    });

    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        setApiError('');
        if (!token) {
            setApiError(t('auth.tokenMissing'));
            return;
        }

        try {
            await resetPasswordConfirm(token, data.password);
            setStatus('success');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            // Zde předpokládáme, že err.message může být překladový klíč, nebo použijeme obecnou hlášku
            setApiError(t(err.message) || t('auth.invalidToken'));
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl border-2 border-red-200 text-center">
                    <p className="text-red-600 font-bold">{t('auth.invalidToken')}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-blue-600 hover:underline text-sm font-bold"
                    >
                        {t('auth.backToHome')}
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-xl border border-[#027BFF]/30 p-6">

                {/* TITLE */}
                <h1 className="text-xl font-bold text-gray-900 tracking-[-1px] text-center mb-4">
                    {t('auth.resetPasswordTitle')}
                </h1>

                {status === 'success' ? (
                    <div className="text-center py-4">
                        <div className="mb-3 flex justify-center">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {t('auth.passwordChangedSuccess')}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {t('auth.redirecting')}
                        </p>
                    </div>
                ) : (

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* PASSWORD */}
                        <div className="space-y-1">
                            <label
                                htmlFor="password"
                                className="text-sm font-bold text-gray-900 text-left block"
                            >
                                {t('auth.newPassword')}
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="**********"
                                disabled={isSubmitting}
                                {...register('password')}
                                className={`
                                w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-gray-900
                                shadow-sm focus:outline-none transition
                                ${errors.password
                                    ? 'border-red-500 ring-1 ring-red-400'
                                    : 'border-gray-300 focus:border-[#027BFF] focus:ring-1 focus:ring-[#027BFF]'
                                }
                            `}
                            />

                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password.message}</p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="space-y-1">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-bold text-gray-900 text-left block"
                            >
                                {t('auth.confirmPassword')}
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="**********"
                                disabled={isSubmitting}
                                {...register('confirmPassword')}
                                className={`
                                w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-gray-900
                                shadow-sm focus:outline-none transition
                                ${errors.confirmPassword
                                    ? 'border-red-500 ring-1 ring-red-400'
                                    : 'border-gray-300 focus:border-[#027BFF] focus:ring-1 focus:ring-[#027BFF]'
                                }
                            `}
                            />

                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* API ERROR */}
                        {apiError && (
                            <div className="text-red-500 text-xs font-medium text-center bg-red-50 p-2 rounded">
                                {apiError}
                            </div>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                            w-full py-2.5 rounded-full font-semibold text-sm shadow-sm
                            border-2 border-[#027BFF] transition-all duration-300
                            ${isSubmitting
                                ? 'bg-[#027BFF]/50 text-white cursor-not-allowed'
                                : 'bg-[#027BFF] text-white hover:bg-transparent hover:text-[#027BFF]'
                            }
                        `}
                        >
                            {isSubmitting ? '...' : t('auth.changePassword')}
                        </button>

                    </form>
                )}
            </div>
        </div>
    );
}