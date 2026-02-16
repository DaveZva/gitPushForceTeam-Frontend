import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registrationApi, QuickCatalogEntry, PublicShowDetail } from "../services/api/registrationApi";
import { secretariatApi, SecretariatJudge } from "../services/api/secretariatApi";

const BREED_NAMES: Record<string, string> = {
    EXO: 'Exotic Shorthair', PER: 'Persian', RAG: 'Ragdoll', SBI: 'Birman (Sacred Birman)', MCO: 'Maine Coon',
    ACL: 'American Curl Longhair', NFO: 'Norwegian Forest Cat', SIB: 'Siberian', BSH: 'British Shorthair',
    BUR: 'Burmese', BEN: 'Bengal', ABY: 'Abyssinian', SIA: 'Siamese', OSH: 'Oriental Shorthair', SPH: 'Sphynx',
};

const FIFE_CATEGORIES: Record<string, { name: string; index: number; ems: string }> = {
    'EXO': { name: 'Long and Semi-longhaired cats', index: 1, ems: 'I.' },
    'PER': { name: 'Long and Semi-longhaired cats', index: 1, ems: 'I.' },
    'RAG': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'SBI': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'MCO': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'ACL': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'NFO': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'SIB': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'TUV': { name: 'Semi-longhaired cats', index: 2, ems: 'II.' },
    'BEN': { name: 'Shorthaired cats', index: 3, ems: 'III.' },
    'BSH': { name: 'Shorthaired cats', index: 3, ems: 'III.' },
    'BUR': { name: 'Shorthaired cats', index: 3, ems: 'III.' },
    'ABY': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
    'SIA': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
    'OSH': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
    'SPH': { name: 'Siamo-Orientale cats', index: 4, ems: 'IV.' },
};

interface CatEntry {
    cat: {
        entryNumber: number; name: string; ems: string; sex: string; dob: string;
        regNumber: string; father: string; mother: string; owner: string;
        breeder: string; breederCountry: string;
    };
    category: string; colour: string; class: string; group: string | null;
}

const formatTime = (isoString?: string) => isoString ? new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";
const formatDate = (isoString?: string) => isoString ? new Date(isoString).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) : "";

