import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css'; // Vytvoříme v dalším kroku
import { useTranslation } from 'react-i18next';

export function AuthModal({ onClose }) {
    const { t } = useTranslation();
    const [isLoginView, setIsLoginView] = useState(true);
    const { login, register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await register(firstName, lastName, email, password);
            }
            onClose(); // Zavřeme modál po úspěchu
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Došlo k chybě.');
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>{isLoginView ? t('auth.login') : t('auth.registration')}</h2>

                <form onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <>
                            <div className="form-group">
                                <label>{t('auth.firstName')}</label>
                                <input className="inputText" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>{t('auth.lastName')}</label>
                                <input className="inputText" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>{t('auth.email')}</label>
                        <input className="inputText" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>{t('auth.password')}</label>
                        <input className="inputText" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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