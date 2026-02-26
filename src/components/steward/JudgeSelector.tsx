import { useTranslation } from "react-i18next";
import { StewardJudgeDto } from "../../services/api/stewardApi";
import { StewardIcons } from "./StewardIcons";

interface JudgeSelectorProps {
    judges: StewardJudgeDto[];
    usedTables: number[];
    onInitiateLock: (judge: StewardJudgeDto) => void;
    onConfirmTable: (tableNumber: number) => void;
    judgeToLock: StewardJudgeDto | null;
    onCancelLock: () => void;
}

export const JudgeSelector = ({ judges, usedTables, onInitiateLock, onConfirmTable, judgeToLock, onCancelLock }: JudgeSelectorProps) => {
    const { t } = useTranslation();

    // Dynamický výpočet viditelných stolů:
    // Ukazuje 4. Pokud jsou 1-4 všechny obsazené, ukáže 8. Pokud 1-8, ukáže 12 atd.
    const getVisibleTableCount = () => {
        let count = 4;
        while (
            Array.from({ length: count }, (_, i) => i + 1).every(num => usedTables.includes(num)) &&
            count < 24 // Bezpečnostní limit
            ) {
            count += 4;
        }
        return count;
    };

    const visibleTableCount = getVisibleTableCount();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#027BFF]">
                        <StewardIcons.User />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('steward.selectJudgeTitle', 'Výběr posuzovatele')}</h1>
                    <p className="text-gray-500 mt-2 text-sm">{t('steward.selectJudgeSubtitle', 'Vyberte svého posuzovatele ze seznamu')}</p>
                </div>
                <div className="space-y-3">
                    {judges.map(judge => {
                        const isLockedBySomeoneElse = judge.isLocked && !judge.isLockedByMe;

                        return (
                            <button
                                key={judge.id}
                                disabled={isLockedBySomeoneElse}
                                onClick={() => onInitiateLock(judge)}
                                className={`w-full p-4 text-left border rounded-lg flex justify-between items-center transition-all ${
                                    isLockedBySomeoneElse
                                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed grayscale'
                                        : 'border-gray-200 hover:border-[#027BFF] hover:ring-1 hover:ring-[#027BFF] bg-white group'
                                }`}
                            >
                                <div>
                                    <span className={`font-bold block ${isLockedBySomeoneElse ? 'text-gray-500' : 'text-gray-700 group-hover:text-[#027BFF]'}`}>
                                        {judge.name}
                                    </span>
                                    {isLockedBySomeoneElse && (
                                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-1">
                                            <StewardIcons.Lock /> {judge.lockedBySteward} ({t('steward.table', 'Stůl')} {judge.tableNumber})
                                        </span>
                                    )}
                                </div>
                                {!judge.isLocked && <span className="text-gray-300 group-hover:text-[#027BFF]"><StewardIcons.ChevronRight /></span>}
                                {judge.isLockedByMe && <span className="text-[#027BFF] text-xs font-bold bg-blue-50 px-2 py-1 rounded">{t('steward.myTable', 'Můj stůl')} {judge.tableNumber}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {judgeToLock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">{t('steward.tableSelectionTitle', 'Vyberte číslo stolu')}</h3>
                            <button onClick={onCancelLock} className="text-gray-400 hover:text-red-500 transition-colors">
                                <StewardIcons.Close />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                {t('steward.assigningTo', 'Přiřazujete se k:')} <strong className="text-[#027BFF] text-base">{judgeToLock.name}</strong>.<br/>
                                {t('steward.tableSelectionDesc', 'Vyberte volný stůl. Další se uvolní až po zaplnění aktuálních.')}
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                                {Array.from({length: visibleTableCount}, (_, i) => i + 1).map(num => {
                                    const isUsed = usedTables.includes(num);
                                    return (
                                        <button
                                            key={num}
                                            disabled={isUsed}
                                            onClick={() => onConfirmTable(num)}
                                            className={`py-4 rounded-xl font-bold text-lg transition-all ${
                                                isUsed
                                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through decoration-gray-300'
                                                    : 'bg-blue-50/50 text-[#027BFF] hover:bg-[#027BFF] hover:text-white border border-blue-100 hover:border-[#027BFF] shadow-sm hover:shadow-md'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};