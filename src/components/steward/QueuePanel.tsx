import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StewardQueueEntry } from "../../services/api/stewardApi";
import { StewardIcons } from "./StewardIcons";

interface QueuePanelProps {
    activeTab: 'QUEUE' | 'BIV' | 'BIS';
    setActiveTab: (tab: 'QUEUE' | 'BIV' | 'BIS') => void;
    waitingCats: StewardQueueEntry[];
    bivGroups: [string, StewardQueueEntry[]][];
    allActiveCats: StewardQueueEntry[];
    onStatusChange: (cat: StewardQueueEntry, status: string) => void;
    onCallToTable: (cat: StewardQueueEntry, type?: string) => void;
    onCallBivGroup: (cats: StewardQueueEntry[]) => void;
    onPrepareGroup: (cats: StewardQueueEntry[]) => void;
}

export const QueuePanel = ({ activeTab, setActiveTab, waitingCats, allActiveCats, onCallToTable, onCallBivGroup, onStatusChange, onPrepareGroup }: QueuePanelProps) => {
    const { t } = useTranslation();
    const [selectedBiv, setSelectedBiv] = useState<Set<number>>(new Set());
    const [selectedBis, setSelectedBis] = useState<Set<number>>(new Set());

    const toggleBiv = (id: number) => {
        setSelectedBiv(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleBis = (id: number) => {
        setSelectedBis(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleCallBiv = () => {
        const cats = allActiveCats.filter(c => selectedBiv.has(c.id));
        if (cats.length < 3) return;
        onCallBivGroup(cats);
        setSelectedBiv(new Set());
    };

    const handleCallBis = () => {
        const cats = allActiveCats.filter(c => selectedBis.has(c.id));
        if (cats.length === 0) return;
        cats.forEach(cat => onCallToTable(cat, 'BIS'));
        setSelectedBis(new Set());
    };

    const tabs = [
        { id: 'QUEUE', label: t('steward.tabs.queue') },
        { id: 'BIV', label: 'BIV' },
        { id: 'BIS', label: 'BIS / NOM' }
    ] as const;

    return (
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-140px)] sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                <div className="flex p-2 gap-2 bg-white border-b border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 px-4 font-black text-[11px] uppercase tracking-widest transition-all duration-200 rounded-xl border-2 cursor-pointer flex items-center justify-center relative ${
                                activeTab === tab.id
                                    ? 'bg-[#027BFF] text-white border-[#027BFF] shadow-md shadow-[#027BFF]/20'
                                    : 'bg-white text-[#027BFF] border-[#027BFF] hover:bg-[#027BFF]/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50 custom-scrollbar">
                    {activeTab === 'QUEUE' && (
                        <>
                            {waitingCats.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">{t('steward.queueEmpty')}</div>
                            ) : (
                                waitingCats.map(cat => (
                                    <div key={cat.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between group shadow-sm hover:border-[#027BFF]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-900 font-bold w-8 text-right text-lg tracking-tighter">{cat.catalogNumber}</span>
                                            <div className="h-8 w-px bg-gray-100"></div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{cat.ems} <span className="font-normal text-gray-400 text-xs ml-1">({cat.sex === 'MALE' ? '1.0' : '0.1'})</span></div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onStatusChange(cat, 'READY')}
                                                className="px-3 py-2 bg-gray-50 text-gray-600 border-2 border-transparent hover:border-yellow-500 hover:bg-white hover:text-yellow-600 rounded-lg font-bold text-[10px] tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer"
                                            >
                                                <StewardIcons.List />
                                                {t('steward.prepare')}
                                            </button>
                                            <button
                                                onClick={() => onCallToTable(cat)}
                                                className="px-3 py-2 bg-blue-50 text-[#027BFF] border-2 border-transparent hover:border-[#027BFF] hover:bg-white hover:text-[#027BFF] rounded-lg font-bold text-[10px] tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer"
                                            >
                                                <StewardIcons.Megaphone />
                                                {t('steward.toTableBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'BIV' && (
                        <div className="space-y-2">
                            {/* Call button */}
                            <div className="bg-white rounded-lg border border-purple-200 p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">{t('steward.selectForBiv')}</p>
                                <button
                                    onClick={handleCallBiv}
                                    disabled={selectedBiv.size < 3}
                                    className={`w-full py-3 rounded-lg font-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border-2 cursor-pointer ${
                                        selectedBiv.size >= 3
                                            ? 'bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 shadow-sm'
                                            : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                    }`}
                                >
                                    <StewardIcons.Megaphone />
                                    {t('steward.callGroupBivSelected')}
                                    {selectedBiv.size > 0 && (
                                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                                            selectedBiv.size >= 3 ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {selectedBiv.size}
                                        </span>
                                    )}
                                </button>
                                {selectedBiv.size > 0 && selectedBiv.size < 3 && (
                                    <p className="text-[10px] text-red-400 text-center mt-1.5">{t('steward.minBivCats')}</p>
                                )}
                            </div>

                            {allActiveCats.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">{t('steward.noBivAvailable')}</div>
                            ) : (
                                allActiveCats.map(cat => {
                                    const selected = selectedBiv.has(cat.id);
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => toggleBiv(cat.id)}
                                            className={`bg-white p-3 rounded-lg border flex items-center justify-between shadow-sm transition-all cursor-pointer ${
                                                selected
                                                    ? 'border-purple-400 bg-purple-50/50 ring-1 ring-purple-300'
                                                    : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                                    selected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                                                }`}>
                                                    {selected && (
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={`font-bold w-8 text-right text-lg tracking-tighter ${selected ? 'text-purple-900' : 'text-gray-900'}`}>
                                                    #{cat.catalogNumber}
                                                </span>
                                                <div className="h-8 w-px bg-gray-100"></div>
                                                <div>
                                                    <div className={`font-bold text-sm ${selected ? 'text-purple-800' : 'text-gray-900'}`}>
                                                        {cat.ems} <span className="font-normal text-gray-400 text-xs ml-1">({cat.sex === 'MALE' ? '1.0' : '0.1'})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'BIS' && (
                        <div className="space-y-2">
                            {/* Call button */}
                            <div className="bg-white rounded-lg border border-purple-200 p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">{t('steward.selectForBis')}</p>
                                <button
                                    onClick={handleCallBis}
                                    disabled={selectedBis.size === 0}
                                    className={`w-full py-3 rounded-lg font-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border-2 cursor-pointer ${
                                        selectedBis.size > 0
                                            ? 'bg-purple-600 text-white border-purple-600 hover:bg-white hover:text-purple-600 shadow-sm'
                                            : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                    }`}
                                >
                                    <StewardIcons.Megaphone />
                                    {t('steward.callGroupBisSelected')}
                                    {selectedBis.size > 0 && (
                                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-white/30 text-white">
                                            {selectedBis.size}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {allActiveCats.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">{t('steward.noBisAvailable')}</div>
                            ) : (
                                allActiveCats.map(cat => {
                                    const selected = selectedBis.has(cat.id);
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => toggleBis(cat.id)}
                                            className={`bg-white p-3 rounded-lg border flex items-center justify-between shadow-sm transition-all cursor-pointer ${
                                                selected
                                                    ? 'border-purple-400 bg-purple-50/50 ring-1 ring-purple-300'
                                                    : 'border-purple-200 hover:border-purple-400'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                                    selected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                                                }`}>
                                                    {selected && (
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={`font-bold w-8 text-lg text-right tracking-tighter ${selected ? 'text-purple-900' : 'text-purple-900'}`}>
                                                    #{cat.catalogNumber}
                                                </span>
                                                <span className="text-xs font-bold text-gray-500">{cat.ems}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};