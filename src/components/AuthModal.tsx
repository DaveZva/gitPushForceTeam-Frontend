import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
    onClose: () => void;
}

type AuthView = 'login' | 'register' | 'forgot';

export function AuthModal({ onClose }: AuthModalProps) {
    const {t} = useTranslation();

    const [view, setView] = useState<AuthView>('login');

    const auth = useAuth();
    const {login, register} = auth;
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
                className="bg-white w-full max-w-[360px] rounded-2xl overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* CATSHOW – jen login + registrace */}
                {view !== 'forgot' && (
                    <div className="pt-5 pb-3 text-center">
                        <h1 className="text-xl font-extrabold text-[#000000]">
                            CATSHOW
                        </h1>
                    </div>
                )}

                {/* TABS – posunuty pod CATSHOW */}
                {view !== 'forgot' && (
                    <div className="flex w-full justify-center gap-2 pb-2">

                        {/* LOGIN TAB */}
                        <button
                            onClick={() => switchView('login')}
                            className={
                                view === 'login'
                                    ? "rounded-[25px] border-2 border-transparent px-14 py-2 text-sm font-bold tracking-[-0.5px] leading-[18px] bg-[#027BFF] text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]"
                                    : "rounded-[25px] border-2 border-[#027BFF] px-4 py-2 text-sm font-bold tracking-[-0.5px] leading-[18px] text-[#027BFF] bg-white transition-all duration-200 ease-in-out hover:bg-[#027BFF] hover:text-white"
                            }
                        >
                            Přihlášení
                        </button>

                        {/* REGISTER TAB */}
                        <button
                            onClick={() => switchView('register')}
                            className={
                                view === 'register'
                                    ? "rounded-[25px] border-2 border-transparent px-14 py-2 text-sm font-bold tracking-[-0.5px] leading-[18px] bg-[#027BFF] text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]"
                                    : "rounded-[25px] border-2 border-[#027BFF] px-4 py-2 text-sm font-bold tracking-[-0.5px] leading-[18px] text-[#027BFF] bg-white transition-all duration-200 ease-in-out hover:bg-[#027BFF] hover:text-white"
                            }
                        >
                            Registrace
                        </button>

                    </div>
                )}

                {/* FORGOT HEADER */}
                {view === 'forgot' && (
                    <div className="flex items-center px-4 py-3">
                        <button
                            onClick={() => switchView('login')}
                            className="rounded-[25px] border-2 border-transparent px-4 py-2 text-sm font-bold tracking-[-0.5px] leading-[18px]
                        bg-[#027BFF] text-white flex items-center gap-2 transition-all duration-200 ease-in-out
                        hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]"
                        >
                            ← Zpět
                        </button>
                    </div>
                )}

                {/* FORM CONTENT */}
                <div className={`px-6 ${view === 'forgot' ? 'pt-2 pb-6' : 'py-6'} text-left`}>
                    <h2 className="text-xl font-extrabold tracking-[-1px] text-gray-900 mb-6">
                        {view === 'login' && 'Přihlášení uživatele'}
                        {view === 'register' && 'Vytvoření nového účtu'}
                        {view === 'forgot' && 'Zapomenuté heslo'}
                    </h2>

                    {view === 'forgot' && (
                        <p className="text-sm text-gray-600 mb-4">
                            Pro obnovu hesla zadejte e-mailovou adresu, na kterou Vám zašleme instrukce.
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Jméno + příjmení */}
                        {view === 'register' && (
                            <>
                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-1">Jméno</label>
                                    <input
                                        className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-1">Příjmení</label>
                                    <input
                                        className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-gray-800 block mb-1">E-mail</label>
                            <input
                                className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none"
                                type="email"
                                value={email}
                                placeholder="jan.novak@email.cz"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Heslo */}
                        {view !== 'forgot' && (
                            <div>
                                <label className="text-sm font-semibold text-gray-800 block mb-1">Heslo</label>
                                <input
                                    className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none"
                                    type="password"
                                    value={password}
                                    placeholder="**********"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Forgot link */}
                        {view === 'login' && (
                            <div className="text-right">
                            <span
                                onClick={() => switchView('forgot')}
                                className="text-sm text-[#027BFF] font-semibold hover:underline cursor-pointer"
                            >
                                Zapomněli jste heslo?
                            </span>
                            </div>
                        )}

                        {/* Error / Success */}
                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                        {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full rounded-[25px] border-2 border-transparent px-5 py-3 text-base font-bold tracking-[-1px] leading-[20px] bg-[#027BFF] text-white flex justify-center items-center transition-all duration-200 ease-in-out
                        hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]"
                        >
                            {view === 'login' && 'Přihlásit se'}
                            {view === 'register' && 'Registrovat se'}
                            {view === 'forgot' && 'Obnovit heslo'}
                        </button>
                    </form>

                    {/* Bottom text */}
                    {view !== 'forgot' && (
                        <div className="mt-6 text-center text-sm text-gray-700">
                            {view === 'login' ? (
                                <>
                                    Nemáte účet?{' '}
                                    <span
                                        onClick={() => switchView('register')}
                                        className="text-[#027BFF] font-semibold hover:underline cursor-pointer"
                                    >
                                    Registrace
                                </span>
                                </>
                            ) : (
                                <>
                                    Máte účet?{' '}
                                    <span
                                        onClick={() => switchView('login')}
                                        className="text-[#027BFF] font-semibold hover:underline cursor-pointer"
                                    >
                                    Přihlášení
                                </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}