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
    // NOVÉ POLE:
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*_\-]).{8,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            if (view === 'login') {
                await login(email, password);
                onClose();
            } else if (view === 'register') {
                if (password !== confirmPassword) {
                    setError(t('auth.passwordsDoNotMatch') || 'Hesla se neshodují.');
                    return;
                }
                if (!validatePassword(password)) {
                    setError('Heslo musí obsahovat alespoň 8 znaků, obsahovat velké a malé písmeno, číslo a speciální znak.');
                    return;
                }

                await register(firstName, lastName, email, password);
                onClose();
            } else if (view === 'forgot') {
                if (resetPassword) {
                    await resetPassword(email);
                    setSuccessMessage(t('auth.resetEmailSent'));
                } else {
                    console.warn('Funkce resetPassword není implementována v AuthContext');
                    setSuccessMessage(t('auth.simulationSent'));
                }
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(t(err.message) || t('auth.genericError'));
            } else {
                setError(t('auth.unknownError'));
            }
        }
    };

    const switchView = (newView: AuthView) => {
        setView(newView);
        setError('');
        setSuccessMessage('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-[360px] rounded-2xl overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>

                {view !== 'forgot' && (
                    <div className="pt-5 pb-3 text-center">
                        <h1 className="text-xl font-extrabold text-[#000000]">{t('nav.appName')}</h1>
                    </div>
                )}

                {view !== 'forgot' && (
                    <div className="flex w-full justify-center gap-2 pb-2">
                        <button onClick={() => switchView('login')} className={view === 'login' ? "rounded-[25px] border-2 border-transparent px-14 py-2 text-sm font-bold bg-[#027BFF] text-white" : "rounded-[25px] border-2 border-[#027BFF] px-4 py-2 text-sm font-bold text-[#027BFF] bg-white"}>{t('auth.login')}</button>
                        <button onClick={() => switchView('register')} className={view === 'register' ? "rounded-[25px] border-2 border-transparent px-14 py-2 text-sm font-bold bg-[#027BFF] text-white" : "rounded-[25px] border-2 border-[#027BFF] px-4 py-2 text-sm font-bold text-[#027BFF] bg-white"}>{t('auth.registration')}</button>
                    </div>
                )}

                {view === 'forgot' && (
                    <div className="flex items-center px-4 py-3">
                        <button
                            onClick={() => switchView('login')}
                            className="rounded-[25px] border-2 border-transparent px-4 py-2 text-sm font-bold tracking-[-0.5px] leading-[18px]
                        bg-[#027BFF] text-white flex items-center gap-2 transition-all duration-200 ease-in-out
                        hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]"
                        >
                            ← {t('auth.back')}
                        </button>
                    </div>
                )}

                <div className={`px-6 ${view === 'forgot' ? 'pt-2 pb-6' : 'py-6'} text-left`}>
                    <h2 className="text-xl font-extrabold tracking-[-1px] text-gray-900 mb-6">
                        {view === 'login' && t('Přihlášení')}
                        {view === 'register' && t('Registrace')}
                        {view === 'forgot' && t('auth.forgotPasswordTitle')}
                    </h2>

                    {view === 'forgot' && (<p className="text-sm text-gray-600 mb-4">{t('auth.forgotPasswordDesc')}</p>)}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {view === 'register' && (
                            <>
                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-1">{t('auth.firstName')}</label>
                                    <input className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-1">{t('auth.lastName')}</label>
                                    <input className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="text-sm font-semibold text-gray-800 block mb-1">{t('auth.email')}</label>
                            <input className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none" type="email" value={email} placeholder={t('Zadejte email')} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {view !== 'forgot' && (
                            <>
                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-1">{t('auth.password')}</label>
                                    <input className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none" type="password" value={password} placeholder="**********" onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                {view === 'register' && (
                                    <div>
                                        <label className="text-sm font-semibold text-gray-800 block mb-1">{t('auth.confirmPassword') || 'Zopakovat heslo'}</label>
                                        <input className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#027BFF] outline-none" type="password" value={confirmPassword} placeholder="**********" onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                )}
                            </>
                        )}

                        {view === 'login' && (
                            <div className="text-right">
                                <span onClick={() => switchView('forgot')} className="text-sm text-[#027BFF] font-semibold hover:underline cursor-pointer">{t('auth.forgotPasswordLink')}</span>
                            </div>
                        )}

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                        {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}

                        <button type="submit" className="w-full rounded-[25px] border-2 border-transparent px-5 py-3 text-base font-bold bg-[#027BFF] text-white flex justify-center items-center hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF]">
                            {view === 'login' && t('auth.loginIn')}
                            {view === 'register' && t('auth.registerIn')}
                            {view === 'forgot' && t('auth.resetAction')}
                        </button>
                    </form>

                    {view !== 'forgot' && (
                        <div className="mt-6 text-center text-sm text-gray-700">
                            {view === 'login' ? <>{t('auth.dontHaveAccount')} <span onClick={() => switchView('register')} className="text-[#027BFF] font-semibold hover:underline cursor-pointer">{t('auth.registration')}</span></> : <>{t('auth.hasAccountShort')} <span onClick={() => switchView('login')} className="text-[#027BFF] font-semibold hover:underline cursor-pointer">{t('auth.login')}</span></>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
