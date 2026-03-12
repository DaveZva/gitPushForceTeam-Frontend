import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { secretariatApi, JudgingSheet, JudgeWorkload } from '../../services/api/secretariatApi';

interface Props {
    showId: string | number;
    onClose: () => void;
}

interface DragState {
    sheetId: number | null;
    sourceJudgeId: number | null;
}

const CATEGORY_COLORS: Record<number, { bg: string; text: string; dot: string }> = {
    1: { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED' },
    2: { bg: '#DBEAFE', text: '#1E40AF', dot: '#2563EB' },
    3: { bg: '#D1FAE5', text: '#065F46', dot: '#059669' },
    4: { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
    5: { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' },
    99: { bg: '#F9FAFB', text: '#9CA3AF', dot: '#D1D5DB' },
};

function isJudgeQualified(qualifications: string[], category: number): boolean {
    if (category === 5) return true;
    const cat = String(category);
    return (
        qualifications.includes(cat) ||
        qualifications.includes('ALL_BREEDS') ||
        qualifications.includes('AB')
    );
}

export const ManualReassignPanel: React.FC<Props> = ({ showId, onClose }) => {
    const { t } = useTranslation();
    const [selectedDay, setSelectedDay] = useState<'SATURDAY' | 'SUNDAY'>('SATURDAY');
    const [sheets, setSheets] = useState<JudgingSheet[]>([]);
    const [workload, setWorkload] = useState<JudgeWorkload[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<number | null>(null);
    const [dragState, setDragState] = useState<DragState>({ sheetId: null, sourceJudgeId: null });
    const [dropTargetJudgeId, setDropTargetJudgeId] = useState<number | null>(null);
    const dragSheetRef = useRef<JudgingSheet | null>(null);

    useEffect(() => {
        loadData();
    }, [showId, selectedDay]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [sheetsData, workloadData] = await Promise.all([
                secretariatApi.getAllSheets(showId, selectedDay),
                secretariatApi.getJudgingWorkload(showId, selectedDay),
            ]);
            setSheets(Array.isArray(sheetsData) ? sheetsData : []);
            setWorkload(Array.isArray(workloadData) ? workloadData : []);
        } catch {
            toast.error(t('errors.fetchFailed'));
        } finally {
            setLoading(false);
        }
    };

    const sheetsByJudge = (judgeId: number) =>
        sheets
            .filter(s => s.judgeId === judgeId)
            .sort((a, b) => (a.catalogNumber ?? 999) - (b.catalogNumber ?? 999));

    const handleDragStart = (e: React.DragEvent, sheet: JudgingSheet) => {
        dragSheetRef.current = sheet;
        setDragState({ sheetId: sheet.id, sourceJudgeId: sheet.judgeId });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDragState({ sheetId: null, sourceJudgeId: null });
        setDropTargetJudgeId(null);
        dragSheetRef.current = null;
    };

    const handleDragOver = (e: React.DragEvent, judgeId: number) => {
        const dragged = dragSheetRef.current;
        if (!dragged || dragged.judgeId === judgeId) return;
        const judge = workload.find(j => j.judgeId === judgeId);
        if (!judge) return;
        if (isJudgeQualified(judge.qualifications, dragged.category)) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDropTargetJudgeId(judgeId);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDropTargetJudgeId(null);
        }
    };

    const handleDrop = async (e: React.DragEvent, targetJudgeId: number) => {
        e.preventDefault();
        setDropTargetJudgeId(null);
        const dragged = dragSheetRef.current;
        if (!dragged || dragged.judgeId === targetJudgeId) return;
        const judge = workload.find(j => j.judgeId === targetJudgeId);
        if (!judge || !isJudgeQualified(judge.qualifications, dragged.category)) return;

        setSaving(dragged.id);
        try {
            await secretariatApi.reassignSheet(showId, dragged.id, targetJudgeId);
            setSheets(prev =>
                prev.map(s => s.id === dragged.id ? { ...s, judgeId: targetJudgeId } : s)
            );
            toast.success(`${dragged.catName} → ${judge.judgeName}`);
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('errors.saveFailed');
            toast.error(msg);
        } finally {
            setSaving(null);
            dragSheetRef.current = null;
            setDragState({ sheetId: null, sourceJudgeId: null });
        }
    };

    const isDragging = dragState.sheetId !== null;
    const dragged = dragSheetRef.current;

    return (
        <div
            className="fixed inset-0 flex flex-col bg-white"
            style={{ zIndex: 110 }}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
                <div className="flex items-center gap-5">
                    <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                        {t('judging.manualReassign')}
                    </h2>

                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                        {(['SATURDAY', 'SUNDAY'] as const).map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                                    selectedDay === day
                                        ? 'bg-white text-[#027BFF] shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {t(`common.${day === 'SATURDAY' ? 'sat' : 'sun'}`)}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 text-xs">
                        {[1, 2, 3, 4].map(cat => (
                            <span
                                key={cat}
                                className="px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                    background: CATEGORY_COLORS[cat].bg,
                                    color: CATEGORY_COLORS[cat].text,
                                }}
                            >
                                K{cat}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-sm text-gray-400 italic">
                        {t('judging.dragHint')}
                    </span>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {t('common.close')}
                    </button>
                </div>
            </div>

            {/* Columns */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    {t('common.loading')}
                </div>
            ) : workload.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    {t('judging.noWorkload')}
                </div>
            ) : (
                <div className="flex-1 flex overflow-x-auto overflow-y-hidden">
                    <div
                        className="flex h-full"
                        style={{ minWidth: `${workload.length * 272}px`, width: '100%' }}
                    >
                        {workload.map(judge => {
                            const judgeSheets = sheetsByJudge(judge.judgeId);
                            const isTarget = dropTargetJudgeId === judge.judgeId;
                            const canReceive = isDragging && dragged &&
                                dragged.judgeId !== judge.judgeId &&
                                isJudgeQualified(judge.qualifications, dragged.category);
                            const cannotReceive = isDragging && dragged &&
                                dragged.judgeId !== judge.judgeId && !canReceive;

                            return (
                                <div
                                    key={judge.judgeId}
                                    className="flex flex-col flex-1 min-w-[240px] border-r border-gray-100 last:border-r-0 transition-colors duration-150"
                                    style={{
                                        background: isTarget ? '#EFF6FF' : cannotReceive ? '#FAFAFA' : 'white',
                                    }}
                                    onDragOver={e => handleDragOver(e, judge.judgeId)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={e => handleDrop(e, judge.judgeId)}
                                >
                                    {/* Column header */}
                                    <div
                                        className="px-3 py-3 border-b shrink-0 transition-colors"
                                        style={{
                                            background: isTarget ? '#DBEAFE' : '#F8FAFC',
                                            borderBottomColor: isTarget ? '#93C5FD' : '#F1F5F9',
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-800 truncate pr-2">
                                                {judge.judgeName}
                                            </span>
                                            <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                                                isTarget ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {judgeSheets.length}
                                            </span>
                                        </div>

                                        <div className="flex gap-1 flex-wrap">
                                            {judge.qualifications.map(q => {
                                                const catNum = parseInt(q);
                                                const colors = CATEGORY_COLORS[catNum] ?? CATEGORY_COLORS[99];
                                                const highlighted = isDragging && dragged &&
                                                    isJudgeQualified([q], dragged.category);
                                                return (
                                                    <span
                                                        key={q}
                                                        className="text-xs px-1.5 py-0.5 rounded font-semibold transition-all"
                                                        style={{
                                                            background: highlighted ? colors.dot : colors.bg,
                                                            color: highlighted ? 'white' : colors.text,
                                                        }}
                                                    >
                                                        {q === 'ALL_BREEDS' || q === 'AB' ? 'ALL' : `K${q}`}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {isDragging && dragged && dragged.judgeId !== judge.judgeId && (
                                            <div className={`mt-2 text-xs text-center py-1 rounded transition-all ${
                                                isTarget
                                                    ? 'bg-blue-500 text-white font-semibold'
                                                    : canReceive
                                                        ? 'bg-green-50 text-green-600 border border-dashed border-green-300'
                                                        : 'text-red-400 bg-red-50'
                                            }`}>
                                                {isTarget
                                                    ? `↓ ${t('judging.dropHere')}`
                                                    : canReceive
                                                        ? t('judging.canDrop')
                                                        : t('judging.notQualified')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Cat cards */}
                                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {judgeSheets.map(sheet => {
                                            const colors = CATEGORY_COLORS[sheet.category] ?? CATEGORY_COLORS[99];
                                            const isThisDragging = dragState.sheetId === sheet.id;
                                            const isSavingThis = saving === sheet.id;

                                            return (
                                                <div
                                                    key={sheet.id}
                                                    draggable={!isSavingThis}
                                                    onDragStart={e => handleDragStart(e, sheet)}
                                                    onDragEnd={handleDragEnd}
                                                    className={`flex items-start gap-2 px-2.5 py-2 rounded-lg border text-sm transition-all select-none ${
                                                        isSavingThis
                                                            ? 'opacity-40 cursor-wait bg-gray-50 border-gray-100'
                                                            : isThisDragging
                                                                ? 'opacity-30 scale-95 bg-white border-blue-200 shadow cursor-grabbing'
                                                                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm cursor-grab active:cursor-grabbing'
                                                    }`}
                                                >
                                                    <div
                                                        className="mt-1 w-2 h-2 rounded-full shrink-0"
                                                        style={{ background: colors.dot }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-800 truncate leading-tight">
                                                            {sheet.catalogNumber != null && (
                                                                <span className="text-gray-400 font-normal mr-1 text-xs">
                                                                    #{sheet.catalogNumber}
                                                                </span>
                                                            )}
                                                            {sheet.catName}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span
                                                                className="text-xs px-1 rounded font-medium"
                                                                style={{ background: colors.bg, color: colors.text }}
                                                            >
                                                                {sheet.emsCode.split(' ')[0]}
                                                            </span>
                                                            <span className="text-xs text-gray-400 truncate">
                                                                {sheet.emsCode.split(' ').slice(1).join(' ')}
                                                            </span>
                                                            {sheet.showClass && (
                                                                <span className="text-xs text-gray-300 shrink-0">
                                                                    · {sheet.showClass.replace(/_/g, ' ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSavingThis && (
                                                        <div className="text-xs text-blue-400 shrink-0 mt-0.5">…</div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {isTarget && (
                                            <div className="h-12 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 flex items-center justify-center text-xs text-blue-400">
                                                {t('judging.dropHere')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
