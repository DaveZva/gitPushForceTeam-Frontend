import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const SecretariatLayout = () => {
    const {  t } = useTranslation();
    const location = useLocation();

    const menuItems = [
        { path: '/secretariat', icon: '📊', label: 'Dashboard' },
        { path: '/secretariat/shows', icon: '🏆', label: 'Výstavy' },
        { path: '/secretariat/users', icon: '👥', label: 'Uživatelé' },
        { path: '/secretariat/payments', icon: '💰', label: 'Platby' },
        { path: '/secretariat/judges', icon: '⚖️', label: 'Rozhodčí a Stevardi' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-[#027BFF]">Pawdium</span> Admin
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
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
                                    ${isActive
                                    ? 'bg-blue-50 text-[#027BFF]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <span className="text-lg">{item.icon}</span>
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
                            <p className="font-medium text-gray-900">Sekretariát</p>
                            <p className="text-xs text-gray-500">Admin Role</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};