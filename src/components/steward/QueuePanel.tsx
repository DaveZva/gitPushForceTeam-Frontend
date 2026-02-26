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
    onPrepareGroup: (cats: StewardQueueEntry[]) => void;
}

export const QueuePanel = ({ activeTab, setActiveTab, waitingCats, bivGroups, allActiveCats, onStatusChange, onCallToTable, onPrepareGroup }: QueuePanelProps) => {
    const { t } = useTranslation();

    const tabs = [
        { id: 'QUEUE', label: t('steward.tabs.queue') },
        { id: 'BIV', label: 'BIV', count: bivGroups.length },
        { id: 'BIS', label: 'BIS / NOM' }
    ] as const;

    return (
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-140px)] sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors relative ${
                                activeTab === tab.id
                                    ? 'text-[#027BFF] border-b-2 border-[#027BFF] bg-blue-50/10'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                            {'count' in tab && tab.count ? (
                                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span>
                            ) : null}
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
                                    <div key={cat.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between group shadow-sm hover:border-[#027BFF]/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-900 font-bold w-8 text-right text-lg">{cat.catalogNumber}</span>
                                            <div className="h-8 w-px bg-gray-100"></div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{cat.ems} <span className="font-normal text-gray-400 text-xs ml-1">({cat.sex === 'MALE' ? '1.0' : '0.1'})</span></div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onStatusChange(cat, 'READY')}
                                                className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 border border-gray-100 rounded-lg font-bold text-[10px] tracking-wider transition-colors flex items-center gap-1"
                                            >
                                                <StewardIcons.List />
                                                {t('steward.prepare')}
                                            </button>
                                            <button
                                                onClick={() => onCallToTable(cat)}
                                                className="px-3 py-2 bg-blue-50 text-[#027BFF] hover:bg-[#027BFF] hover:text-white rounded-lg font-bold text-[10px] tracking-wider transition-colors flex items-center gap-1"
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
                        <div className="space-y-3">
                            {bivGroups.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">{t('steward.noBivAvailable')}</div>
                            ) : (
                                bivGroups.map(([groupName, cats]) => {
                                    const canPrepare = cats.some(c => c.status !== 'READY' && c.status !== 'JUDGING');

                                    return (
                                        <div key={groupName} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
                                                <span className="font-bold text-[#027BFF] text-sm">{groupName}</span>
                                                <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-full">{cats.length} {t('steward.cats')}</span>
                                            </div>
                                            <div className="p-2 space-y-2 bg-gray-50/50">
                                                {cats.map(cat => (
                                                    <div key={cat.id} className={`bg-white p-2.5 rounded-lg border flex items-center justify-between shadow-sm transition-colors ${cat.status === 'DONE' ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-purple-300'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`font-bold w-8 text-right text-lg ${cat.status === 'DONE' ? 'text-gray-400' : 'text-gray-900'}`}>
                                                                #{cat.catalogNumber}
                                                            </span>
                                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                                {cat.sex === 'MALE' ? '1.0' : '0.1'}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            {cat.status === 'DONE' && (
                                                                <span className="text-[10px] font-bold text-green-600 uppercase bg-green-100 px-2 py-1.5 rounded border border-green-200 flex items-center gap-1">
                                                                    <StewardIcons.Check /> {t('steward.judged')}
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => onStatusChange(cat, 'READY')}
                                                                className="px-2 py-1.5 bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 border border-gray-100 rounded-md font-bold text-[10px] tracking-wider transition-colors flex items-center gap-1"
                                                            >
                                                                <StewardIcons.List />
                                                                {t('steward.prepare')}
                                                            </button>
                                                            <button
                                                                onClick={() => onCallToTable(cat, 'BIV')}
                                                                className="px-2 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-100 hover:border-purple-600 rounded-md font-bold text-[10px] tracking-wider transition-colors flex items-center gap-1"
                                                            >
                                                                <StewardIcons.Megaphone />
                                                                BIV
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {canPrepare && (
                                                    <button
                                                        onClick={() => onPrepareGroup(cats)}
                                                        className="w-full mt-2 bg-yellow-50/80 border border-yellow-200 text-yellow-700 hover:bg-yellow-400 hover:text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <StewardIcons.List />
                                                        {t('steward.prepareGroup')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'BIS' && (
                        <div className="p-2 grid grid-cols-1 gap-3">
                            {allActiveCats.map(cat => (
                                <div key={cat.id} className="bg-white p-3 rounded-lg border border-purple-200 flex items-center justify-between shadow-sm">
                                    <span className="font-bold text-purple-900 w-8 text-lg">#{cat.catalogNumber}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onCallToTable(cat, 'BIS')}
                                            className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded-lg font-bold text-xs tracking-wider transition-colors"
                                        >
                                            {t('steward.callBis')}
                                        </button>
                                        <button
                                            onClick={() => onCallToTable(cat, 'BOB')}
                                            className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-600 hover:text-white rounded-lg font-bold text-xs tracking-wider transition-colors"
                                        >
                                            {t('steward.callBob')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};