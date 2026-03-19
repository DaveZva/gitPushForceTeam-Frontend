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
    onReturnToQueue: (cat: StewardQueueEntry) => void;
}

export const ActiveTablePanel = ({
                                     currentCats,
                                     readyCats,
                                     isPaused,
                                     onTogglePause,
                                     onSetUrgency,
                                     onFinishJudging,
                                     onFinishAll,
                                     onCallToTable,
                                     onStatusChange,
                                     onReturnToQueue,
                                 }: ActiveTablePanelProps) => {
    const { t } = useTranslation();

    return (
        <div className="lg:col-span-7 flex flex-col gap-6 font-sans">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
                {/* Header */}
                <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center relative z-10">
                    <span className="font-bold uppercase text-sm tracking-widest flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                        {isPaused ? t('steward.status.paused') : t('steward.status.judging')}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={onTogglePause}
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg border-2 transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                                isPaused
                                    ? 'bg-yellow-500 text-black border-yellow-500 hover:bg-white hover:text-yellow-600 hover:border-yellow-500'
                                    : 'bg-gray-700 text-white border-transparent hover:bg-red-500 hover:border-red-500 hover:text-white'
                            }`}
                        >
                            {isPaused ? t('steward.resume') : t('steward.pause')}
                        </button>
                    </div>
                </div>

                {/* Kočky u stolu */}
                {currentCats.length > 0 ? (
                    <div className="p-8 flex-1 flex flex-col justify-between bg-blue-50/20">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {currentCats.map(cat => (
                                <div
                                    key={cat.id}
                                    className="flex-1 min-w-[240px] max-w-[320px] bg-white p-6 rounded-2xl shadow-md border border-blue-50 flex flex-col items-center text-center transition-all hover:shadow-lg relative"
                                >
                                    {/* Křížek — vrácení do fronty */}
                                    <button
                                        onClick={() => onReturnToQueue(cat)}
                                        title={t('steward.returnToQueue', 'Vrátit do fronty (špatné vyvolání)')}
                                        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full
                                            bg-gray-100 text-gray-400 border-2 border-transparent
                                            hover:bg-red-50 hover:text-red-500 hover:border-red-200
                                            transition-all duration-200 cursor-pointer outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black text-gray-900 tracking-[-4px]">
                                            #{cat.catalogNumber}
                                        </span>
                                        <span className="text-xl text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                            {cat.sex === 'MALE' ? '1.0' : '0.1'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#027BFF] mb-6 tracking-[-1px]">
                                        {cat.ems}
                                    </h3>

                                    <div className="w-full flex flex-col gap-2 mt-auto">
                                        {/* Urgency tlačítka — jen pokud je jedna kočka */}
                                        {currentCats.length === 1 && (
                                            <div className="flex gap-2 mb-2 w-full justify-center">
                                                <button
                                                    onClick={() => onSetUrgency(cat, cat.urgency === 'URGENT' ? 'NORMAL' : 'URGENT')}
                                                    className={`flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                                        cat.urgency === 'URGENT'
                                                            ? 'bg-yellow-500 text-black border-yellow-500 hover:bg-white hover:text-yellow-600'
                                                            : 'bg-gray-100 text-gray-500 border-transparent hover:border-yellow-500 hover:bg-white hover:text-yellow-600'
                                                    }`}
                                                >
                                                    {t('steward.highlight')}
                                                </button>
                                                <button
                                                    onClick={() => onSetUrgency(cat, cat.urgency === 'FINAL_CALL' ? 'NORMAL' : 'FINAL_CALL')}
                                                    className={`flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                                        cat.urgency === 'FINAL_CALL'
                                                            ? 'bg-red-500 text-white border-red-500 animate-pulse hover:bg-white hover:text-red-600'
                                                            : 'bg-gray-100 text-gray-500 border-transparent hover:border-red-500 hover:bg-white hover:text-red-600'
                                                    }`}
                                                >
                                                    {t('steward.finalCall')}
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => onFinishJudging(cat)}
                                            className="w-full bg-[#027BFF] text-white border-2 border-[#027BFF] py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-[#027BFF] cursor-pointer shadow-md shadow-blue-100"
                                        >
                                            {t('steward.judged')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tlačítko Hotovo pro všechny — při více kočkách */}
                        {currentCats.length > 1 && (
                            <button
                                onClick={() => onFinishAll(currentCats)}
                                className="mt-8 w-full bg-[#027BFF] text-white border-2 border-[#027BFF] py-4 rounded-xl font-black text-lg uppercase tracking-[4px] shadow-xl shadow-blue-200 transition-all duration-200 hover:bg-white hover:text-[#027BFF] flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98]"
                            >
                                <StewardIcons.Check />
                                {t('steward.finishAll')}
                            </button>
                        )}
                    </div>
                ) : isPaused ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-yellow-500 p-8 min-h-[300px]">
                        <span className="text-3xl font-black mb-2 tracking-[-1px] uppercase animate-pulse italic">
                            {t('steward.pauseJudging')}
                        </span>
                        <span className="text-sm font-bold text-yellow-600/70 tracking-widest uppercase">
                            {t('steward.publicBoardPaused')}
                        </span>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 min-h-[300px]">
                        <span className="text-xl font-bold mb-1 tracking-[-1px] text-gray-600">
                            {t('steward.tableEmpty')}
                        </span>
                        <span className="text-sm font-medium opacity-60">
                            {t('steward.callNextCat')}
                        </span>
                    </div>
                )}
            </div>

            {/* Připravující se kočky */}
            {readyCats.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 px-2">
                        {t('steward.preparing')}
                        <span className="bg-yellow-100 text-yellow-800 py-0.5 px-2.5 rounded-full text-[10px] font-black border border-yellow-200">
                            {readyCats.length}
                        </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {readyCats.map(cat => (
                            <div
                                key={cat.id}
                                className="bg-white border-l-4 border-yellow-400 p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-4xl font-black text-gray-900 tracking-[-2px]">
                                            #{cat.catalogNumber}
                                        </span>
                                        <div className="font-bold text-[#027BFF] mt-1 tracking-tight">
                                            {cat.ems}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                        {cat.sex === 'MALE' ? '1.0' : '0.1'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onCallToTable(cat)}
                                        className="flex-1 bg-yellow-400 text-white border-2 border-yellow-400 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-yellow-600 hover:!border-yellow-400 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-yellow-100 outline-none focus:outline-none"
                                    >
                                        <StewardIcons.Megaphone />
                                        {t('steward.toTable')}
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(cat, 'WAITING')}
                                        className="px-3 bg-gray-50 text-gray-400 border-2 border-transparent py-2.5 rounded-lg transition-all duration-200 hover:border-black hover:bg-white hover:text-black cursor-pointer flex items-center justify-center"
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