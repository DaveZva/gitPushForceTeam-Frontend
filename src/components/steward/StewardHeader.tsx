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
                    title={t('steward.backToList', 'Zpět na seznam')}
                    className="p-2 text-gray-500 hover:text-[#027BFF] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <StewardIcons.Home />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{judgeName}</h2>
                        {tableNumber && (
                            <span className="bg-[#027BFF] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                {t('steward.tableNum', { number: tableNumber })}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {t('steward.role', 'STEWARD PANEL')}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    title={t('steward.refresh', 'Obnovit frontu')}
                    className="p-2 text-gray-400 hover:text-[#027BFF] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <StewardIcons.Refresh />
                </button>
                <button
                    onClick={onRelease}
                    title={t('steward.releaseTable', 'Uvolnit stůl (Zrušit přiřazení)')}
                    className="p-2 text-red-400 hover:text-red-600 bg-red-50/50 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <StewardIcons.Unlock />
                </button>
            </div>
        </header>
    );
};