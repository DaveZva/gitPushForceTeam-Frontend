import React, { useState } from "react";
import { Link } from "react-router-dom";
// (Pokud používáš react-i18next, odkomentuj tento řádek):
// import { useTranslation } from 'react-i18next';

// --- DEFINICE DAT PRO KATALOG ---
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

const catalogueData = [
    // Zkrácená data pro Quick Catalogue
    { no: '1.', cat: 'NW24 SC JCH SAN-FE ALEX JW', sex: '1,0', emsSat: 'EXO n', classSat: '1', resultSat: 'PH', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'EXO n', classSun: '1', resultSun: 'ABS', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '2.', cat: 'CEW25 CH JCH KCH RAY OF HOPE KANDOVAN*PL JW', sex: '0,1', emsSat: 'EXO n 22', classSat: '5', resultSat: 'Ex 1, CAGCIB, NOM', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'EXO n 22', classSun: '5', resultSun: 'ABS', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '3.', cat: 'GIC, *QGC PL*PATI-MARRO ROMEO', sex: '1,0', emsSat: 'EXO n 33', classSat: '3', resultSat: 'Ex 1, CACS, NOM', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'EXO n 33', classSun: '3', resultSun: 'Ex 1, CACS', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '4.', cat: 'NW24 GIC JCH KCH THE LEGEND MIRO JW', sex: '1,0', emsSat: 'PER n', classSat: '3', resultSat: 'ABS', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'PER n', classSun: '3', resultSun: 'ABS', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '5.', cat: 'KCH GLIMMER KLAN PUCHATYCH*PL', sex: '0,1', emsSat: 'PER n', classSat: '12', resultSat: 'Ex 1, CACC', judgeSat: 'Mrs. Daria Łukasik-Weber PL', emsSun: 'PER n', classSun: '12', resultSun: 'Ex 1, CACC, NOM', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '6.', cat: 'CH JCH KCH NARF COSMO', sex: '1,0', emsSat: 'PER ns 11', classSat: '7', resultSat: 'Ex 1, CACIB', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'PER ns 11', classSun: '5', resultSun: 'Ex 1, CAGCIB', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '7.', cat: 'KCH FALCON KLAN PUCHATYCH*PL', sex: '1,0', emsSat: 'PER as 24 62', classSat: '12', resultSat: 'Ex 1, CACC, NOM, BIS', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'PER as 24 62', classSun: '12', resultSun: 'Ex 1, CACC, NOM', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '8.', cat: 'SP, SC NW PL*JANTAR WILLIAM DSM DSW', sex: '1,0', emsSat: 'PER d 03', classSat: '17', resultSat: '1, NOM, BIS', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'PER d 03', classSun: '2', resultSun: 'PH, NOM, BIS', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    // Přidáno pro kompletnost
    { no: '9.', cat: 'SP REMU-MARTIN`S JOKER', sex: '1,0', emsSat: 'PER e 03 22', classSat: '2', resultSat: 'PH, NOM, BIS', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'PER e 03 22', classSun: '2', resultSun: 'BEZ OCENY', judgeSun: 'Mrs. Annika Berner SE', group: 'cat1' },
    { no: '10.', cat: 'CH SUZI MARTELLO*PL', sex: '0,1', emsSat: 'RAG a', classSat: '10', resultSat: 'Ex 1, CAP', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'RAG a', classSun: '10', resultSun: 'Ex 1, CAP, NOM', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '11.', cat: 'CH PL*ARINGAROS MARS', sex: '1,0', emsSat: 'RAG n 03', classSat: '7', resultSat: 'Ex 1, CACIB, NOM', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'RAG n 03', classSun: '7', resultSun: 'Ex 1, CACIB, NOM', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '12.', cat: 'KCH JOANNA BLUE OF BLUE-SUPRISE*PL', sex: '0,1', emsSat: 'RAG n 03', classSat: '12', resultSat: 'Ex 1, CACC, NOM', judgeSat: 'Mrs. Annika Berner SE', emsSun: 'RAG n 03', classSun: '12', resultSun: 'Ex 1, CACC, NOM', judgeSun: 'Mrs. Eva Porat SE', group: 'cat1' },
    { no: '13.', cat: 'JCH, PREMIÉR DK MAINE MALAWI`S BLUE VELVET', sex: '0,1', emsSat: 'RAG a 03', classSat: '8', resultSat: 'Ex 1, CAPIB, NOM, BIS', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'RAG a 03', classSun: '8', resultSun: 'Ex 1, CAPIB, NOM, BIS', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '14.', cat: 'CH JCH KCH NELLY SŁODKIE KOCIAKI*PL', sex: '0,1', emsSat: 'RAG a 03', classSat: '7', resultSat: 'Ex 1, CACIB, BIV, NOM, BIS', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'RAG a 03', classSun: '7', resultSun: 'Ex 1, CACIB, NOM, BIS', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '15.', cat: 'PL*BLUEBALOON RUBY', sex: '0,1', emsSat: 'RAG a 03', classSat: '11', resultSat: 'ABS', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'RAG a 03', classSun: '11', resultSun: 'ABS', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '16.', cat: 'KCH ROXY SŁODKIE KOCIAKI*PL', sex: '0,1', emsSat: 'RAG a 03', classSat: '11', resultSat: 'Ex 1, CACJ, NOM', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'RAG a 03', classSun: '11', resultSun: 'Ex 1, CACJ', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },
    { no: '17.', cat: 'FRECKLESS MJ AMELIA GECKO, CZ', sex: '1,0', emsSat: 'RAG a 03', classSat: '12', resultSat: 'Ex 1, CACC', judgeSat: 'Mrs. Eva Porat SE', emsSun: 'RAG a 03', classSun: '12', resultSun: 'Ex 1, CACC, NOM, BIS', judgeSun: 'Mrs. Daria Łukasik-Weber PL', group: 'cat1' },

];
// -----------------------------------------------------------------

/**
 * NOVÁ KOMPONENTA: Zobrazuje detailní tabulku posuzování pro konkrétního porotce a den.
 */
const JudgeReportDetail = ({ judgeName, date }) => {
    // --- STATICKÁ DATA Z TVÉHO HTML PROTOTYPU ---
    const reportData = [
        { no: 1, ems: 'EXO n', sex: '1,0', class: 1, born: '2023-05-04', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'PH' },
        { no: 7, ems: 'PER as 24 62', sex: '1,0', class: 12, born: '2025-05-09', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC, NOM' },
        { no: 9, ems: 'PER e 03 22', sex: '1,0', class: 2, born: '2023-07-17', AdM: '', AdF: '', NeM: 'X', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'PH, NOM' },
        { no: 14, ems: 'RAG a 03', sex: '0,1', class: 7, born: '2024-07-24', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACIB, BIV, NOM' },
        { no: 15, ems: 'RAG a 03', sex: '0,1', class: 11, born: '2025-01-09', AdM: '', AdF: 'X', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'ABS' },
        { no: 16, ems: 'RAG a 03', sex: '0,1', class: 11, born: '2025-02-17', AdM: '', AdF: '', NeM: 'X', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACJ, NOM' },
        { no: 17, ems: 'RAG a 03', sex: '1,0', class: 12, born: '2025-07-10', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC' },
        { no: 18, ems: 'RAG a 03', sex: '0,1', class: 12, born: '2025-07-10', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACC, NOM' },
        { no: 19, ems: 'RAG a 03', sex: '0,1', class: 12, born: '2025-05-26', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 2' },
        { no: 20, ems: 'RAG a 03', sex: '0,1', class: 12, born: '2025-04-09', AdM: '', AdF: '', NeM: '', NeF: 'X', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 3' },
        { no: 13, ems: 'RAG a 03', sex: '0,1', class: 8, born: '2024-07-30', AdM: '', AdF: '', NeM: 'X', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CAPIB, NOM' },
        { no: 38, ems: 'SBI a', sex: '1,0', class: 5, born: '2024-03-15', AdM: 'X', AdF: '', NeM: '', NeF: '', '11M': '', '11F': '', '12M': '', '12F': '', results: 'Ex 1, CACGIB, NOM' },
    ];

    // Sloupce pro dynamické renderování
    const columns = [
        { key: 'no', label: 'No.', align: 'center' },
        { key: 'ems', label: 'EMS', align: 'left' },
        { key: 'sex', label: 'Sex', align: 'center' },
        { key: 'class', label: 'Class', align: 'center' },
        { key: 'born', label: 'Born', align: 'center' },
        { key: 'AdM', label: 'Ad M', align: 'center', highlight: true },
        { key: 'AdF', label: 'Ad F', align: 'center', highlight: true },
        { key: 'NeM', label: 'Ne M', align: 'center', disabled: true },
        { key: 'NeF', label: 'Ne F', align: 'center', disabled: true },
        { key: '11M', label: '11 M', align: 'center', highlight: true },
        { key: '11F', label: '11 F', align: 'center', highlight: true },
        { key: '12M', label: '12 M', align: 'center' },
        { key: '12F', label: '12 F', align: 'center' },
        { key: 'results', label: 'Results', align: 'left' },
    ];

    const catsTotal = reportData.length;

    return (
        <div className="p-6">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 mb-6 text-left">
                {judgeName} — {date} — Category 1
            </h2>

            {/* Table Scroll Container */}
            <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse text-sm min-w-[1200px]">
                    <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className={`
                                        bg-[#027BFF] text-white p-2 font-semibold text-center whitespace-nowrap 
                                        ${col.disabled ? 'line-through opacity-80' : ''}
                                    `}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {reportData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            {columns.map(col => (
                                <td
                                    key={col.key}
                                    className={`
                                            p-2 border border-gray-200 text-${col.align} 
                                            ${col.highlight ? 'bg-blue-50/70' : 'bg-white'} 
                                            ${row[col.key] === 'X' ? 'font-bold text-[#027BFF]' : ''}
                                        `}
                                >
                                    {/* Přístup k datům přes klíč sloupce */}
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-gray-500 text-sm text-left">
                Cats total: {catsTotal}
            </p>
        </div>
    );
};

// =========================================================================

export default function Catalog() {
    const [tab, setTab] = useState<"info" | "primary" | "secondary">("info");
    const [activeTab, setActiveTab] = useState<'cat1' | 'cat2' | 'cat3' | 'cat4'>('cat1');
    const t = (key: string, defaultValue: string) => defaultValue;

    // ZAPAMATOVANÝ STAV MODALU
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [modalJudge, setModalJudge] = useState<string | null>(null);

    // FUNKCE OPEN MODAL
    const openModal = (date: string, judgeName: string | null = null) => {
        setModalDate(date);
        setModalJudge(judgeName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalDate(null);
        setModalJudge(null);
    };
    // -------------------------

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            {/* TOP INFO – NAME + DATE + LOCATION (Nezměněno) */}
            <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 border-b border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-[-4px] text-gray-900 mb-4">
                    MVK Praha Winter
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 gap-3 text-gray-700">
                    {/* DATE */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-[#027BFF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2
                                       2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">14. 12. 2025 – 15. 12. 2025</p>
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-[#027BFF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 11a3 3 0 110-6 3 3 0 010 6zm0 0c-4.418
                                       0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">PVA Expo Letňany, Praha</p>
                    </div>
                </div>
            </div>

            {/* TABS (Upraveno pro responzivitu) */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <div className="flex gap-2 sm:gap-4 md:gap-8 justify-start">

                    {/* INFO */}
                    <button
                        onClick={() => setTab("info")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition
            ${tab === "info" ? "bg-[#027BFF] text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                        <svg className={`w-4 h-4 ${tab === "info" ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M11.5 12h1v4h-1" /></svg>
                        Informace
                    </button>

                    {/* PRIMARY */}
                    <button
                        onClick={() => setTab("primary")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition
        ${tab === "primary" ? "bg-[#027BFF] text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                        <svg className={`w-4 h-4 ${tab === "primary" ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
                        Primární katalog
                    </button>

                    {/* SECONDARY */}
                    <button
                        onClick={() => setTab("secondary")}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-semibold tracking-[-1px] transition
        ${tab === "secondary" ? "bg-[#027BFF] text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                        <svg className={`w-4 h-4 ${tab === "secondary" ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
                        Sekundární katalog
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="max-w-6xl mx-auto px-4 mt-10">

                {/* TAB 1 – INFORMACE */}
                {tab === "info" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* ABOUT */}
                            <section className="text-left">
                                <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-2">
                                    Informace
                                </h2>
                                <p className="text-gray-600 mt-4 leading-relaxed">
                                    Tato prestižní mezinárodní výstava koček "MVVK Praha Winter" je vyvrcholením celoročního úsilí chovatelů a milovníků koček z celé Evropy. Akce je ideální příležitostí pro veřejnost, aby se seznámila s různými plemeny, promluvila si s chovateli o péči a genetice a získala cenné rady pro své vlastní mazlíčky. Dva dny plné soutěží nabízejí možnost získat cenné certifikáty, které jsou klíčové pro získání mezinárodního titulu šampiona. Posuzování probíhá pod dohledem mezinárodně uznávaných porotců, kteří pečlivě hodnotí stav srsti, kondici, typ a temperament každého zvířete.
                                </p>
                            </section>

                            {/* SCHEDULE */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-2">
                                    Harmonogram
                                </h2>

                                <div className="flex flex-col gap-6">

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-10 bg-[#027BFF]/10 text-[#027BFF] font-bold text-sm flex items-center justify-center rounded-lg">
                                            08:00
                                        </div>
                                        <p className="text-gray-800 font-medium">Veterinární prohlídka</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-10 bg-[#027BFF]/10 text-[#027BFF] font-bold text-sm flex items-center justify-center rounded-lg">
                                            10:00
                                        </div>
                                        <p className="text-gray-800 font-medium">Zahájení posuzování</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-10 bg-[#027BFF]/10 text-[#027BFF] font-bold text-sm flex items-center justify-center rounded-lg">
                                            16:00
                                        </div>
                                        <p className="text-gray-800 font-medium">Výstava</p>
                                    </div>

                                </div>
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="space-y-8">

                            {/* REGISTRATION STATUS */}
                            <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#027BFF] to-[#005fcc] text-white">
                                <h3 className="text-lg font-semibold mb-3">Registrace</h3>

                                <p className="text-3xl font-bold tracking-[-1px] mb-2">156 / 250</p>

                                <div className="w-full h-2 bg-white/30 rounded-full mb-3 overflow-hidden">
                                    <div className="h-full bg-white rounded-full" style={{ width: "62%" }}></div>
                                </div>

                                <p className="text-sm text-white/90 mb-5">
                                    Místa se zaplňují! Zaregistrujte své kočky.
                                </p>

                                <Link
                                    to="/entries"
                                    className="block w-full text-center py-2.5 bg-white text-[#027BFF] tracking-[-1px] font-semibold rounded-full border-2 border-white hover:bg-transparent hover:text-white transition-all"
                                >
                                    Registrovat
                                </Link>
                            </div>

                            {/* ORGANIZER */}
                            <div className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40">

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#027BFF]/10 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-[#027BFF]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 21a7.5 7.5 0 00-15 0"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 tracking-[-1px]">
                                        Organizátor
                                    </h3>
                                </div>

                                <p className="font-semibold text-gray-800 mb-1 text-left">SO Ostrava</p>
                                <p className="text-sm text-gray-600 text-left">fife-ostrava.cz</p>

                                <Link
                                    to="/entries"
                                    className="block w-full text-center py-2.5 mt-2 bg-white text-[#027BFF] font-semibold rounded-full border-2 border-[#027BFF] tracking-[-1px] hover:bg-[#027BFF] hover:text-white transition-all duration-300"
                                >
                                    Kontaktovat
                                </Link>
                            </div>
                        </aside>
                    </div>
                )}

                {/* TAB 2 – PRIMARY CATALOG (Nezměněno) */}
                {tab === "primary" && (
                    <div className="py-10">
                        <h2 className="text-xl font-bold tracking-[-1px] mb-6">Primární katalog</h2>
                        <p>Obsah Primárního katalogu zde chybí, ale Modal bude fungovat nezávisle.</p>
                    </div>
                )}

                {/* TAB 3 – SECONDARY CATALOG 🔥 S DOPLNĚNÝMI SEKCEMI 3 a 4 🔥 */}
                {tab === "secondary" && (
                    <div className="py-10 space-y-8">

                        {/* 1. Cat Show Info BOX (Judge & Colours Assignment) */}
                        <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-left">
                                <h2 className="text-xl font-semibold text-gray-900">Cat Show: FP – Poznań</h2>
                                <p className="text-sm text-gray-500">
                                    Date: 2025–11–15 &amp; 2025–11–16
                                </p>
                            </div>

                            <div className="text-sm text-gray-700 text-left sm:text-right">
                                <p className="font-semibold">Judges &amp; colours:</p>
                                <div className="flex flex-wrap gap-3 mt-1 sm:justify-end">
                                    <a
                                    href="#"
                                    onClick={(e) => {e.preventDefault(); openModal("2025–11–15", null);}}
                                    className="text-[#027BFF] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                    [2025–11–15]
                                </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {e.preventDefault(); openModal("2025–11–16", null);}}
                                        className="text-[#027BFF] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                        [2025–11–16]
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* 2. Judges' reports BOX (Tlačítka volají openModal s jménem) */}
                        <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 px-6 sm:px-8 py-6">
                            <div className="flex items-baseline justify-between mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold tracking-[-1px] text-gray-900">
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
                                            {/* Tlačítko pro DETAILNÍ REPORT (předává judgeName) */}
                                            <a
                                                href="#" // Standardní prvek <a> vyžaduje href="#" pro správné chování.
                                                onClick={(e) => {e.preventDefault(); openModal("2025-11-15", j.name);}}
                                                className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap bg-transparent p-0 cursor-pointer focus:ring-0 focus:outline-none">
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
                                            {/* Tlačítko pro DETAILNÍ REPORT (předává judgeName) */}
                                            <a
                                                href="#" // Standardní prvek <a> vyžaduje href="#" pro správné chování.
                                                onClick={(e) => {e.preventDefault(); openModal("2025-11-15", j.name);}}
                                                className="text-xs sm:text-sm text-[#027BFF] font-semibold hover:underline whitespace-nowrap bg-transparent p-0 cursor-pointer focus:ring-0 focus:outline-none">
                                                [2025–11–15]
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. Nominations BOX 🔥 DOPLNĚNO 🔥 */}
                        <section className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 px-6 sm:px-8 py-6">
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
                                                    className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF] focus:outline-none focus:ring-0"
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
                                                    className="font-medium text-gray-900 border-b border-dashed border-gray-900 hover:text-[#027BFF] hover:border-[#027BFF] focus:outline-none focus:ring-0"
                                                >
                                                    [{cat}]
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Quick catalogue & results BOX 🔥 DOPLNĚNO S DYNAMICKÝM MAPOVÁNÍM 🔥 */}
                        <div className="backdrop-blur-2xl bg-white/30 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/40 p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 tracking-[-1px] text-left">
                                Quick catalogue & results
                            </h3>

                            {/* Zde by měla být logika pro interní taby (cat1, cat2...) z Catalog.js. Použiji jen aktivní část: */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {/* Ponecháno pro ilustraci, lze nahradit mapováním kategorií */}
                                {['[cat 1]', '[cat 2]', '[cat 3]', '[cat 4]', '[HGS/HCL]', '[XSH/XLH]', '[ALL]'].map((label, i) => (
                                    <button
                                        key={i}
                                        className={`px-3 py-1.5 text-sm rounded-lg font-semibold whitespace-nowrap transition
                                            ${label === '[cat 1]' ? 'bg-[#027BFF] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`
                                        }
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

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

                                    {/* 🔥 Dynamické řádky z catalogueData 🔥 */}
                                    <tbody>
                                    {catalogueData.map((row) => (
                                        <tr key={row.no} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{row.no}</td>
                                            <td className="p-2 font-semibold">{row.cat}</td>
                                            <td className="p-2 text-center">{row.sex}</td>
                                            <td className="p-2">{row.emsSat}</td>
                                            <td className="p-2 text-center">{row.classSat}</td>
                                            <td className="p-2">{row.resultSat}</td>
                                            <td className="p-2">{row.judgeSat}</td>
                                            <td className="p-2">{row.emsSun}</td>
                                            <td className="p-2 text-center">{row.classSun}</td>
                                            <td className="p-2">{row.resultSun}</td>
                                            <td className="p-2">{row.judgeSun}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE CARDS */}
                            <div className="md:hidden flex flex-col gap-4">
                                {/* 🔥 Dynamické karty z catalogueData 🔥 */}
                                {catalogueData.map((row) => (
                                    <details key={row.no} className="border rounded-xl shadow-sm p-4">
                                        <summary className="font-semibold cursor-pointer text-left">#{row.no} — {row.cat}</summary>
                                        <p className="text-gray-500 text-sm mt-1 text-left">Sex: {row.sex} • EMS: {row.emsSat} • Class: {row.classSat}</p>
                                        <div className="mt-3 border-t pt-3 text-sm space-y-1 text-left">
                                            <p className="font-semibold text-[#027BFF]">Saturday</p>
                                            <p><span className="font-semibold">Result:</span> {row.resultSat}</p>
                                            <p><span className="font-semibold">Judge:</span> {row.judgeSat}</p>
                                            <p className="font-semibold text-[#027BFF]">Sunday</p>
                                            <p><span className="font-semibold">Result:</span> {row.resultSun}</p>
                                            <p><span className="font-semibold">Judge:</span> {row.judgeSun}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ======================================================= */}
            {/* 🔥 MODAL WINDOW 🔥                                   */}
            {/* ======================================================= */}
            {isModalOpen && modalDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    {/* Překrytí s efektem rozmazání (BLUR) */}
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Vlastní obsah Modalu */}
                    <div className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-7xl max-h-[95vh] overflow-y-auto">

                        {/* Tlačítko Zavřít */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full border-2 border-[#027BFF] text-[#027BFF] font-semibold bg-transparent transition-all duration-200 hover:bg-[#027BFF] hover:text-white hover:shadow-lg">
                            Zavřít
                        </button>

                        {/* PODMÍNKA PRO ZOBRAZENÍ OBSAHU: */}
                        {modalJudge ? (
                            // 1. ZOBRAZÍ DETAILNÍ REPORT POROTCE (JudgeReportDetail)
                            <JudgeReportDetail judgeName={modalJudge} date={modalDate} />
                        ) : (
                            // 2. ZOBRAZÍ PŘIDĚLENÍ POROTCŮ A PLEMEN (Judge & Colours Assignment Table)
                            <div className="p-6 pt-10">
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 mb-6">
                                    Přidělení porotců a plemen pro — {modalDate}
                                </h2>

                                {/* 🔥 VLOŽENÁ ŠIROKÁ TABULKA: Judge & Colours Assignment Table 🔥 */}
                                <div className="overflow-x-auto pb-4">
                                    <table className="min-w-[1300px] w-full border-collapse text-sm bg-gray-50">
                                        <thead>
                                        <tr>
                                            {/* Hlavička tabulky s modrým pozadím a bílým textem */}
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Eva Porat SE</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Annika Berner SE</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Manuela Centamore IT</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Daria Łukasik-Weber PL</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Anne-Louise Nygaard Sadek DK</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mr. Juan José Martinez Vizcaino ES</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mr. Kristof Van Roy BE</th>
                                            <th className="bg-[#027BFF] p-3 font-semibold text-white border border-gray-200 text-center whitespace-nowrap">Mrs. Anna Wilczek PL</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <tr>
                                            {/* Eva Porat */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>EXO n</span>
                                                    <span>PER as 24 62</span>
                                                    <span>PER e 03 22</span>
                                                    <span>RAG a 03</span>
                                                    <span>SBI a</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>MCO 7 (11,12)</span>
                                                    <span>MCO 8 (Adult)</span>
                                                    <span>NFO miot</span>
                                                    <span>NFO 1</span>
                                                    <span>NFO 7</span>
                                                    <span>NFO 8</span>
                                                    <span>SIB 3</span>
                                                </div>
                                            </td>

                                            {/* Annika Berner */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>PER ns 11</span>
                                                    <span>PER d 03</span>
                                                    <span>RAG a</span>
                                                    <span>RAG n 03</span>
                                                    <span>RAG d 03</span>
                                                    <span>RAG e 03</span>
                                                    <span>RAG n 04</span>
                                                    <span>RAG a 04</span>
                                                    <span>TUV a 21 63</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>MCO 2</span>
                                                    <span>MCO 6</span>
                                                    <span>MCO 9</span>
                                                    <span>NEM 4</span>
                                                    <span>NFO 2</span>
                                                </div>
                                            </td>

                                            {/* Manuela Centamore */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>BEN n 24 32</span>
                                                    <span>BEN n 24 33</span>
                                                    <span>BLH a</span>
                                                    <span>BSH b</span>
                                                    <span>BSH c</span>
                                                    <span>BUR b</span>
                                                    <span>BUR d</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>CRX 9</span>
                                                    <span>DRX miot</span>
                                                    <span>DRX 5</span>
                                                    <span>DRX 6</span>
                                                    <span>RUS (11,12)</span>
                                                    <span>SIA n</span>
                                                    <span>SIA n 03 21</span>
                                                    <span>SPH 1</span>
                                                    <span>SPH 3</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>HCL</span>
                                                    <span>HCS</span>
                                                </div>
                                            </td>

                                            {/* Daria Weber */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>EXO n 22</span>
                                                    <span>EXO n 33</span>
                                                    <span>PER n</span>
                                                    <span>RAG n 03 21</span>
                                                    <span>RAG a 03 21</span>
                                                    <span>RAG a 04 21</span>
                                                    <span>RAG miot</span>
                                                    <span>TUV f 63</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>NFO 3</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>BEN n 24</span>
                                                    <span>BLH h</span>
                                                    <span>BLH f 03</span>
                                                    <span>BML 1</span>
                                                    <span>BSH e</span>
                                                    <span>BSH f</span>
                                                    <span>BSH d 03</span>
                                                    <span>BSH p 01 62</span>
                                                    <span>BUR h</span>
                                                    <span>CHA</span>
                                                    <span>KBL 3</span>
                                                </div>
                                            </td>

                                            {/* Sadek DK */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>LPL 10</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>MCO miot</span>
                                                    <span>MCO 5 (11,12)</span>
                                                    <span>MCO 7 (Adult)</span>
                                                    <span>MCO 8 (11,12)</span>
                                                    <span>NEM 1</span>
                                                    <span>NEM 3</span>
                                                    <span>NFO 6</span>
                                                    <span>SIB miot</span>
                                                    <span>SIB 4</span>
                                                </div>
                                            </td>

                                            {/* Martinez Vizcaino */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>MCO 1</span>
                                                    <span>MCO 3</span>
                                                    <span>MCO 5 (Adult)</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>BLH d</span>
                                                    <span>BSH a</span>
                                                    <span>BSH h</span>
                                                    <span>BSH a 03</span>
                                                    <span>BSH b 03</span>
                                                    <span>BSH qs 03</span>
                                                    <span>BSH o</span>
                                                    <span>BSH p</span>
                                                    <span>BUR n</span>
                                                    <span>BUR g</span>
                                                    <span>KBL 2</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>DRX 7</span>
                                                    <span>SPH miot</span>
                                                    <span>SPH 4</span>
                                                </div>
                                            </td>

                                            {/* Kristof Van Roy */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>MCO 4</span>
                                                    <span>NEM 2</span>
                                                    <span>NEM 5</span>
                                                    <span>NEM 6</span>
                                                    <span>NFO 5</span>
                                                    <span>NFO 9</span>
                                                    <span>SIB 5</span>
                                                    <span>SIB 6</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>ABY p</span>
                                                    <span>CRX 3</span>
                                                    <span>DRX 3</span>
                                                    <span>DRX 4</span>
                                                    <span>DRX 8</span>
                                                    <span>DSP 4</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>OSH n 01</span>
                                                    <span>RUS (Adult)</span>
                                                </div>
                                            </td>

                                            {/* Anna Wilczek */}
                                            <td className="p-3 border border-gray-200 align-top">
                                                <div className="flex flex-col gap-1 items-center py-2">
                                                    <span>NFO 4</span>
                                                    <div className="w-1/2 h-px bg-gray-500 my-1"></div>
                                                    <span>ABY n</span>
                                                    <span>ABY o</span>
                                                    <span>CRX 1</span>
                                                    <span>CRX 2</span>
                                                    <span>DRX 1</span>
                                                    <span>DSP 5</span>
                                                    <span>OSH f 24</span>
                                                    <span>OSH n 25</span>
                                                    <span>RUS miot</span>
                                                    <span>SPH 2</span>
                                                    <span>SPH 5</span>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}