import React from 'react';

export const RegistrationsTab = ({ showId }: any) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between bg-gray-50">
                <div className="flex gap-2">
                    <input type="text" placeholder="Hledat jméno, EMS, majitele..." className="px-3 py-2 border rounded-lg text-sm w-64" />
                    <select className="px-3 py-2 border rounded-lg text-sm bg-white">
                        <option>Všechny stavy</option>
                        <option>Potvrzeno</option>
                        <option>Čeká na platbu</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Tabulka */}
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                    <th className="p-4">Reg. Číslo</th>
                    <th className="p-4">Kočka</th>
                    <th className="p-4">EMS / Třída</th>
                    <th className="p-4">Majitel</th>
                    <th className="p-4">Stav</th>
                    <th className="p-4 text-right">Akce</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {/* MOCK ROW */}
                <tr className="hover:bg-blue-50/50 transition">
                    <td className="p-4 font-mono text-gray-500">REG-2025-101</td>
                    <td className="p-4">
                        <div className="font-bold text-gray-900">IC Micka z Horní Dolní</div>
                        <div className="text-xs text-gray-500">2021-05-12 • Female</div>
                    </td>
                    <td className="p-4">
                        <div className="badge bg-blue-100 text-blue-800 px-2 py-0.5 rounded inline-block mb-1">MCO n 22</div>
                        <div className="text-gray-600">Třída 5 (CAGCIB)</div>
                    </td>
                    <td className="p-4">
                        <div>Jan Novák</div>
                        <div className="text-xs text-gray-400">jan.novak@email.cz</div>
                    </td>
                    <td className="p-4">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                CONFIRMED
                            </span>
                    </td>
                    <td className="p-4 text-right">
                        <button className="text-[#027BFF] font-medium hover:underline">Detail</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}