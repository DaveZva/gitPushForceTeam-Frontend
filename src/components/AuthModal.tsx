import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
    onClose: () => void;
}

type AuthView = 'login' | 'register' | 'forgot';

export function AuthModal({ onClose }: AuthModalProps) {
    const { t } = useTranslation();

    const [view, setView] = useState<AuthView>('login');

    const auth = useAuth();
    const { login, register } = auth;
    const resetPassword = (auth as any).resetPassword;

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            if (view === 'login') {
                await login(email, password);
                onClose();
            } else if (view === 'register') {
                await register(firstName, lastName, email, password);
                onClose();
            } else if (view === 'forgot') {
                if (resetPassword) {
                    await resetPassword(email);
                    setSuccessMessage(t('auth.resetEmailSent') || 'Instrukce byly odeslány na váš email.');
                } else {
                    console.warn('Funkce resetPassword není implementována v AuthContext');
                    setSuccessMessage('Instrukce odeslány (simulace).');
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(t(err.message) || 'Došlo k chybě.');
            } else {
                setError('Došlo k neznámé chybě.');
            }
        }
    };

    const switchView = (newView: AuthView) => {
        setView(newView);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-[340px] rounded-xl overflow-hidden shadow-2xl border-2 border-blue-600"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full h-11">
                    {view === 'forgot' ? (
                        <div className="w-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase tracking-wider">
                            {t('auth.passwordRecovery') || 'Obnovení hesla'}
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => switchView('login')}
                                className={`flex-1 text-xs font-bold uppercase tracking-wider transition-colors duration-200
                                    ${view === 'login'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {t('auth.login')}
                            </button>
                            <button
                                type="button"
                                onClick={() => switchView('register')}
                                className={`flex-1 text-xs font-bold uppercase tracking-wider transition-colors duration-200
                                    ${view === 'register'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {t('auth.registration')}
                            </button>
                        </>
                    )}
                </div>

                <div className="p-5">
                    <h2 className="text-lg font-extrabold text-gray-900 mb-4 text-center leading-tight">
                        {view === 'login' && t('auth.login')}
                        {view === 'register' && t('auth.registration')}
                        {view === 'forgot' && (t('auth.forgotPasswordTitle') || 'Zadejte váš email')}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        {view === 'register' && (
                            <>
                                <div className="space-y-0.5">
                                    <label className="text-xs font-bold text-gray-700 ml-1">{t('auth.firstName')}</label>
                                    <input
                                        className="w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <label className="text-xs font-bold text-gray-700 ml-1">{t('auth.lastName')}</label>
                                    <input
                                        className="w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-0.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">{t('auth.email')}</label>
                            <input
                                className="w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                type="email"
                                value={email}
                                placeholder="jan.novak@email.cz"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {view !== 'forgot' && (
                            <div className="space-y-0.5">
                                <label className="text-xs font-bold text-gray-700 ml-1">{t('auth.password')}</label>
                                <input
                                    className="w-full bg-gray-100 text-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="password"
                                    value={password}
                                    placeholder="**********"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {view === 'login' && (
                            <div className="text-right -mt-1">
                                <button
                                    type="button"
                                    onClick={() => switchView('forgot')}
                                    className="text-xs text-gray-400 hover:text-blue-600 hover:bg-transparent p-0 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            </div>
                        )}

                        {error && <p className="text-red-500 text-xs font-medium text-center bg-red-50 p-1 rounded">{error}</p>}
                        {successMessage && <p className="text-green-600 text-xs font-medium text-center bg-green-50 p-1 rounded">{successMessage}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-full shadow-sm mt-1"
                        >
                            {view === 'login' && t('auth.loginIn')}
                            {view === 'register' && t('auth.registerIn')}
                            {view === 'forgot' && (t('auth.send') || 'Odeslat')}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-gray-500 text-xs">
                        {view === 'forgot' ? (
                            <button
                                onClick={() => switchView('login')}
                                className="text-xs text-gray-400 hover:text-blue-600 hover:bg-transparent p-0 font-bold transition-colors duration-200 bg-transparent border-none cursor-pointer"
                            >
                                {t('auth.backToLogin') || 'Zpět na přihlášení'}
                            </button>
                        ) : (
                            <>
                                <span>
                                    {view === 'login' ? t('auth.dontHaveAccount') : t('auth.haveAccount')}
                                </span>
                                {' '}
                                <button
                                    onClick={() => switchView(view === 'login' ? 'register' : 'login')}
                                    className="text-xs text-gray-400 hover:text-blue-600 hover:bg-transparent p-0 font-bold transition-colors duration-200 ml-1 bg-transparent border-none cursor-pointer"
                                >
                                    {view === 'login' ? t('auth.registerIn') : t('auth.login')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}