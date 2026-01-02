import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {secretariatApi} from "../services/api/secretariatApi";

export const JudgesSteawardsTab = ({ showId }: { showId: string | undefined }) => {
    const { t } = useTranslation();
    const [assignedJudges, setAssignedJudges] = useState<any[]>([]);
    const [availableJudges, setAvailableJudges] = useState<any[]>([]);

    useEffect(() => {
        // 1. Načíst všechny rozhodčí z DB
        // 2. Načíst ty, co už jsou přiřazeni k showId
        // 3. Rozdělit je do seznamů
    }, [showId]);

    const handleAssign = async (judge: any) => {
        if (!showId) return;
        try {
            await secretariatApi.assignJudgeToShow(showId, judge.id);
            setAssignedJudges([...assignedJudges, judge]);
            setAvailableJudges(availableJudges.filter(j => j.id !== judge.id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{t('secretariat.judges.onShow')}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{t('secretariat.judges.database')}</h3>
                <button className="mt-4 text-[#027BFF] text-sm font-medium hover:underline">
                    {t('secretariat.judges.addNew')}
                </button>
            </div>
        </div>
    );
};