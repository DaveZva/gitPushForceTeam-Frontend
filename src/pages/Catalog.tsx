import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registrationApi, QuickCatalogEntry, PublicShowDetail } from "../services/api/registrationApi";
import { secretariatApi, SecretariatJudge } from "../services/api/secretariatApi";
import { JudgeReportDetail } from "../components/catalog/JudgeReportDetail";
import { PrimaryCatalogueContent } from "../components/catalog/PrimaryCatalogueContent";
import { JudgesColoursTable } from "../components/catalog/JudgesColoursTable";

const formatTime = (isoString?: string) => isoString ? new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";
const formatDate = (isoString?: string) => isoString ? new Date(isoString).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) : "";

type ModalType = 'NONE' | 'JUDGE_REPORT' | 'JUDGES_PREVIEW';

export default function Catalog() {
    const { t } = useTranslation();
    const { showId } = useParams<{ showId: string }>();
    const [tab, setTab] = useState<"info" | "primary" | "secondary">("info");
    const [showInfo, setShowInfo] = useState<PublicShowDetail | null>(null);
    const [judges, setJudges] = useState<SecretariatJudge[]>([]);
    const [quickEntries, setQuickEntries] = useState<QuickCatalogEntry[]>([]);
    const [activeQuickFilter, setActiveQuickFilter] = useState<number | 'ALL'>('ALL');

    const [modalState, setModalState] = useState<{ type: ModalType; date?: string; judge?: SecretariatJudge }>({ type: 'NONE' });

    useEffect(() => {
        const id = showId || 1;
        const load = async () => {
            try {
                const [info, jList, quick] = await Promise.all([
                    registrationApi.getShowInfo(id),
                    secretariatApi.getJudgesByShow(id),
                    registrationApi.getQuickCatalog(id)
                ]);
                setShowInfo(info);
                setJudges(jList);
                setQuickEntries(quick);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [showId]);

    const capacityPercentage = useMemo(() => showInfo ? Math.min((showInfo.occupiedSpots / showInfo.maxCats) * 100, 100) : 0, [showInfo]);
    const filteredQuick = useMemo(() => quickEntries.filter(e => activeQuickFilter === 'ALL' || e.category === activeQuickFilter).sort((a,b) => a.catalogNumber - b.catalogNumber), [quickEntries, activeQuickFilter]);

    const closeModal = () => setModalState({ type: 'NONE' });

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 font-sans tracking-tight text-gray-900">
            {!showInfo ? <div className="py-24 text-center">{t('catalog.loading', 'Loading...')}</div> : (
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
                                <aside className="space-y-8 flex flex-col items-stretch">
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
                                        <p className="text-sm text-gray-500 mt-1 uppercase font-semibold tracking-wider">{t('catalog.resultsReports', 'Results & Reports')}</p>
                                    </div>
                                    <div className="flex gap-4 text-gray-900">
                                        <button
                                            onClick={() => setModalState({ type: 'JUDGES_PREVIEW' })}
                                            className="bg-gray-50 hover:bg-blue-50 hover:text-[#027BFF] hover:border-[#027BFF] px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-all"
                                        >
                                            {t('catalog.judgesPreviewBtn')}
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-[-1px]">{t('catalog.judgesReports')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {judges.map((j) => (
                                            <div key={j.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="font-bold text-gray-900 mb-4">{j.firstName} {j.lastName} ({j.country})</div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setModalState({ type: 'JUDGE_REPORT', date: 'SATURDAY', judge: j })} className="flex-1 text-[10px] font-bold text-[#027BFF] border border-[#027BFF] py-2 rounded-lg hover:bg-[#027BFF] hover:text-white transition-colors uppercase tracking-wider text-gray-900">{t('days.saturday')}</button>
                                                    <button onClick={() => setModalState({ type: 'JUDGE_REPORT', date: 'SUNDAY', judge: j })} className="flex-1 text-[10px] font-bold text-[#027BFF] border border-[#027BFF] py-2 rounded-lg hover:bg-[#027BFF] hover:text-white transition-colors uppercase tracking-wider text-gray-900">{t('days.sunday')}</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="pt-10 border-t border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-[-1px]">{t('catalog.quickCatalogTitle')}</h3>
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                        <button onClick={() => setActiveQuickFilter('ALL')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${activeQuickFilter === 'ALL' ? 'bg-[#027BFF] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>{t('catalog.filterAll', '[ALL]')}</button>
                                        {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setActiveQuickFilter(n as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${activeQuickFilter === n ? 'bg-[#027BFF] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>[{t('catalog.filterCat', 'cat')} {n === 5 ? 'DOM' : n}]</button>)}
                                    </div>
                                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                        <table className="w-full border-collapse text-sm">
                                            <thead><tr className="bg-[#027BFF] text-white font-semibold"><th className="p-3 text-left">{t('catalog.tableNo', 'No.')}</th><th className="p-3 text-left">{t('catalog.tableEms', 'EMS')}</th><th className="p-3 text-left">{t('catForm.catName')}</th><th className="p-3 text-center">{t('catalog.tableSex', 'Sex')}</th><th className="p-3 text-left">{t('catalog.tableClass', 'Class')}</th></tr></thead>
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

            {modalState.type !== 'NONE' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] lg:max-w-7xl overflow-hidden flex flex-col tracking-tight text-gray-900 relative">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <div className="text-left">
                                {modalState.type === 'JUDGE_REPORT' && modalState.judge && (
                                    <>
                                        <h2 className="text-xl font-bold tracking-[-1px] text-gray-900">{modalState.judge.firstName} {modalState.judge.lastName}</h2>
                                        <p className="text-[#027BFF] font-bold text-[10px] tracking-widest uppercase">{modalState.date ? t(`days.${modalState.date.toLowerCase()}`, modalState.date) : ''}</p>
                                    </>
                                )}
                                {modalState.type === 'JUDGES_PREVIEW' && (
                                    <h2 className="text-xl font-bold tracking-[-1px] text-gray-900">{t('catalog.judgesPreviewBtn')}</h2>
                                )}
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-gray-50/50">
                            {modalState.type === 'JUDGE_REPORT' && modalState.judge && modalState.date && (
                                <div className="bg-white"><JudgeReportDetail showId={showId || 1} judgeId={modalState.judge.id} date={modalState.date} /></div>
                            )}
                            {modalState.type === 'JUDGES_PREVIEW' && (
                                <JudgesColoursTable showId={showId || 1} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}