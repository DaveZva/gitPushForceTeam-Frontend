import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import ikon ze složky assets
import DashboardIcon from '../assets/icons/dashboard_icon.svg';
import ExhibitionsIcon from '../assets/icons/exhibitions_icon.svg';
import UsersIcon from '../assets/icons/users_icon.svg';
import PaymentsIcon from '../assets/icons/payment_icon.svg';
import RefereeIcon from '../assets/icons/referee_icon.svg';

export const SecretariatLayout = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const menuItems = [
        { path: '/secretariat', icon: DashboardIcon, label: 'Dashboard' },
        { path: '/secretariat/shows', icon: ExhibitionsIcon, label: 'Výstavy' },
        { path: '/secretariat/users', icon: UsersIcon, label: 'Uživatelé' },
        { path: '/secretariat/payments', icon: PaymentsIcon, label: 'Platby' },
        { path: '/secretariat/judges', icon: RefereeIcon, label: 'Rozhodčí a Stevardi' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans tracking-tight">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 tracking-[-1px]">
                        <span className="text-[#027BFF]">{t('nav.appName')}</span> Admin
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/secretariat' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                                    ${isActive
                                    ? 'bg-blue-50 text-[#027BFF] shadow-sm shadow-blue-100/50'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className={`w-5 h-5 transition-all ${isActive ? 'brightness-100' : 'opacity-50 grayscale'}`}
                                    style={isActive ? { filter: 'invert(31%) sepia(94%) saturate(4157%) hue-rotate(204deg) brightness(101%) contrast(105%)' } : {}}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            SE
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-gray-900 tracking-tight">{t('secretariat.title')}</p>
                            <p className="text-xs text-gray-500 font-medium">{t('secretariat.adminRole')}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};