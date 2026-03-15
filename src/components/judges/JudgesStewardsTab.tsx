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
        <div className="space-y-4 text-left">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 bg-[#027BFF] text-white font-bold rounded-full border-2 border-[#027BFF] hover:bg-white hover:text-[#027BFF] transition-all duration-300 shadow-md"
                >
                    {t('secretariat.judges.addBtn')}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('secretariat.judges.col.name')}</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('secretariat.judges.col.email')}</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('secretariat.judges.col.country')}</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">{t('secretariat.judges.col.groups')}</th>
                            <th className="p-4 text-center font-bold text-gray-500 uppercase text-xs tracking-wider w-40">{t('secretariat.judges.col.actions')}</th>
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
                                <tr key={judge.id} className="hover:bg-gray-50/50 transition-colors">
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
                                                <span key={g} className="px-2 py-0.5 bg-blue-50 text-[#027BFF] text-[10px] font-black rounded border border-blue-100 uppercase">
                                                        {g}
                                                    </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleRemoveJudge(judge.id)}
                                            className="px-6 py-2 bg-red-500 text-white border-2 border-red-500 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-200 hover:bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                                        >
                                            {t('common.delete')}
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
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-fade-in p-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 border-2 border-transparent hover:border-black hover:text-black hover:bg-white transition-all text-xl font-bold focus:outline-none"
                        >
                            ×
                        </button>

                        <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight text-left">
                            {t('secretariat.judges.modal.title')}
                        </h3>
                        <div className="flex gap-3 mb-8 px-1">
                            <button
                                className={`flex-1 py-2 rounded-xl font-bold text-base transition-all duration-200 border-2 ${
                                    activeModalTab === 'EXISTING'
                                        ? 'bg-[#027BFF] text-white border-[#027BFF] shadow-md shadow-blue-100'
                                        : 'bg-white text-[#027BFF] border-[#027BFF] hover:bg-blue-50'
                                }`}
                                onClick={() => setActiveModalTab('EXISTING')}
                            >
                                {t('secretariat.judges.modal.tabExisting')}
                            </button>
                            <button
                                className={`flex-1 py-2 rounded-xl font-bold text-base transition-all duration-200 border-2 ${
                                    activeModalTab === 'NEW'
                                        ? 'bg-[#027BFF] text-white border-[#027BFF] shadow-md shadow-blue-100'
                                        : 'bg-white text-[#027BFF] border-[#027BFF] hover:bg-blue-50'
                                }`}
                                onClick={() => setActiveModalTab('NEW')}
                            >
                                {t('secretariat.judges.modal.tabNew')}
                            </button>
                        </div>

                        <div className="text-left">
                            {activeModalTab === 'EXISTING' ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 ml-1">
                                            {t('secretariat.judges.modal.selectLabel')}
                                        </label>
                                        <select
                                            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-[#027BFF] outline-none bg-gray-50 focus:bg-white transition-all font-medium"
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
                                    </div>
                                    <button
                                        onClick={handleAssignExisting}
                                        disabled={!selectedJudgeId}
                                        className="w-full py-4 bg-[#027BFF] text-white font-bold rounded-2xl border-2 border-[#027BFF] hover:bg-white hover:text-[#027BFF] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#027BFF] disabled:hover:text-white"
                                    >
                                        {t('secretariat.judges.modal.assign')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder={t('secretariat.judges.modal.firstName')}
                                            className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:border-[#027BFF] outline-none transition-all"
                                            value={newJudge.firstName}
                                            onChange={e => setNewJudge({...newJudge, firstName: e.target.value})}
                                        />
                                        <input
                                            placeholder={t('secretariat.judges.modal.lastName')}
                                            className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:border-[#027BFF] outline-none transition-all"
                                            value={newJudge.lastName}
                                            onChange={e => setNewJudge({...newJudge, lastName: e.target.value})}
                                        />
                                    </div>
                                    <input
                                        placeholder={t('secretariat.judges.modal.email')}
                                        className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:border-[#027BFF] outline-none transition-all"
                                        value={newJudge.email}
                                        onChange={e => setNewJudge({...newJudge, email: e.target.value})}
                                    />

                                    <CountrySelect
                                        value={newJudge.country}
                                        onChange={(val) => setNewJudge({...newJudge, country: val})}
                                        placeholder={t('common.select')}
                                    />

                                    <div className="pt-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t('secretariat.judges.modal.groupsLabel')}</label>
                                        <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            {['1', '2', '3', '4'].map(g => (
                                                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={newJudge.validGroups.includes(g)}
                                                        onChange={() => toggleGroup(g)}
                                                        className="w-4 h-4 rounded text-[#027BFF] focus:ring-[#027BFF] border-gray-300"
                                                    />
                                                    <span className="text-sm font-bold text-gray-600 group-hover:text-[#027BFF]">K{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCreateAndAssign}
                                        className="w-full py-4 mt-2 bg-[#027BFF] text-white font-bold rounded-2xl border-2 border-[#027BFF] hover:bg-white hover:text-[#027BFF] transition-all duration-300 shadow-lg shadow-blue-100"
                                    >
                                        {t('secretariat.judges.modal.createAndAssign')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};