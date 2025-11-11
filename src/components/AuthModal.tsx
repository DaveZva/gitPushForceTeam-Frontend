import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
    onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
    const { t } = useTranslation();

    const [isLoginView, setIsLoginView] = useState<boolean>(true);
    const { login, register } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await register(firstName, lastName, email, password);
            }
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(t(err.message) || 'Došlo k chybě.');
            } else {
                setError('Došlo k neznámé chybě.');
            }
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>{isLoginView ? t('auth.login') : t('auth.registration')}</h2>

                <form onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <>
                            <div className="form-group">
                                <label>{t('auth.firstName')}</label>
                                <input className="inputText" type="text" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>{t('auth.lastName')}</label>
                                <input className="inputText" type="text" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} required />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>{t('auth.email')}</label>
                        <input className="inputText" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>{t('auth.password')}</label>
                        <input className="inputText" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-btn">
                        {isLoginView ? t('auth.loginIn') : t('auth.registerIn')}
                    </button>
                </form>

                <p className="toggle-view">
                    {isLoginView ? t('auth.dontHaveAccount') : t('auth.haveAccount')}
                    <span onClick={() => setIsLoginView(!isLoginView)}>
                        {isLoginView ? t('auth.registerIn') : t('auth.loginIn')}
                    </span>
                </p>
            </div>
        </div>
    );
}