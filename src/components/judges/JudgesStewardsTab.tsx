import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secretariatApi, SecretariatJudge } from '../../services/api/secretariatApi';
import { Button } from '../ui/Button';
import { CountrySelect } from '../ui/CountrySelect';
import { getCountryName } from '../../data/countries';

interface JudgesTabProps {
    showId: string | number | undefined;
}

export const JudgesSteawardsTab: React.FC<JudgesTabProps> = ({ showId }) => {
    const { t, i18n } = useTranslation();
    const [assignedJudges, setAssignedJudges] = useState<SecretariatJudge[]>([]);
    const [allJudges, setAllJudges] = useState<SecretariatJudge[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState<'EXISTING' | 'NEW'>('EXISTING');

    const [newJudge, setNewJudge] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        validGroups: [] as string[]
    });

    const [selectedJudgeId, setSelectedJudgeId] = useState<number | ''>('');

    const loadData = async () => {
        if (!showId) return;
        try {
            setLoading(true);
            const assigned = await secretariatApi.getJudgesByShow(showId);
            setAssignedJudges(assigned);

            const all = await secretariatApi.getAllJudges();
            setAllJudges(all);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [showId]);

    const handleRemoveJudge = async (judgeId: number) => {
        if (!showId || !window.confirm(t('confirm.resetForm'))) return;
        try {
            await secretariatApi.removeJudgeFromShow(showId, judgeId);
            await loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssignExisting = async () => {
        if (!showId || !selectedJudgeId) return;
        try {
            await secretariatApi.assignJudgeToShow(showId, Number(selectedJudgeId));
            setIsModalOpen(false);
            await loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateAndAssign = async () => {
        if (!showId) return;
        try {
            const created = await secretariatApi.createJudge(newJudge);
            await secretariatApi.assignJudgeToShow(showId, created.id);
            setIsModalOpen(false);
            setNewJudge({ firstName: '', lastName: '', email: '', country: '', validGroups: [] });
            await loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleGroup = (group: string) => {
        setNewJudge(prev => {
            const groups = prev.validGroups.includes(group)
                ? prev.validGroups.filter(g => g !== group)
                : [...prev.validGroups, group];
            return { ...prev, validGroups: groups };
        });
    };

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)}>
                    {t('secretariat.judges.addBtn')}
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.judges.col.name')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.judges.col.email')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.judges.col.country')}</th>
                            <th className="p-4 font-medium text-gray-500">{t('secretariat.judges.col.groups')}</th>
                            <th className="p-4 text-right font-medium text-gray-500">{t('secretariat.judges.col.actions')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {assignedJudges.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    {t('secretariat.judges.noJudges')}
                                </td>
                            </tr>
                        ) : (
                            assignedJudges.map((judge) => (
                                <tr key={judge.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-900">
                                        {judge.firstName} {judge.lastName}
                                    </td>
                                    <td className="p-4 text-gray-600">{judge.email}</td>
                                    <td className="p-4 text-gray-600">
                                        {getCountryName(judge.country, i18n.language)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {judge.validGroups.sort().map(g => (
                                                <span key={g} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">
                                                        {g}
                                                    </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleRemoveJudge(judge.id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline"
                                        >
                                            {t('common.no')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">{t('secretariat.judges.modal.title')}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="flex border-b">
                            <button
                                className={`flex-1 p-3 text-sm font-semibold ${activeModalTab === 'EXISTING' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                onClick={() => setActiveModalTab('EXISTING')}
                            >
                                {t('secretariat.judges.modal.tabExisting')}
                            </button>
                            <button
                                className={`flex-1 p-3 text-sm font-semibold ${activeModalTab === 'NEW' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                onClick={() => setActiveModalTab('NEW')}
                            >
                                {t('secretariat.judges.modal.tabNew')}
                            </button>
                        </div>

                        <div className="p-6">
                            {activeModalTab === 'EXISTING' ? (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('secretariat.judges.modal.selectLabel')}
                                    </label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={selectedJudgeId}
                                        onChange={(e) => setSelectedJudgeId(Number(e.target.value))}
                                    >
                                        <option value="">{t('secretariat.judges.modal.selectPlaceholder')}</option>
                                        {allJudges
                                            .filter(j => !assignedJudges.some(aj => aj.id === j.id))
                                            .map(j => (
                                                <option key={j.id} value={j.id}>
                                                    {j.firstName} {j.lastName} ({getCountryName(j.country, i18n.language)})
                                                </option>
                                            ))}
                                    </select>
                                    <Button onClick={handleAssignExisting} disabled={!selectedJudgeId} className="w-full justify-center mt-4">
                                        {t('secretariat.judges.modal.assign')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t('secretariat.judges.modal.firstName')}</label>
                                            <input
                                                className="w-full p-2 border rounded-lg"
                                                value={newJudge.firstName}
                                                onChange={e => setNewJudge({...newJudge, firstName: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t('secretariat.judges.modal.lastName')}</label>
                                            <input
                                                className="w-full p-2 border rounded-lg"
                                                value={newJudge.lastName}
                                                onChange={e => setNewJudge({...newJudge, lastName: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t('secretariat.judges.modal.email')}</label>
                                        <input
                                            className="w-full p-2 border rounded-lg"
                                            value={newJudge.email}
                                            onChange={e => setNewJudge({...newJudge, email: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <CountrySelect
                                            label={t('secretariat.judges.modal.country')}
                                            value={newJudge.country}
                                            onChange={(val) => setNewJudge({...newJudge, country: val})}
                                            placeholder={t('common.select')}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-2 block">{t('secretariat.judges.modal.groupsLabel')}</label>
                                        <div className="flex gap-4">
                                            {['1', '2', '3', '4'].map(g => (
                                                <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newJudge.validGroups.includes(g)}
                                                        onChange={() => toggleGroup(g)}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm font-medium">Kat. {g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={handleCreateAndAssign} className="w-full justify-center mt-4">
                                        {t('secretariat.judges.modal.createAndAssign')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};