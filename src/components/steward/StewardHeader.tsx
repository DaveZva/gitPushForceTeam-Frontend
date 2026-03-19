import { useTranslation } from "react-i18next";
import { StewardIcons } from "./StewardIcons";
import type { ShowDay } from "../../services/api/stewardApi";

interface StewardHeaderProps {
    judgeName: string;
    tableNumber: number | null;
    selectedDay: ShowDay;
    onRefresh: () => void;
    onLeave: () => void;
    onRelease: () => void;
}

export const StewardHeader = ({ judgeName, tableNumber, selectedDay, onRefresh, onLeave, onRelease }: StewardHeaderProps) => {
    const { t, i18n } = useTranslation();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button
                    onClick={onLeave}
                    title={t('steward.backToList')}
                    className="p-2 text-gray-500 bg-gray-50 border-2 border-transparent hover:border-[#027BFF] hover:text-[#027BFF] hover:bg-white rounded-lg transition-all duration-200 cursor-pointer"
                >
                    <StewardIcons.Home />
                </button>
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-gray-900 leading-none tracking-[-1px]">{judgeName}</h2>
                        {tableNumber && (
                            <span className="bg-[#027BFF] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                {t('steward.tableNum', { num: tableNumber })}
                            </span>
                        )}
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-gray-200">
                            {selectedDay === 'SATURDAY' ? t('days.saturday') : t('days.sunday')}
                        </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                        {t('steward.role')}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => i18n.changeLanguage('cs')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${i18n.language.startsWith('cs') ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        CZ
                    </button>
                    <button
                        onClick={() => i18n.changeLanguage('en')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${i18n.language.startsWith('en') ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        EN
                    </button>
                </div>
                <button
                    onClick={onRefresh}
                    title={t('steward.refresh')}
                    className="p-2 text-gray-400 bg-gray-50 border-2 border-transparent hover:border-[#027BFF] hover:text-[#027BFF] hover:bg-white rounded-lg transition-all duration-200 cursor-pointer"
                >
                    <StewardIcons.Refresh />
                </button>
                <button
                    onClick={onRelease}
                    title={t('steward.releaseTable')}
                    className="p-2 text-red-500 bg-red-50/50 border-2 border-transparent rounded-lg transition-all duration-200 hover:border-red-500 hover:bg-white hover:text-red-600 outline-none cursor-pointer flex items-center justify-center"
                >
                    <StewardIcons.Unlock />
                </button>
            </div>
        </header>
    );
};