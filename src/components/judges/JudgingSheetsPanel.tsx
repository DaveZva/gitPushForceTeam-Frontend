import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Judge {
    id: number;
    firstName: string;
    lastName: string;
    saturdaySheets?: number;
    sundaySheets?: number;
}

interface Props {
    showId: number;
}

export const JudgingSheetsPanel: React.FC<Props> = ({ showId }) => {
    const { t } = useTranslation();
    const [judges, setJudges] = useState<Judge[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        loadJudges();
    }, [showId]);

    const loadJudges = async () => {
        try {
            const response = await axios.get(`/api/v1/secretariat/${showId}/judges`);
            const judgesData = response.data;

            const judgesWithCounts = await Promise.all(
                judgesData.map(async (judge: Judge) => {
                    const satResponse = await axios.get(
                        `/api/v1/secretariat/${showId}/judging/judges/${judge.id}/sheets?day=SATURDAY`
                    );
                    const sunResponse = await axios.get(
                        `/api/v1/secretariat/${showId}/judging/judges/${judge.id}/sheets?day=SUNDAY`
                    );

                    return {
                        ...judge,
                        saturdaySheets: satResponse.data.length,
                        sundaySheets: sunResponse.data.length
                    };
                })
            );

            setJudges(judgesWithCounts);
        } catch (error) {
            toast.error('Error loading judges');
        }
    };

    const handleGenerateSheets = async () => {
        if (!confirm(t('judging.confirmGenerate'))) return;

        setIsGenerating(true);
        try {
            await axios.post(`/api/v1/secretariat/${showId}/judging/generate`);
            toast.success(t('judging.generateSuccess'));
            loadJudges();
        } catch (error) {
            toast.error('Error generating sheets');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateForJudge = async (judgeId: number) => {
        if (!confirm(t('judging.confirmRegenerate'))) return;

        try {
            await axios.post(
                `/api/v1/secretariat/${showId}/judging/judges/${judgeId}/regenerate`
            );
            toast.success(t('judging.regenerateSuccess'));
            loadJudges();
        } catch (error) {
            toast.error('Error regenerating sheets');
        }
    };

    const downloadPdf = async (judgeId: number, day: string) => {
        try {
            const response = await axios.get(
                `/api/v1/secretariat/${showId}/judging/judges/${judgeId}/sheets/pdf?day=${day}`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `judge_${judgeId}_${day}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Error downloading PDF');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('judging.title')}</h2>
                <button
                    onClick={handleGenerateSheets}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isGenerating ? t('judging.generating') : t('judging.generateAll')}
                </button>
            </div>

            <table className="min-w-full bg-white border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">{t('secretariat.judges.col.name')}</th>
                    <th className="px-4 py-2 text-center">{t('saturday')}</th>
                    <th className="px-4 py-2 text-center">{t('sunday')}</th>
                    <th className="px-4 py-2 text-center">{t('actions.actions')}</th>
                </tr>
                </thead>
                <tbody>
                {judges.map(judge => (
                    <tr key={judge.id} className="border-t">
                        <td className="px-4 py-2">{judge.firstName} {judge.lastName}</td>
                        <td className="px-4 py-2 text-center">{judge.saturdaySheets || 0}</td>
                        <td className="px-4 py-2 text-center">{judge.sundaySheets || 0}</td>
                        <td className="px-4 py-2 text-center space-x-2">
                            <button
                                onClick={() => handleRegenerateForJudge(judge.id)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                            >
                                {t('judging.regenerate')}
                            </button>
                            <button
                                onClick={() => downloadPdf(judge.id, 'SATURDAY')}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                                {t('judging.pdfSaturday')}
                            </button>
                            <button
                                onClick={() => downloadPdf(judge.id, 'SUNDAY')}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                                {t('judging.pdfSunday')}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};