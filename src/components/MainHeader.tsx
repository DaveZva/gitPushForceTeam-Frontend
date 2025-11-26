import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export function MainHeader() {
    const { t, i18n } = useTranslation();
    const { user, logout, loading, isAuthenticated } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const handleLanguageChange = () => {
        const newLang = i18n.language === 'cs' ? 'en' : 'cs';
        i18n.changeLanguage(newLang);
    };

    if (loading) {
        return <header className="main-header"></header>;
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
        return isActive ? 'active' : '';
    };

    return (
        <>
            <header className="main-header">
                <div className="logo">{t('nav.appName')}</div>

                <nav className={menuOpen ? "open" : ""}>
                    <NavLink to="/" className={getNavLinkClass}
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.dashboard')}
                    </NavLink>

                    {isAuthenticated && (
                        <>
                            <NavLink
                                to="/apply"
                                className={getNavLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                {t('nav.newApplication')}
                            </NavLink>

                            <NavLink
                                to="/my-applications"
                                className={getNavLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                {t('nav.myApplications')}
                            </NavLink>

                            <NavLink
                                to="/my-cats"
                                className={getNavLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                {t('nav.myCats')}
                            </NavLink>

                            <NavLink
                                to="/secretariat"
                                className={getNavLinkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                {t('nav.exhibitions')}
                            </NavLink>
                        </>
                    )}
                </nav>


                <div className="user-actions">

                    <button onClick={handleLanguageChange} className="lang-switch">
                        {i18n.language === 'cs' ? 'EN' : 'CS'}
                    </button>

                    {isAuthenticated ? (
                        <button onClick={logout} className="logout-button">
                            {t('nav.logOut')}
                        </button>
                    ) : (
                        <button onClick={handleOpenModal} className="login-button">
                            {t('nav.logIn')} / {t('nav.signUp')}
                        </button>
                    )}

                    <button
                        className="hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </header>

            {isModalOpen && <AuthModal onClose={handleCloseModal} />}
        </>
    );
}