const JudgeReportDetail = ({ showId, judgeId, date }: { showId: string | number; judgeId: number; date: string }) => {
    const { t } = useTranslation();
    const [sheets, setSheets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSheets = async () => {
            try {
                const data = await secretariatApi.getJudgeSheets(showId, judgeId, date);
                setSheets(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadSheets();
    }, [showId, judgeId, date]);

    const columns = [
        { key: 'no', label: 'No.', align: 'center' },
        { key: 'ems', label: 'EMS', align: 'left' },
        { key: 'sex', label: 'Sex', align: 'center' },
        { key: 'class', label: 'Class', align: 'center' },
        { key: 'born', label: 'Born', align: 'center' },
        { key: 'AdM', label: 'Ad M', align: 'center' },
        { key: 'AdF', label: 'Ad F', align: 'center' },
        { key: 'NeM', label: 'Ne M', align: 'center', disabled: true },
        { key: 'NeF', label: 'Ne F', align: 'center', disabled: true },
        { key: '11M', label: '11 M', align: 'center' },
        { key: '11F', label: '11 F', align: 'center' },
        { key: '12M', label: '12 M', align: 'center' },
        { key: '12F', label: '12 F', align: 'center' },
        { key: 'results', label: 'Results', align: 'left' },
    ];

    if (loading) return <div className="p-10 text-center">{t('catalog.loading')}</div>;

    return (
        <div className="p-6">
            <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse text-[11px] min-w-[1200px]">
                    <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className={`bg-[#027BFF] text-white p-2 font-bold border border-blue-600 whitespace-nowrap ${col.disabled ? 'line-through opacity-60' : ''}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sheets.map((row, idx) => {
                        const ems = row.catEntry?.cat?.emsCode || row.emsCode;
                        const showClass = row.catEntry?.showClass || row.showClass;
                        const born = row.catEntry?.cat?.birthDate || row.birthDate;
                        const gender = row.catEntry?.cat?.gender || row.gender;
                        const isMale = gender === 'MALE';
                        const isNeuter = row.catEntry?.neutered || row.neutered;

                        const getMark = (colKey: string) => {
                            if (showClass === '11' && colKey === (isMale ? '11M' : '11F')) return 'X';
                            if (showClass === '12' && colKey === (isMale ? '12M' : '12F')) return 'X';
                            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'OPEN', 'CHAMPION', 'PREMIER'].includes(showClass)) {
                                if (isNeuter) return colKey === (isMale ? 'NeM' : 'NeF') ? 'X' : '';
                                return colKey === (isMale ? 'AdM' : 'AdF') ? 'X' : '';
                            }
                            return '';
                        };

                        return (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-2 border text-center font-bold">{row.catalogNumber}</td>
                                <td className="p-2 border text-left font-medium">{ems}</td>
                                <td className="p-2 border text-center">{isMale ? '1,0' : '0,1'}</td>
                                <td className="p-2 border text-center">{showClass?.replace(/_/g, ' ')}</td>
                                <td className="p-2 border text-center">{born}</td>
                                {['AdM', 'AdF', 'NeM', 'NeF', '11M', '11F', '12M', '12F'].map(c => (
                                    <td key={c} className={`p-2 border text-center font-bold ${getMark(c) ? 'text-[#027BFF] bg-blue-50/50' : ''} ${ (c === 'NeM' || c === 'NeF') ? 'line-through text-gray-300' : ''}`}>
                                        {getMark(c)}
                                    </td>
                                ))}
                                <td className="p-2 border text-left italic text-gray-400">In Progress</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-gray-500 text-sm text-left">{t('catalog.totalCats')}: {sheets.length}</p>
        </div>
    );
};

const PrimaryCatalogueContent = ({ showId }: { showId: string | number }) => {
    const { t } = useTranslation();
    const [catalogData, setCatalogData] = useState<CatEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const apiData = await registrationApi.getCatalog(showId);
                setCatalogData(apiData.map(dto => ({
                    cat: { entryNumber: dto.entryNumber, name: dto.name, ems: dto.ems, sex: dto.sex, dob: dto.birthDate, regNumber: dto.registrationNumber, father: dto.father, mother: dto.mother, owner: dto.ownerName, breeder: dto.breederName, breederCountry: dto.breederCountry },
                    category: dto.category, colour: dto.color, class: dto.className, group: dto.group
                })));
            } catch (err) { console.error(err); }
            finally { setIsLoading(false); }
        };
        load();
    }, [showId]);

    const groupedData = useMemo(() => {
        const grouped = new Map<number, Map<string, Map<string, Map<string, CatEntry[]>>>>();
        catalogData.forEach(entry => {
            const fifeCat = FIFE_CATEGORIES[entry.category];
            const primaryKey = fifeCat ? fifeCat.index : 99;
            if (!grouped.has(primaryKey)) grouped.set(primaryKey, new Map());
            const byCategory = grouped.get(primaryKey)!;
            if (!byCategory.has(entry.category)) byCategory.set(entry.category, new Map());
            const byBreed = byCategory.get(entry.category)!;
            if (!byBreed.has(entry.colour)) byBreed.set(entry.colour, new Map());
            const byColour = byBreed.get(entry.colour)!;
            if (!byColour.has(entry.class)) byColour.set(entry.class, []);
            byColour.get(entry.class)!.push(entry);
        });
        return new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]));
    }, [catalogData]);

    if (isLoading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#027BFF]"></div></div>;

    return (
        <div className="space-y-12 text-left font-sans tracking-tight text-gray-900">
            {Array.from(groupedData.entries()).map(([catIndex, byBreed]) => (
                <div key={catIndex} className="mt-12 p-6 bg-white rounded-xl shadow-lg border-t-8 border-[#027BFF]">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-[-2px] text-gray-900 border-b border-gray-200 pb-4 mb-6">
                        {t('catalog.category')} {catIndex === 99 ? t('catalog.categoryOther') : catIndex}
                    </h1>
                    {Array.from(byBreed.entries()).map(([breedName, byColour]) => (
                        <div key={breedName} className="mt-8 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-2 mb-6 text-left">
                                {BREED_NAMES[breedName] || breedName} <span className="text-[#027BFF]">({breedName})</span>
                            </h2>
                            {Array.from(byColour.entries()).map(([colourName, byClass]) => (
                                <div key={colourName} className="mt-6 bg-blue-50/30 p-4 rounded-xl">
                                    <h3 className="text-lg font-bold text-[#027BFF] mb-4 text-left">EMS: {colourName}</h3>
                                    {Array.from(byClass.entries()).map(([className, entries]) => (
                                        <div key={className} className="mb-6 last:mb-0">
                                            <h4 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-200 mb-4">{className}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {entries.map(e => (
                                                    <div key={e.cat.entryNumber} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                                        <div className="flex justify-between items-start mb-2 text-left">
                                                            <span className="font-bold text-[#027BFF] text-lg">{e.cat.entryNumber}. {e.cat.name}</span>
                                                            {e.group && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">GR {e.group}</span>}
                                                        </div>
                                                        <div className="text-xs text-gray-500 space-y-1 text-left">
                                                            <p><strong>EMS:</strong> {e.cat.ems} | <strong>Sex:</strong> {e.cat.sex} | <strong>Born:</strong> {e.cat.dob}</p>
                                                            <div className="pt-2 mt-2 border-t border-gray-50 space-y-1">
                                                                <p className="truncate"><strong>Father:</strong> {e.cat.father}</p>
                                                                <p className="truncate"><strong>Mother:</strong> {e.cat.mother}</p>
                                                                <p><strong>Owner:</strong> {e.cat.owner} | <strong>Breeder:</strong> {e.cat.breeder} ({e.cat.breederCountry})</p>
                                                                <p className="text-[10px] text-gray-400">Reg: {e.cat.regNumber}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default function Catalog() {
    const { t } = useTranslation();
    const { showId } = useParams<{ showId: string }>();
    const [tab, setTab] = useState<"info" | "primary" | "secondary">("info");
    const [showInfo, setShowInfo] = useState<PublicShowDetail | null>(null);
    const [judges, setJudges] = useState<SecretariatJudge[]>([]);
    const [quickEntries, setQuickEntries] = useState<QuickCatalogEntry[]>([]);
    const [activeQuickFilter, setActiveQuickFilter] = useState<number | 'ALL'>('ALL');
    const [modal, setModal] = useState<{ isOpen: boolean; date: string; judge?: SecretariatJudge }>({ isOpen: false, date: "" });

    useEffect(() => {
        const id = showId || 1;
        const load = async () => {
            try {
                const [info, jList, quick] = await Promise.all([
                    registrationApi.getShowInfo(id),
                    secretariatApi.getJudgesByShow(id),
                    registrationApi.getQuickCatalog(id)
                ]);
                setShowInfo(info); setJudges(jList); setQuickEntries(quick);
            } catch (err) { console.error(err); }
        };
        load();
    }, [showId]);

    const capacityPercentage = useMemo(() => showInfo ? Math.min((showInfo.occupiedSpots / showInfo.maxCats) * 100, 100) : 0, [showInfo]);
    const filteredQuick = useMemo(() => quickEntries.filter(e => activeQuickFilter === 'ALL' || e.category === activeQuickFilter).sort((a,b) => a.catalogNumber - b.catalogNumber), [quickEntries, activeQuickFilter]);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 font-sans tracking-tight text-gray-900">
            {!showInfo ? <div className="py-24 text-center">{t('catalog.loading')}</div> : (
                <>
                    <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 border-b border-gray-200">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-2px] text-gray-900 mb-4 text-left">{showInfo.name}</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 gap-3 text-gray-700">
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-medium">{formatDate(showInfo.startDate)} – {formatDate(showInfo.endDate)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-medium">{showInfo.venueName}, {showInfo.venueCity}</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 mt-8">
                        <div className="flex gap-4 justify-start">
                            {["info", "primary", "secondary"].map(id => (
                                <button key={id} onClick={() => setTab(id as any)} className={`px-4 py-2 text-sm rounded-xl font-semibold transition ${tab === id ? "bg-[#027BFF] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{t(`catalog.tab${id.charAt(0).toUpperCase() + id.slice(1)}`)}</button>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 mt-10">
                        {tab === "info" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-10">
                                    <section className="text-left">
                                        <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-2">{t('catalog.infoTitle')}</h2>
                                        <div className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">{showInfo.description}</div>
                                    </section>
                                    <section>
                                        <h2 className="text-xl font-bold text-gray-900 tracking-[-1px] mb-4 text-left">{t('catalog.schedule')}</h2>
                                        <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            {showInfo.vetCheckStart && <div className="flex items-center gap-4"><div className="w-16 h-10 bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center rounded-lg">{formatTime(showInfo.vetCheckStart)}</div><p className="text-gray-800 font-medium text-left">{t('catalog.vetCheck')}</p></div>}
                                            {showInfo.judgingStart && <div className="flex items-center gap-4"><div className="w-16 h-10 bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center rounded-lg">{formatTime(showInfo.judgingStart)}</div><p className="text-gray-800 font-medium text-left">{t('catalog.judgingStart')}</p></div>}
                                            {showInfo.judgingEnd && <div className="flex items-center gap-4"><div className="w-16 h-10 bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center rounded-lg">{formatTime(showInfo.judgingEnd)}</div><p className="text-gray-800 font-medium text-left">{t('catalog.showOpen')}</p></div>}
                                        </div>
                                    </section>
                                </div>
                                <aside className="space-y-8">
                                    <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-[#027BFF] to-[#005fcc] text-white">
                                        <h3 className="text-lg font-semibold mb-3 text-left">{t('catalog.registrationStatus')}</h3>
                                        <p className="text-3xl font-bold tracking-[-1px] mb-2 text-left">{showInfo.occupiedSpots} / {showInfo.maxCats}</p>
                                        <div className="w-full h-3 bg-black/20 rounded-full mb-3 overflow-hidden"><div className={`h-full rounded-full bg-white transition-all`} style={{ width: `${capacityPercentage}%` }}></div></div>
                                        <Link to="/apply" className="block w-full text-center py-2.5 bg-white text-[#027BFF] font-semibold rounded-full border-2 border-white hover:bg-transparent hover:text-white transition-all">{t('catalog.registerBtn')}</Link>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 text-left">{t('catalog.organizerTitle')}</h3>
                                        <p className="font-semibold text-gray-800 mb-1 text-left">{showInfo.organizerName}</p>
                                        <p className="text-sm text-gray-600 text-left mb-4">{showInfo.organizerContactEmail}</p>
                                        {showInfo.organizerWebsiteUrl && <a href={showInfo.organizerWebsiteUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline text-left block mb-2">{showInfo.organizerWebsiteUrl}</a>}
                                    </div>
                                </aside>
                            </div>
                        )}

                        {tab === "primary" && <PrimaryCatalogueContent showId={showId || 1} />}

                        {tab === "secondary" && (
                            <div className="py-10 space-y-8 text-left">
                                <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="text-left">
                                        <h2 className="text-xl font-bold text-gray-900 tracking-[-1px]">{showInfo.name}</h2>
                                        <p className="text-sm text-gray-500 mt-1 uppercase font-semibold tracking-wider">Results & Reports</p>
                                    </div>
                                    <div className="flex gap-4 text-gray-900">
                                        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">[Judges Preview]</div>
                                        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">[Stats Preview]</div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-[-1px]">{t('catalog.judgesReports')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {judges.map((j) => (
                                            <div key={j.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="font-bold text-gray-900 mb-4">{j.firstName} {j.lastName} ({j.country})</div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setModal({ isOpen: true, date: 'SATURDAY', judge: j })} className="flex-1 text-[10px] font-bold text-[#027BFF] border border-[#027BFF] py-2 rounded-lg hover:bg-[#027BFF] hover:text-white transition-colors uppercase tracking-wider text-gray-900">Saturday</button>
                                                    <button onClick={() => setModal({ isOpen: true, date: 'SUNDAY', judge: j })} className="flex-1 text-[10px] font-bold text-[#027BFF] border border-[#027BFF] py-2 rounded-lg hover:bg-[#027BFF] hover:text-white transition-colors uppercase tracking-wider text-gray-900">Sunday</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="pt-10 border-t border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-[-1px]">{t('catalog.quickCatalogTitle')}</h3>
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                        <button onClick={() => setActiveQuickFilter('ALL')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${activeQuickFilter === 'ALL' ? 'bg-[#027BFF] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>[ALL]</button>
                                        {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setActiveQuickFilter(n as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${activeQuickFilter === n ? 'bg-[#027BFF] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>[cat {n === 5 ? 'DOM' : n}]</button>)}
                                    </div>
                                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                        <table className="w-full border-collapse text-sm">
                                            <thead><tr className="bg-[#027BFF] text-white font-semibold"><th className="p-3 text-left">No.</th><th className="p-3 text-left">EMS</th><th className="p-3 text-left">{t('catForm.catName')}</th><th className="p-3 text-center">Sex</th><th className="p-3 text-left">Class</th></tr></thead>
                                            <tbody>
                                            {filteredQuick.map((row) => (
                                                <tr key={row.catalogNumber} className="border-b hover:bg-blue-50/30 transition-colors">
                                                    <td className="p-3 font-bold text-gray-900 text-left">{row.catalogNumber}</td>
                                                    <td className="p-3 font-semibold text-[#027BFF] text-left">{row.emsCode}</td>
                                                    <td className="p-3 text-left font-medium">{row.catName}</td>
                                                    <td className="p-3 text-center text-gray-400 font-bold">{row.gender === 'MALE' ? '1,0' : '0,1'}</td>
                                                    <td className="p-3 text-left text-gray-600">{row.showClass?.replace(/_/g, ' ')}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </>
            )}

            {modal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[85vh] overflow-hidden flex flex-col tracking-tight text-gray-900">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <div className="text-left">
                                <h2 className="text-xl font-bold tracking-[-1px] text-gray-900">{modal.judge?.firstName} {modal.judge?.lastName}</h2>
                                <p className="text-[#027BFF] font-bold text-[10px] tracking-widest uppercase">{modal.date}</p>
                            </div>
                            <button onClick={() => setModal({ ...modal, isOpen: false })} className="text-[#027BFF] font-bold border-2 border-[#027BFF] rounded-full w-10 h-10 hover:bg-[#027BFF] hover:text-white transition-all flex items-center justify-center text-xl">×</button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-white">
                            {modal.judge && <JudgeReportDetail showId={showId || 1} judgeId={modal.judge.id} date={modal.date} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}