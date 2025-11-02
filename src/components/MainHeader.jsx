import React, { useState } from 'react'; // Přidán useState
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext'; // Importujeme náš hook
import { AuthModal } from './AuthModal'; // Importujeme náš modál

export function MainHeader() {
    const { t, i18n } = useTranslation();
    const { user, logout, loading, isAuthenticated } = useAuth(); // Získáme data z kontextu

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLanguageChange = () => {
        // Zjistí aktuální jazyk a nastaví ten druhý
        const newLang = i18n.language === 'cs' ? 'en' : 'cs';
        i18n.changeLanguage(newLang);
    };

    // Zobrazíme "načítání", dokud se neověří token z localStorage
    if (loading) {
        return <header className="main-header"></header>; // Prázdná hlavička při načítání
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <header className="main-header">
                <div className="logo">{t('nav.appName')}</div>
                <nav>
                    {/* Tyto odkazy vidí všichni */}
                    <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
                        {t('nav.dashboard')}
                    </NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/apply" className={({isActive}) => isActive ? 'active' : ''}>
                                {t('nav.newApplication')}
                            </NavLink>
                            <NavLink to="/my-applications" className={({isActive}) => isActive ? 'active' : ''}>
                                {t('nav.myApplications')}
                            </NavLink>
                            <NavLink to="/my-cats" className={({isActive}) => isActive ? 'active' : ''}>
                                {t('nav.myCats')}
                            </NavLink>
                            <NavLink to="/secretariat/exhibition" className={({isActive}) => isActive ? 'active' : ''}>
                                {t('nav.exhibitions')}
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="user-actions">
                    <button onClick={handleLanguageChange} className="lang-switch">
                        {/* Zobrazí opačný jazyk, než je zrovna aktivní */}
                        {i18n.language === 'cs' ? 'EN' : 'CS'}
                    </button>

                    {isAuthenticated ? (
                        <div className="user-profile">
                            <button onClick={logout} className="logout-button">{t('nav.logOut')}</button>
                        </div>
                    ) : (
                        // --- NEPŘIHLÁŠENÝ UŽIVATEL ---
                        <div className="user-profile">
                            <button onClick={handleOpenModal} className="login-button">
                                {t('nav.logIn')} / {t('nav.signUp')}
                            </button>
                        </div>
                    )}

                </div>
            </header>

            {/* Modál se zobrazí pouze pokud je isModalOpen true */}
            {isModalOpen && <AuthModal onClose={handleCloseModal} />}
        </>
    );
}