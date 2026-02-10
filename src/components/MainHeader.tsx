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


                    <NavLink
                        to="/catalog"
                        className={getNavLinkClass}
                        onClick={() => setMenuOpen(false)}
                    >
                        {t('nav.catalog')}
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
                    <div className="flex items-center bg-gray-100/80 p-1 rounded-lg border border-gray-200 ml-2">
                        <button
                            onClick={() => i18n.changeLanguage('cs')}
                            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                                i18n.language.startsWith('cs')
                                    ? 'bg-white text-gray-900 shadow-sm' // Aktivní: čistě bílá s černým textem
                                    : 'text-gray-400 hover:text-gray-600' // Neaktivní: tlumená šedá
                            }`}
                        >
                            CZ
                        </button>
                        <button
                            onClick={() => i18n.changeLanguage('en')}
                            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                                i18n.language.startsWith('en')
                                    ? 'bg-white text-gray-900 shadow-sm' // Aktivní
                                    : 'text-gray-400 hover:text-gray-600' // Neaktivní
                            }`}
                        >
                            EN
                        </button>
                    </div>

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