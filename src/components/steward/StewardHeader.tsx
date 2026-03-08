import { useTranslation } from "react-i18next";
import { StewardIcons } from "./StewardIcons";

interface StewardHeaderProps {
    judgeName: string;
    tableNumber: number | null;
    onRefresh: () => void;
    onLeave: () => void;
    onRelease: () => void;
}

export const StewardHeader = ({ judgeName, tableNumber, onRefresh, onLeave, onRelease }: StewardHeaderProps) => {
    const { t } = useTranslation();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button
                    onClick={onLeave}
                    title={t('steward.backToList')}
                    className="p-2 text-gray-500 hover:text-[#027BFF] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <StewardIcons.Home />
                </button>
                <div className="flex flex-col items-start"> {/* items-start zajistí zarovnání všeho vlevo */}
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900 leading-none">{judgeName}</h2>
                        {tableNumber && (
                            <span className="bg-[#027BFF] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                {t('steward.tableNum', { num: tableNumber })}
            </span>
                        )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
        {t('steward.role')}
    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    title={t('steward.refresh')}
                    className="p-2 text-gray-400 hover:text-[#027BFF] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <StewardIcons.Refresh />
                </button>
                <button
                    onClick={onRelease}
                    title={t('steward.releaseTable')}
                    className="p-2 text-red-500 bg-red-50/50 border-2 border-transparent rounded-lg transition-all duration-200 hover:border-red-500 hover:bg-red-50 outline-none focus:outline-none focus:ring-0 cursor-pointer group flex items-center justify-center"
                >
                    <div className="text-red-500 group-hover:text-red-700 transition-colors duration-200 flex items-center justify-center">
                        <StewardIcons.Unlock />
                    </div>
                </button>
            </div>
        </header>
    );
};