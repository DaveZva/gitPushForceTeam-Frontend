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
    const { t } = useTranslation();

    const token = searchParams.get('token');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [apiError, setApiError] = useState<string>('');
    const validationSchema = useMemo(() => createResetPasswordSchema(t), [t]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[340px] rounded-xl overflow-hidden shadow-2xl border-2 border-blue-600">

                <div className="w-full h-11 bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase tracking-wider">
                    {t('auth.resetPasswordTitle')}
                </div>

                <div className="p-5">
                    {status === 'success' ? (
                        <div className="text-center py-4">
                            <div className="mb-3 flex justify-center">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('auth.passwordChangedSuccess')}</h3>
                            <p className="text-sm text-gray-500">{t('auth.redirecting')}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            <div className="space-y-0.5">
                                <label htmlFor="password" className="text-xs font-bold text-gray-700 ml-1">
                                    {t('auth.newPassword')}
                                </label>
                                <input
                                    id="password"
                                    className={`w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.password ? 'ring-1 ring-red-500' : 'focus:ring-blue-500'}`}
                                    type="password"
                                    placeholder="**********"
                                    disabled={isSubmitting}
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-700 ml-1">
                                    {t('auth.confirmPassword')}
                                </label>
                                <input
                                    id="confirmPassword"
                                    className={`w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.confirmPassword ? 'ring-1 ring-red-500' : 'focus:ring-blue-500'}`}
                                    type="password"
                                    placeholder="**********"
                                    disabled={isSubmitting}
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {apiError && (
                                <div className="text-red-500 text-xs font-medium text-center bg-red-50 p-2 rounded mt-2">
                                    {apiError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full mt-4 text-white text-sm font-bold py-2.5 rounded-full shadow-sm transition-colors duration-200
                                    ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isSubmitting ? '...' : t('auth.changePassword')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}