import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPasswordConfirm } from '../../services/api';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage(t('auth.passwordsDoNotMatch'));
            return;
        }

        if (!token) {
            setErrorMessage(t('auth.tokenMissing'));
            return;
        }

        setStatus('loading');

        try {
            await resetPasswordConfirm(token, password);
            setStatus('success');
            // Po 3 sekundách přesměrujeme na hlavní stránku, kde se uživatel může přihlásit
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            // Pokud API vrátí chybu, zkusíme ji přeložit, jinak obecná hláška
            setErrorMessage(t(err.message) || t('auth.invalidToken'));
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
            {/* Stejný styl karty jako AuthModal */}
            <div className="bg-white w-full max-w-[340px] rounded-xl overflow-hidden shadow-2xl border-2 border-blue-600">

                {/* Hlavička - modrý pruh */}
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
                        <form onSubmit={handleSubmit} className="space-y-3">

                            {/* Input Nové heslo */}
                            <div className="space-y-0.5">
                                <label className="text-xs font-bold text-gray-700 ml-1">
                                    {t('auth.newPassword')}
                                </label>
                                <input
                                    className="w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="password"
                                    value={password}
                                    placeholder="**********"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="space-y-0.5">
                                <label className="text-xs font-bold text-gray-700 ml-1">
                                    {t('auth.confirmPassword')}
                                </label>
                                <input
                                    className="w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="password"
                                    value={confirmPassword}
                                    placeholder="**********"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={status === 'loading'}
                                />
                            </div>

                            {errorMessage && (
                                <div className="text-red-500 text-xs font-medium text-center bg-red-50 p-2 rounded mt-2">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`w-full mt-4 text-white text-sm font-bold py-2.5 rounded-full shadow-sm transition-colors duration-200
                                    ${status === 'loading' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {status === 'loading' ? '...' : t('auth.changePassword')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}