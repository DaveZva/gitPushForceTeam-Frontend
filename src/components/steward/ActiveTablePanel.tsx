import { useTranslation } from "react-i18next";
import { StewardQueueEntry } from "../../services/api/stewardApi";
import { StewardIcons } from "./StewardIcons";

interface ActiveTablePanelProps {
    currentCats: StewardQueueEntry[];
    readyCats: StewardQueueEntry[];
    isPaused: boolean;
    onTogglePause: () => void;
    onSetUrgency: (cat: StewardQueueEntry, urgency: string) => void;
    onFinishJudging: (cat: StewardQueueEntry) => void;
    onFinishAll: (cats: StewardQueueEntry[]) => void;
    onCallToTable: (cat: StewardQueueEntry, type?: string) => void;
    onStatusChange: (cat: StewardQueueEntry, status: string) => void;
}

export const ActiveTablePanel = ({ currentCats, readyCats, isPaused, onTogglePause, onSetUrgency, onFinishJudging, onFinishAll, onCallToTable, onStatusChange }: ActiveTablePanelProps) => {
    const { t } = useTranslation();

    return (
        <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
                <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
                    <span className="font-bold uppercase text-sm tracking-wide flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
                        {isPaused ? t('steward.status.paused') : t('steward.status.judging')}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={onTogglePause}
                            className={`text-xs font-bold px-4 py-1.5 rounded transition-colors ${isPaused ? 'bg-yellow-500 text-black shadow-inner' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                        >
                            {isPaused ? t('steward.resume') : t('steward.pause')}
                        </button>
                    </div>
                </div>

                {currentCats.length > 0 ? (
                    <div className="p-8 flex-1 flex flex-col justify-between bg-blue-50/20">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {currentCats.map(cat => (
                                <div key={cat.id} className="flex-1 min-w-[220px] max-w-[300px] bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-6xl font-black text-gray-900 tracking-tighter">#{cat.catalogNumber}</span>
                                        <span className="text-xl text-gray-400 font-light bg-gray-50 px-2 py-0.5 rounded">{cat.sex === 'MALE' ? '1.0' : '0.1'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#027BFF] mb-4">{cat.ems}</h3>

                                    <div className="w-full flex flex-col gap-2 mt-auto">
                                        {currentCats.length === 1 && (
                                            <div className="flex gap-2 mb-2 w-full justify-center">
                                                <button onClick={() => onSetUrgency(cat, cat.urgency === 'URGENT' ? 'NORMAL' : 'URGENT')} className={`flex-1 text-[10px] font-bold py-2 rounded transition-colors ${cat.urgency === 'URGENT' ? 'bg-yellow-500 text-black' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>{t('steward.highlight')}</button>
                                                <button onClick={() => onSetUrgency(cat, cat.urgency === 'FINAL_CALL' ? 'NORMAL' : 'FINAL_CALL')} className={`flex-1 text-[10px] font-bold py-2 rounded transition-colors ${cat.urgency === 'FINAL_CALL' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>{t('steward.finalCall')}</button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => onFinishJudging(cat)}
                                            className="w-full bg-blue-100 hover:bg-[#027BFF] hover:text-white text-[#027BFF] py-3 rounded-xl font-bold text-sm transition-all"
                                        >
                                            {t('steward.judged')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {currentCats.length > 1 && (
                            <button
                                onClick={() => onFinishAll(currentCats)}
                                className="mt-8 w-full bg-[#027BFF] hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <StewardIcons.Check />
                                {t('steward.finishAll')}
                            </button>
                        )}
                    </div>
                ) : isPaused ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-yellow-500 p-8 min-h-[250px]">
                        <span className="text-2xl font-black mb-2 tracking-widest uppercase animate-pulse">{t('steward.pauseJudging')}</span>
                        <span className="text-sm text-yellow-600/70">{t('steward.publicBoardPaused')}</span>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 min-h-[250px]">
                        <span className="text-lg font-medium mb-1">{t('steward.tableEmpty')}</span>
                        <span className="text-sm">{t('steward.callNextCat')}</span>
                    </div>
                )}
            </div>

            {readyCats.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider text-sm flex items-center gap-2 px-2">
                        {t('steward.preparing')}
                        <span className="bg-yellow-100 text-yellow-800 py-0.5 px-2.5 rounded-full text-xs">{readyCats.length}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {readyCats.map(cat => (
                            <div key={cat.id} className="bg-white border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-3xl font-black text-gray-800">#{cat.catalogNumber}</span>
                                        <div className="font-bold text-[#027BFF] mt-1">{cat.ems}</div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{cat.sex === 'MALE' ? '1.0' : '0.1'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onCallToTable(cat)}
                                        className="flex-1 bg-yellow-50 hover:bg-yellow-400 hover:text-white text-yellow-700 py-2.5 rounded-lg font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
                                    >
                                        <StewardIcons.Megaphone />
                                        {t('steward.toTable')}
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(cat, 'WAITING')}
                                        className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-500 py-2.5 rounded-lg transition-colors border border-gray-100"
                                    >
                                        <StewardIcons.Close />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};