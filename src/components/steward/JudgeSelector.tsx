import { useTranslation } from "react-i18next";
import { StewardJudgeDto } from "../../services/api/stewardApi";
import { StewardIcons } from "./StewardIcons";
import type { ShowDay } from "../../services/api/stewardApi";

interface JudgeSelectorProps {
    judges: StewardJudgeDto[];
    usedTables: number[];
    selectedDay: ShowDay | null;
    onSelectDay: (day: ShowDay | null) => void;
    onInitiateLock: (judge: StewardJudgeDto) => void;
    onConfirmTable: (tableNumber: number) => void;
    judgeToLock: StewardJudgeDto | null;
    onCancelLock: () => void;
}

export const JudgeSelector = ({
                                  judges,
                                  usedTables,
                                  selectedDay,
                                  onSelectDay,
                                  onInitiateLock,
                                  onConfirmTable,
                                  judgeToLock,
                                  onCancelLock,
                              }: JudgeSelectorProps) => {
    const { t, i18n } = useTranslation();

    const getVisibleTableCount = () => {
        let count = 4;
        while (
            Array.from({ length: count }, (_, i) => i + 1).every(num => usedTables.includes(num)) &&
            count < 24
            ) {
            count += 4;
        }
        return count;
    };

    const visibleTableCount = getVisibleTableCount();

    // --- Obrazovka 1: Výběr dne ---
    if (!selectedDay) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="absolute top-4 right-4 flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm z-10">
                    <button
                        onClick={() => i18n.changeLanguage('cs')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                            i18n.language.startsWith('cs')
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'bg-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        CZ
                    </button>
                    <button
                        onClick={() => i18n.changeLanguage('en')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                            i18n.language.startsWith('en')
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'bg-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        EN
                    </button>
                </div>

                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#027BFF]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px] mb-2">
                        {t('steward.selectDayTitle')}
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        {t('steward.selectDaySubtitle')}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => onSelectDay('SATURDAY')}
                            className="w-full p-5 text-left border-2 border-transparent bg-gray-50 rounded-xl flex justify-between items-center
                                hover:border-[#027BFF] hover:bg-white transition-all duration-200 group"
                        >
                            <div>
                                <span className="font-bold text-gray-900 block text-lg group-hover:text-[#027BFF]">
                                    {t('days.saturday')}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {t('steward.dayOne')}
                                </span>
                            </div>
                            <span className="text-gray-300 group-hover:text-[#027BFF] transition-colors">
                                <StewardIcons.ChevronRight />
                            </span>
                        </button>

                        <button
                            onClick={() => onSelectDay('SUNDAY')}
                            className="w-full p-5 text-left border-2 border-transparent bg-gray-50 rounded-xl flex justify-between items-center
                                hover:border-[#027BFF] hover:bg-white transition-all duration-200 group"
                        >
                            <div>
                                <span className="font-bold text-gray-900 block text-lg group-hover:text-[#027BFF]">
                                    {t('days.sunday')}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {t('steward.dayTwo')}
                                </span>
                            </div>
                            <span className="text-gray-300 group-hover:text-[#027BFF] transition-colors">
                                <StewardIcons.ChevronRight />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Obrazovka 2: Výběr posuzovatele ---
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative font-sans">
            <div className="absolute top-4 right-4 flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm z-10">
                <button
                    onClick={() => i18n.changeLanguage('cs')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                        i18n.language.startsWith('cs')
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'bg-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    CZ
                </button>
                <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-200 ${
                        i18n.language.startsWith('en')
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'bg-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    EN
                </button>
            </div>

            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <span className="bg-[#027BFF] text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {selectedDay === 'SATURDAY' ? t('days.saturday') : t('days.sunday')}
                    </span>
                    <button
                        onClick={() => onSelectDay(null as any)}
                        className="text-xs text-gray-400 hover:text-gray-700 font-semibold transition-colors underline"
                    >
                        {t('common.change')}
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#027BFF]">
                        <StewardIcons.User />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px]">
                        {t('steward.selectJudgeTitle')}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">{t('steward.selectJudgeSubtitle')}</p>
                </div>

                <div className="space-y-3">
                    {judges.map(judge => {
                        const isLockedBySomeoneElse = judge.isLocked && !judge.isLockedByMe;

                        return (
                            <button
                                key={judge.id}
                                disabled={isLockedBySomeoneElse}
                                onClick={() => onInitiateLock(judge)}
                                className={`w-full p-4 text-left border-2 rounded-lg flex justify-between items-center transition-all duration-200 cursor-pointer ${
                                    isLockedBySomeoneElse
                                        ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed grayscale'
                                        : 'border-transparent bg-gray-50 text-gray-700 hover:border-[#027BFF] hover:bg-white hover:text-[#027BFF] group'
                                }`}
                            >
                                <div>
                                    <span className={`font-bold block transition-colors ${
                                        isLockedBySomeoneElse ? 'text-gray-500' : 'text-gray-700 group-hover:text-[#027BFF]'
                                    }`}>
                                        {judge.name}
                                    </span>
                                    {isLockedBySomeoneElse && (
                                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-1">
                                            <StewardIcons.Lock /> {judge.lockedBySteward} ({t('steward.table')} {judge.tableNumber})
                                        </span>
                                    )}
                                </div>
                                {!judge.isLocked && (
                                    <span className="text-gray-300 group-hover:text-[#027BFF] transition-colors">
                                        <StewardIcons.ChevronRight />
                                    </span>
                                )}
                                {judge.isLockedByMe && (
                                    <span className="text-[#027BFF] text-xs font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                        {t('steward.myTable')} {judge.tableNumber}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Modal výběru stolu — beze změny */}
            {judgeToLock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 tracking-[-1px]">
                                {t('steward.tableSelectionTitle')}
                            </h3>
                            <button
                                onClick={onCancelLock}
                                className="p-2 bg-gray-100 text-gray-500 border-2 border-gray-200 rounded-full transition-all duration-200 hover:bg-white hover:text-black hover:border-black flex items-center justify-center cursor-pointer outline-none"
                            >
                                <StewardIcons.Close />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                {t('steward.assigningTo')}{' '}
                                <strong className="text-[#027BFF] text-base font-bold">{judgeToLock.name}</strong>.<br />
                                {t('steward.tableSelectionDesc')}
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                                {Array.from({ length: visibleTableCount }, (_, i) => i + 1).map(num => {
                                    const isUsed = usedTables.includes(num);
                                    return (
                                        <button
                                            key={num}
                                            disabled={isUsed}
                                            onClick={() => onConfirmTable(num)}
                                            className={`py-4 rounded-xl font-bold text-lg border-2 transition-all duration-200 cursor-pointer ${
                                                isUsed
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through decoration-gray-300'
                                                    : 'bg-blue-50/50 text-[#027BFF] border-transparent hover:border-[#027BFF] hover:bg-white shadow-sm hover:shadow-md'
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