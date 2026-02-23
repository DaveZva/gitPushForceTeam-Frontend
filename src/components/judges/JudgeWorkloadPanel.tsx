import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
    showId: number;
    day: string;
}

export const JudgeWorkloadPanel: React.FC<Props> = ({ showId, day }) => {
    const { t } = useTranslation();
    const [workload, setWorkload] = useState<JudgeWorkload[]>([]);
    const [isBalancing, setIsBalancing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadWorkload();
    }, [showId, day]);

    const loadWorkload = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `/api/v1/secretariat/${showId}/judging/workload?day=${day}`
            );
            setWorkload(response.data);
        } catch (error) {
            toast.error(t('errors.loadWorkload'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRebalance = async () => {
        if (!confirm(t('judging.confirmRebalance'))) return;

        setIsBalancing(true);
        try {
            await axios.post(
                `/api/v1/secretariat/${showId}/judging/rebalance?day=${day}`
            );
            toast.success(t('judging.regenerateSuccess'));
            loadWorkload();
        } catch (error) {
            toast.error(t('errors.rebalance'));
        } finally {
            setIsBalancing(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">{t('loading')}</div>;
    }

    const avgWorkload = workload.reduce((sum, j) => sum + j.catsCount, 0) / workload.length;
    const maxDeviation = Math.max(
        ...workload.map(j => Math.abs(j.catsCount - avgWorkload))
    );

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t('judging.workloadBalance')} - {day}</h3>
                <button
                    onClick={handleRebalance}
                    disabled={isBalancing}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isBalancing ? t('judging.balancing') : t('judging.rebalance')}
                </button>
            </div>

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
                    const deviation = ((judge.catsCount - avgWorkload) / avgWorkload) * 100;
                    const isBalanced = Math.abs(deviation) < 15;

                    return (
                        <div key={judge.judgeId} className="border rounded p-3">
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
                                    style={{ width: `${(judge.catsCount / (avgWorkload * 2)) * 100}%` }}
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
                                            <span className="font-semibold">{breed.count} {t('common.pcs')}</span>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};