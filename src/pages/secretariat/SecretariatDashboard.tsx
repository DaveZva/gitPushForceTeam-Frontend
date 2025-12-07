import React from 'react';

const StatCard = ({ title, value, trend, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {trend && <span className={`text-xs font-medium ${color}`}>{trend}</span>}
        </div>
    </div>
);

export default function SecretariatDashboard() {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-bold text-gray-900">Přehled</h2>
                <p className="text-gray-500">Vítejte v systému správy výstav.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Aktivní přihlášky" value="156" trend="+12 dnes" color="text-green-600" />
                <StatCard title="Čeká na schválení" value="23" trend="Vyžaduje akci" color="text-orange-600" />
                <StatCard title="Registrovaní uživatelé" value="1,204" trend="+5 tento týden" color="text-blue-600" />
                <StatCard title="Zaplaceno (Celkem)" value="452 000 Kč" trend="MVK Praha" color="text-gray-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Zde by byly grafy nebo seznamy posledních akcí */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-gray-900 mb-4">Poslední registrace</h3>
                    {/* Tabulka... */}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-gray-900 mb-4">Stav naplnění výstav</h3>
                    {/* Progress bary... */}
                </div>
            </div>
        </div>
    );
}