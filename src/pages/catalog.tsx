import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


const judges = [
    { name: 'Mrs. Eva Porat SE', sat: 100, sun: 100 },
    { name: 'Mrs. Annika Berner SE', sat: 100, sun: 100 },
    { name: 'Mrs. Manuela Centamore IT', sat: 100, sun: 100 },
    { name: 'Mrs. Daria Łukasik-Weber PL', sat: 100, sun: 100 },
    { name: 'Mrs. Anne-Louise Nygaard Sadek DK', sat: 100, sun: 100 },
    { name: 'Mr. Juan José Martinez Vizcaino ES', sat: 100, sun: 100 },
    { name: 'Mr. Kristof Van Roy BE', sat: 100, sun: 100 },
    { name: 'Mrs. Anna Wilczek PL', sat: 100, sun: 0 },
];

export default function Catalog() {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<'cat1' | 'cat2' | 'cat3' | 'cat4'>('cat1');

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4 space-y-8">

                <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-[-2px]">
                    {t('catalog.title', 'Katalog výstavy')}
                </h1>

                <section className="bg-white rounded-2xl shadow-md px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-left">
                        <h2 className="text-xl font-semibold text-gray-900">Cat Show: FP – Poznań</h2>
                        <p className="text-sm text-gray-500">
                            Date: 2025–11–15 &amp; 2025–11–16
                        </p>
                    </div>

                    <div className="text-sm text-gray-700 text-left sm:text-right">
                        <p className="font-semibold">Judges &amp; colours:</p>
                        <div className="flex flex-wrap gap-3 mt-1 sm:justify-end">
                            <a href="#" className="text-[#027BFF] font-semibold hover:underline">
                                [2025–11–15]
                            </a>
                            <a href="#" className="text-[#027BFF] font-semibold hover:underline">
                                [2025–11–16]
                            </a>
                        </div>
                    </div>
                </section>

                {/* Judges' reports – samostatná karta */}
                <section className="bg-white rounded-2xl shadow-md px-6 sm:px-8 py-6">
                    <div className="flex items-baseline justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold  tracking-[-1px] text-gray-900">
                            Judges&apos; reports
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {judges.map((j, idx) => (
                            <div
                                key={idx}
                                className="py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                            >
                                {/* Jméno */}
                                <div className="md:w-1/3 font-medium text-gray-900 text-left">
                                    {j.name}
                                </div>

                                {/* Sobota */}
                                <div className="md:w-1/3 flex items-center gap-3">
                                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                        {j.sat}%
                                    </span>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all bg-[#027BFF]"
                                            style={{ width: `${j.sat}%` }}
                                        />
                                    </div>
                                    <a
                                        href="#"
                                        className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap"
                                    >
                                        [2025–11–15]
                                    </a>
                                </div>

                                {/* Neděle */}
                                <div className="md:w-1/3 flex items-center gap-3">
                                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                        {j.sun}%
                                    </span>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                j.sun === 0 ? 'bg-gray-300' : 'bg-[#027BFF]'
                                            }`}
                                            style={{ width: `${j.sun}%` }}
                                        />
                                    </div>
                                    <a
                                        href="#"
                                        className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap"
                                    >
                                        [2025–11–16]
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Nominations – samostatná karta */}
                <section className="bg-white rounded-2xl shadow-md px-6 sm:px-8 py-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 tracking-[-1px] text-left">
                        Nominations
                    </h3>

                    <div className="space-y-4 text-sm sm:text-base">
                        {/* Den 1 */}
                        <div>
                            <div className="text-[#027BFF] font-bold mb-1 text-left">
                                2025–11–15
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DOM', 'NFO'].map(
                                    (cat, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF]"
                                        >
                                            [{cat}]
                                        </a>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Den 2 */}
                        <div>
                            <div className="text-[#027BFF] font-bold mb-1 text-left">
                                2025–11–16
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'DOM'].map(
                                    (cat, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF]"
                                        >
                                            [{cat}]
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">

                    {/* CAT 1 */}
                    {activeTab === 'cat1' && (
                        <>
                            {/* DESKTOP TABLE */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                    <tr className="bg-[#027BFF] text-white">
                                        <th className="p-2">No.</th>
                                        <th className="p-2 text-left">Cat</th>
                                        <th className="p-2 text-center">Sex</th>
                                        <th className="p-2">EMS (Sat)</th>
                                        <th className="p-2 text-center">Class (Sat)</th>
                                        <th className="p-2">Result Sat.</th>
                                        <th className="p-2">Judge Sat.</th>
                                        <th className="p-2">EMS (Sun)</th>
                                        <th className="p-2 text-center">Class (Sun)</th>
                                        <th className="p-2">Result Sun.</th>
                                        <th className="p-2">Judge Sun.</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    <tr className="border-b">
                                        <td className="p-2">1.</td>
                                        <td className="p-2 font-semibold">NW24 SC JCH SAN-FE ALEX JW</td>
                                        <td className="p-2 text-center">1,0</td>
                                        <td className="p-2">EXO n</td>
                                        <td className="p-2 text-center">1</td>
                                        <td className="p-2">PH</td>
                                        <td className="p-2">Mrs. Eva Porat SE</td>
                                        <td className="p-2">EXO n</td>
                                        <td className="p-2 text-center">1</td>
                                        <td className="p-2">ABS</td>
                                        <td className="p-2">Mrs. Daria Łukasik-Weber PL</td>
                                    </tr>

                                    {/* DALŠÍ ŘÁDKY PŘIDÁŠ STEJNĚ */}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE CARDS */}
                            {/* MOBILE CARDS */}
                            <div className="md:hidden flex flex-col gap-4">
                                <details className="border rounded-xl shadow-sm p-4">
                                    <summary className="font-semibold cursor-pointer text-left">
                                        #1 — NW24 SC JCH SAN-FE ALEX JW
                                    </summary>

                                    <p className="text-gray-500 text-sm mt-1 text-left">
                                        Sex: 1,0 • EMS: EXO n • Class: 1
                                    </p>

                                    <div className="mt-3 border-t pt-3 text-sm space-y-1 text-left">
                                        <p className="font-semibold text-[#027BFF]">Saturday</p>
                                        <p><span className="font-semibold">Result:</span> PH</p>
                                        <p><span className="font-semibold">Judge:</span> Mrs. Eva Porat SE</p>

                                        <p className="font-semibold text-[#027BFF]">Sunday</p>
                                        <p><span className="font-semibold">Result:</span> ABS</p>
                                        <p><span className="font-semibold">Judge:</span> Mrs. Daria Łukasik-Weber PL</p>
                                    </div>
                                </details>

                                {/* DALŠÍ KARTY STEJNĚ */}
                            </div>
                        </>
                    )}

                    {activeTab !== 'cat1' && (
                        <div className="text-center text-gray-500 py-10">
                            Zatím není žádný obsah pro tuto kategorii.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}