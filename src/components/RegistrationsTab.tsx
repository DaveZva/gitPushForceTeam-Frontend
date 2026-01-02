import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { secretariatApi } from '../services/api/secretariatApi';
import { EditEntryModal } from './EditEntryModal';

export const RegistrationsTab = ({ showId }: { showId: string }) => {
    const { t } = useTranslation();
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadRegistrations = async () => {
        setLoading(true);
        try {
            const data = await secretariatApi.getRegistrationsByShow(showId);
            setRegistrations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegistrations();
    }, [showId]);

    const handleOpenDetail = (entryId: number) => {
        setSelectedEntryId(entryId);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                            {t('catalog.regNo')}
                        </th>
                        <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                            {t('catForm.catName')}
                        </th>
                        <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                            EMS / {t('catForm.showClass')}
                        </th>
                        <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                            {t('catalog.owner')}
                        </th>
                        <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                            {t('catalog.status')}
                        </th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-900 uppercase tracking-wider text-xs">
                            {t('admin.shows.col.actions')}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {registrations.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                {t('catalog.noResults')}
                            </td>
                        </tr>
                    ) : (
                        registrations.map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-500 font-medium">
                                    {reg.registrationNumber}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{reg.catName}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {reg.gender === 'MALE' ? '1,0' : '0,1'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-start gap-1">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">
                                                {reg.emsCode}
                                            </span>
                                        <span className="text-gray-500 text-xs">
                                                {reg.showClass}
                                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-900 font-medium">{reg.ownerName}</div>
                                    <div className="text-xs text-gray-500">{reg.ownerEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            reg.status === 'CONFIRMED'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {t(`statuses.${reg.status}`)}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleOpenDetail(reg.id)}
                                        className="text-[#027BFF] font-semibold hover:text-[#0056b3] transition-colors text-sm hover:underline"
                                    >
                                        {t('common.edit')}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <EditEntryModal
                entryId={selectedEntryId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={loadRegistrations}
            />
        </div>
    );
};