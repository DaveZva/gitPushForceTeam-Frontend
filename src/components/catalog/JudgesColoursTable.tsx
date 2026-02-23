import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { secretariatApi } from "../../services/api/secretariatApi";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Props {
    showId: string | number;
}

interface JudgeDisplayData {
    judgeId: number;
    judgeName: string;
    totalCats: number;
    emsDistribution: { ems: string; count: number }[];
}

export const JudgesColoursTable = ({ showId }: Props) => {
    const { t } = useTranslation();
    const [data, setData] = useState<JudgeDisplayData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<'SATURDAY' | 'SUNDAY'>('SATURDAY');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const judges = await secretariatApi.getJudgesByShow(showId);

                const enrichedJudges = await Promise.all(
                    judges.map(async (judge) => {
                        const sheets = await secretariatApi.getJudgeSheets(showId, judge.id, selectedDay);

                        const emsCounts: Record<string, number> = {};
                        sheets.forEach((sheet: any) => {
                            const ems = sheet.emsCode || "Unknown";
                            emsCounts[ems] = (emsCounts[ems] || 0) + 1;
                        });

                        const distribution = Object.entries(emsCounts)
                            .map(([ems, count]) => ({ ems, count }))
                            .sort((a, b) => a.ems.localeCompare(b.ems));

                        return {
                            judgeId: judge.id,
                            judgeName: `${judge.firstName} ${judge.lastName}`,
                            totalCats: sheets.length,
                            emsDistribution: distribution
                        };
                    })
                );

                setData(enrichedJudges.filter(j => j.totalCats > 0));
            } catch (error) {
                console.error(error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [showId, selectedDay]);

    return (
        <div className="space-y-6 sm:p-2">
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100/80 p-1.5 rounded-xl inline-flex shadow-inner border border-gray-200/60">
                    <button
                        onClick={() => setSelectedDay('SATURDAY')}
                        className={`px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 ${
                            selectedDay === 'SATURDAY'
                                ? 'bg-white text-[#027BFF] shadow-sm ring-1 ring-gray-200/50'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('days.saturday', 'SATURDAY')}
                    </button>
                    <button
                        onClick={() => setSelectedDay('SUNDAY')}
                        className={`px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 ${
                            selectedDay === 'SUNDAY'
                                ? 'bg-white text-[#027BFF] shadow-sm ring-1 ring-gray-200/50'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('days.sunday', 'SUNDAY')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <LoadingSpinner size="lg" />
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                    <p className="text-gray-500 font-medium">{t('judges.noWorkload', 'No judges assigned for this day.')}</p>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-6 items-start">
                    {data.map((judge) => (
                        <div
                            key={judge.judgeId}
                            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] max-w-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[#027BFF]/30"
                        >
                            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 truncate pr-3 text-lg tracking-tight">
                                    {judge.judgeName}
                                </h3>
                                <span className="bg-white border border-gray-200 text-[#027BFF] px-2.5 py-1 rounded-lg text-xs font-black shadow-sm whitespace-nowrap">
                                    {judge.totalCats} {t('judges.catsCountLabel', 'CATS')}
                                </span>
                            </div>

                            <div className="flex flex-col bg-white">
                                {judge.emsDistribution.length > 0 ? (
                                    judge.emsDistribution.map((breed, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center px-5 py-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50/40 transition-colors group"
                                        >
                                            <span className="font-semibold text-gray-700 tracking-wide group-hover:text-[#027BFF] transition-colors">
                                                {breed.ems}
                                            </span>
                                            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-100 group-hover:border-blue-200 group-hover:text-[#027BFF] group-hover:bg-blue-50 transition-colors">
                                                {breed.count}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-sm text-gray-400 italic">
                                            {t('judges.noBreedsAssigned', 'No breeds assigned yet')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};