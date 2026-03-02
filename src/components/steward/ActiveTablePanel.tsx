import { useTranslation } from "react-i18next";
import { StewardQueueEntry } from "../../services/api/stewardApi";
import { StewardIcons } from "./StewardIcons";

interface ActiveTablePanelProps {
    currentCat?: StewardQueueEntry;
    readyCats: StewardQueueEntry[];
    onSetUrgency: (cat: StewardQueueEntry, urgency: string) => void;
    onFinishJudging: (cat: StewardQueueEntry) => void;
    onCallToTable: (cat: StewardQueueEntry, type?: string) => void;
    onStatusChange: (cat: StewardQueueEntry, status: string) => void;
}

export const ActiveTablePanel = ({ currentCat, readyCats, onSetUrgency, onFinishJudging, onCallToTable, onStatusChange }: ActiveTablePanelProps) => {
    const { t } = useTranslation();

    return (
        <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
                <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
                    <span className="font-bold uppercase text-sm tracking-wide flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {t('steward.status.judging', 'CURRENTLY AT TABLE')}
                    </span>

                    {currentCat && (
                        <div className="flex gap-2">
                            {currentCat.urgency !== 'NORMAL' && (
                                <button onClick={() => onSetUrgency(currentCat, 'NORMAL')} className="text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-0 border-2 transition-all duration-200 bg-[#027BFF] text-white border-transparent hover:bg-white hover:text-[#027BFF] hover:border-[#027BFF] shadow-sm">
                                    {t('steward.cancelUrgency', 'ZRUŠIT URGENCI')}
                                </button>
                            )}

                            {/* Tlačítko ZVÝRAZNIT / ZVÝRAZNĚNO - Žlutá logika */}
                            <button
                                onClick={() => onSetUrgency(currentCat, currentCat.urgency === 'URGENT' ? 'NORMAL' : 'URGENT')}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-0 border-2 transition-all duration-200 ${
                                    currentCat.urgency === 'URGENT'
                                        ? 'bg-yellow-500 text-white border-yellow-500'
                                        : 'bg-yellow-500 text-white border-transparent hover:bg-white hover:text-yellow-600 hover:border-yellow-500'
                                }`}
                            >
                                <StewardIcons.Bell active={currentCat.urgency === 'URGENT'} />
                                {currentCat.urgency === 'URGENT' ? t('steward.urgentActive', 'ZVÝRAZNĚNO') : t('steward.setUrgent', 'ZVÝRAZNIT')}
                            </button>

                            {/* Tlačítko POSLEDNÍ VÝZVA - Červená logika */}
                            <button
                                onClick={() => onSetUrgency(currentCat, currentCat.urgency === 'FINAL_CALL' ? 'NORMAL' : 'FINAL_CALL')}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-0 border-2 transition-all duration-200 ${
                                    currentCat.urgency === 'FINAL_CALL'
                                        ? 'bg-red-600 text-white border-red-600 animate-pulse'
                                        : 'bg-red-500 text-white border-transparent hover:bg-white hover:text-red-500 hover:border-red-500'
                                }`}
                            >
                                <StewardIcons.Bell active={currentCat.urgency === 'FINAL_CALL'} />
                                {currentCat.urgency === 'FINAL_CALL' ? t('steward.finalCallActive', 'POSLEDNÍ VÝZVA') : t('steward.setFinalCall', 'POSLEDNÍ VÝZVA')}
                            </button>
                        </div>
                    )}
                </div>

                {currentCat ? (
                    <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-6xl font-black text-gray-900 tracking-tighter">#{currentCat.catalogNumber}</span>
                                <span className="text-2xl text-gray-400 font-light">{currentCat.sex === 'MALE' ? '1.0' : '0.1'}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-[#027BFF] mb-4">{currentCat.catName}</h3>
                            <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-lg inline-flex">
                                <span>EMS: <strong className="text-gray-900">{currentCat.ems}</strong></span>
                                <span className="text-gray-300">|</span>
                                <span>{t('steward.born', 'Narozen')}: <strong className="text-gray-900">{currentCat.birthDate}</strong></span>
                            </div>
                        </div>
                        {/* Hlavní tlačítko HOTOVO - odstraněna modrá po kliknutí a hover blikání */}
                        <button
                            onClick={() => onFinishJudging(currentCat)}
                            className="mt-8 w-full bg-[#027BFF] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 transition-none flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-0"
                        >
                            <StewardIcons.Check />
                            {t('steward.finishJudging', 'HOTOVO & SMAZAT Z TABULE')}
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 min-h-[250px]">
                        <span className="text-lg font-medium mb-1">{t('steward.tableEmpty', 'Stůl je prázdný')}</span>
                        <span className="text-sm">{t('steward.callNextCat', 'Vyberte kočku z fronty')}</span>
                    </div>
                )}
            </div>

            {/* Sekce PŘIPRAVUJÍ SE */}
            {readyCats.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-500 uppercase tracking-wider text-sm flex items-center gap-2 px-2">
                        {t('steward.preparing', 'PŘIPRAVUJÍ SE')}
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
                                    <button onClick={() => onCallToTable(cat)} className="flex-1 bg-yellow-50 text-yellow-700 border-2 border-transparent hover:bg-yellow-400 hover:text-white hover:border-yellow-400 py-1.5 rounded-lg font-bold text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-0">
                                        <StewardIcons.Megaphone />
                                        {t('steward.toTable', 'KE STOLU')}
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(cat, 'WAITING')}
                                        className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-500 py-2.5 rounded-lg transition-colors border border-gray-100 cursor-pointer focus:outline-none focus:ring-0"
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