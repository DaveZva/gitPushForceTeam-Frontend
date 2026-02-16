import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Button } from './ui/Button';
import { secretariatApi, SecretariatJudge } from '../services/api/secretariatApi';

interface JudgeWithSheets extends SecretariatJudge {
    saturdaySheets?: number;
    sundaySheets?: number;
}

interface BreedDistribution {
    code: string;
    name: string;
    count: number;
}

interface JudgeWorkload {
    judgeId: number;
    judgeName: string;
    qualifications: string[];
    catsCount: number;
    breedDistribution: BreedDistribution[];
}

interface Props {
    showId: string | number;
}

export const JudgingSheetsTab: React.FC<Props> = ({ showId }) => {
    const { t } = useTranslation();
    const [judges, setJudges] = useState<JudgeWithSheets[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>('SATURDAY');
    const [workload, setWorkload] = useState<JudgeWorkload[]>([]);
    const [isBalancing, setIsBalancing] = useState(false);
    const [loadingWorkload, setLoadingWorkload] = useState(false);

    useEffect(() => {
        if (showId) {
            loadJudges();
        }
    }, [showId]);

    useEffect(() => {
        if (showId) {
            loadWorkload();
        }
    }, [showId, selectedDay]);

    const loadJudges = async () => {
        if (!showId) return;
        try {
            const judgesData = await secretariatApi.getJudgesByShow(showId);

            const judgesWithCounts = await Promise.all(
                judgesData.map(async (judge) => {
                    try {
                        const satSheets = await secretariatApi.getJudgeSheets(showId, judge.id, 'SATURDAY');
                        const sunSheets = await secretariatApi.getJudgeSheets(showId, judge.id, 'SUNDAY');

                        return {
                            ...judge,
                            saturdaySheets: Array.isArray(satSheets) ? satSheets.length : 0,
                            sundaySheets: Array.isArray(sunSheets) ? sunSheets.length : 0
                        };
                    } catch {
                        return { ...judge, saturdaySheets: 0, sundaySheets: 0 };
                    }
                })
            );

            setJudges(judgesWithCounts);
        } catch (error) {
            console.error(error);
            setJudges([]);
            toast.error(t('errors.fetchFailed'));
        }
    };

    const loadWorkload = async () => {
        if (!showId) return;
        setLoadingWorkload(true);
        try {
            const data = await secretariatApi.getJudgingWorkload(showId, selectedDay);
            setWorkload(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setWorkload([]);
        } finally {
            setLoadingWorkload(false);
        }
    };

    const handleGenerateSheets = async () => {
        if (!showId) return;
        if (!confirm(t('judging.confirmGenerate'))) return;

        setIsGenerating(true);
        try {
            await secretariatApi.generateJudgingSheets(showId);
            toast.success(t('judging.generateSuccess'));
            loadJudges();
            loadWorkload();
        } catch (error) {
            toast.error('Error generating sheets');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateForJudge = async (judgeId: number) => {
        if (!showId) return;
        if (!confirm(t('judging.confirmRegenerate'))) return;

        try {
            await secretariatApi.regenerateJudgeSheets(showId, judgeId);
            toast.success(t('judging.regenerateSuccess'));
            loadJudges();
            loadWorkload();
        } catch (error) {
            toast.error('Error regenerating sheets');
            console.error(error);
        }
    };

    const handleRebalance = async () => {
        if (!showId) return;
        if (!confirm(t('judging.confirmRebalance'))) return;

        setIsBalancing(true);
        try {
            await secretariatApi.rebalanceWorkload(showId, selectedDay);
            toast.success(t('judging.rebalanceSuccess', 'Workload rebalanced'));
            loadWorkload();
            loadJudges();
        } catch (error) {
            toast.error('Error rebalancing');
            console.error(error);
        } finally {
            setIsBalancing(false);
        }
    };

    const downloadPdf = async (judgeId: number, day: string) => {
        if (!showId) return;
        try {
            const blob = await secretariatApi.downloadJudgeSheetsPdf(showId, judgeId, day);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `judge_${judgeId}_${day}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Error downloading PDF');
            console.error(error);
        }
    };

    const avgWorkload = workload.length > 0
        ? workload.reduce((sum, j) => sum + j.catsCount, 0) / workload.length
        : 0;
    const maxDeviation = workload.length > 0
        ? Math.max(...workload.map(j => Math.abs(j.catsCount - avgWorkload)))
        : 0;

    return (
        <div className="p-6 space-y-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{t('judging.title')}</h2>
                    <Button
                        onClick={handleGenerateSheets}
                        disabled={isGenerating}
                        variant="primary"
                    >
                        {isGenerating ? t('judging.generating') : t('judging.generateAll')}
                    </Button>
                </div>

                {judges.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {t('secretariat.judges.noJudges')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t('secretariat.judges.col.name')}
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    {t('common.sat')}
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    {t('common.sun')}
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    {t('actions.actions')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {judges.map(judge => (
                                <tr key={judge.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {judge.firstName} {judge.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                                        {judge.saturdaySheets || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                                        {judge.sundaySheets || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                onClick={() => handleRegenerateForJudge(judge.id)}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {t('judging.regenerate')}
                                            </Button>
                                            <Button
                                                onClick={() => downloadPdf(judge.id, 'SATURDAY')}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                PDF {t('common.sat')}
                                            </Button>
                                            <Button
                                                onClick={() => downloadPdf(judge.id, 'SUNDAY')}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                PDF {t('common.sun')}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{t('judging.workloadBalance')}</h3>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedDay('SATURDAY')}
                                className={`px-4 py-2 rounded font-medium ${
                                    selectedDay === 'SATURDAY'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {t('common.sat')}
                            </button>
                            <button
                                onClick={() => setSelectedDay('SUNDAY')}
                                className={`px-4 py-2 rounded font-medium ${
                                    selectedDay === 'SUNDAY'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {t('common.sun')}
                            </button>
                        </div>
                        <Button
                            onClick={handleRebalance}
                            disabled={isBalancing}
                            variant="primary"
                        >
                            {isBalancing ? t('judging.balancing') : t('judging.rebalance')}
                        </Button>
                    </div>
                </div>

                {loadingWorkload ? (
                    <div className="text-center py-8">{t('common.loading')}</div>
                ) : workload.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {t('judging.noWorkload', 'Žádná data pro rozdělení zátěže')}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded">
                                <div className="text-sm text-gray-600">{t('judging.avgWorkload')}</div>
                                <div className="text-2xl font-bold">{avgWorkload.toFixed(1)} {t('judging.catsCount')}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                                <div className="text-sm text-gray-600">{t('judging.maxDeviation')}</div>
                                <div className="text-2xl font-bold">{maxDeviation.toFixed(1)}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                                <div className="text-sm text-gray-600">{t('judging.totalCats')}</div>
                                <div className="text-2xl font-bold">
                                    {workload.reduce((sum, j) => sum + j.catsCount, 0)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {workload.map(judge => {
                                const deviation = avgWorkload > 0 ? ((judge.catsCount - avgWorkload) / avgWorkload) * 100 : 0;
                                const isBalanced = Math.abs(deviation) < 15;

                                return (
                                    <div key={judge.judgeId} className="border rounded p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <div className="font-semibold">{judge.judgeName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {t('judging.qualifications')}: {judge.qualifications.join(', ')}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{judge.catsCount}</div>
                                                <div className={`text-sm ${isBalanced ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${isBalanced ? 'bg-green-500' : 'bg-orange-500'}`}
                                                style={{ width: `${Math.min(100, (judge.catsCount / (avgWorkload * 2)) * 100)}%` }}
                                            />
                                        </div>

                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-sm text-blue-600">
                                                {t('judging.showDetail')} ({judge.breedDistribution.length} {t('judging.breedDistribution')})
                                            </summary>
                                            <div className="mt-2 text-sm">
                                                {judge.breedDistribution.map(breed => (
                                                    <div key={breed.code} className="flex justify-between py-1">
                                                        <span>{breed.name} ({breed.code})</span>
                                                        <span className="font-semibold">{breed.count} ks</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};