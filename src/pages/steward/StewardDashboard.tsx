import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { stewardApi, StewardQueueEntry, StewardJudgeDto } from "../../services/api/stewardApi";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { StewardHeader } from "../../components/steward/StewardHeader";
import { JudgeSelector } from "../../components/steward/JudgeSelector";
import { ActiveTablePanel } from "../../components/steward/ActiveTablePanel";
import { QueuePanel } from "../../components/steward/QueuePanel";

export const StewardDashboard = () => {
    const { t } = useTranslation();
    const { showId } = useParams<{ showId: string }>();
    const currentShowId = Number(showId) || 1;
    const storageKey = `steward_selected_judge_${currentShowId}`;

    const [selectedJudge, setSelectedJudge] = useState<StewardJudgeDto | null>(null);
    const [judges, setJudges] = useState<StewardJudgeDto[]>([]);
    const [queue, setQueue] = useState<StewardQueueEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'QUEUE' | 'BIV' | 'BIS'>('QUEUE');
    const [judgeToLock, setJudgeToLock] = useState<StewardJudgeDto | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const loadJudges = useCallback(async () => {
        try {
            const data = await stewardApi.getJudges(currentShowId);
            setJudges(data);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [currentShowId]);

    useEffect(() => {
        const init = async () => {
            const data = await loadJudges();
            const savedJudgeId = localStorage.getItem(storageKey);
            if (savedJudgeId) {
                const found = data.find(j => j.id.toString() === savedJudgeId);
                if (found && found.isLockedByMe) {
                    setSelectedJudge(found);
                } else {
                    localStorage.removeItem(storageKey);
                }
            }
        };
        init();
    }, [loadJudges, storageKey]);

    const fetchQueue = useCallback(async () => {
        if (!selectedJudge) return;
        try {
            const data = await stewardApi.getQueue(currentShowId, selectedJudge.id);
            setQueue(data.sort((a, b) => a.catalogNumber - b.catalogNumber));
        } catch (error) {
            console.error(error);
        }
    }, [selectedJudge, currentShowId]);

    useEffect(() => {
        if (selectedJudge) {
            fetchQueue();
            const interval = setInterval(fetchQueue, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedJudge, fetchQueue]);

    const initiateLock = (judge: StewardJudgeDto) => {
        if (judge.isLockedByMe) {
            setSelectedJudge(judge);
            localStorage.setItem(storageKey, judge.id.toString());
            return;
        }
        setJudgeToLock(judge);
    };

    const confirmTableSelection = async (tableNumber: number) => {
        if (!judgeToLock) return;
        try {
            const success = await stewardApi.lockJudge(currentShowId, judgeToLock.id, tableNumber);
            if (success) {
                const updatedJudge = { ...judgeToLock, tableNumber, isLockedByMe: true };
                setSelectedJudge(updatedJudge);
                localStorage.setItem(storageKey, updatedJudge.id.toString());
                await loadJudges();
            } else {
                alert(t('steward.tableTakenError'));
                await loadJudges();
            }
        } catch (error) {
            console.error(error);
            alert(t('steward.lockError'));
        }
        setJudgeToLock(null);
    };

    const handleLeaveTable = async () => {
        setSelectedJudge(null);
        localStorage.removeItem(storageKey);
        setQueue([]);
        await loadJudges();
    };

    const handleReleaseTable = async () => {
        if (window.confirm(t('steward.confirmRelease'))) {
            if (selectedJudge) {
                try {
                    await stewardApi.unlockJudge(currentShowId, selectedJudge.id);
                } catch (error) {
                    console.error(error);
                }
            }
            setSelectedJudge(null);
            localStorage.removeItem(storageKey);
            setQueue([]);
            await loadJudges();
        }
    };

    const handleStatusChange = async (cat: StewardQueueEntry, newStatus: string) => {
        try {
            await stewardApi.updateSheetStatus(cat.id, newStatus);
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePrepareGroup = async (groupCats: StewardQueueEntry[]) => {
        try {
            const promises = groupCats
                .filter(c => c.status !== 'READY' && c.status !== 'JUDGING')
                .map(c => stewardApi.updateSheetStatus(c.id, 'READY'));
            await Promise.all(promises);
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCallToTable = async (cat: StewardQueueEntry, callType: string = 'NORMAL') => {
        try {
            await stewardApi.callToBoard({
                showId: currentShowId,
                tableNo: `T${selectedJudge?.tableNumber}`,
                judgeName: selectedJudge?.name || "Judge",
                catNumber: cat.catalogNumber,
                category: callType,
                urgency: 'NORMAL'
            });
            await stewardApi.updateSheetStatus(cat.id, 'JUDGING');
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCallBivGroup = async (cats: StewardQueueEntry[]) => {
        try {
            await Promise.all(cats.map(cat => stewardApi.callToBoard({
                showId: currentShowId,
                tableNo: `T${selectedJudge?.tableNumber}`,
                judgeName: selectedJudge?.name || "Judge",
                catNumber: cat.catalogNumber,
                category: 'BIV',
                urgency: 'NORMAL'
            })));
            await Promise.all(cats.map(cat => stewardApi.updateSheetStatus(cat.id, 'JUDGING')));
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetUrgency = async (cat: StewardQueueEntry, newUrgency: string) => {
        if (!cat.callingRecordId) return;
        try {
            await stewardApi.updateUrgency(cat.callingRecordId, newUrgency);
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFinishJudging = async (cat: StewardQueueEntry) => {
        try {
            if (cat.callingRecordId) {
                await stewardApi.removeFromBoard(cat.callingRecordId);
            }
            await stewardApi.updateSheetStatus(cat.id, 'DONE');
            fetchQueue();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFinishAll = async (cats: StewardQueueEntry[]) => {
        try {
            await Promise.all(cats.map(cat => handleFinishJudging(cat)));
        } catch (err) {
            console.error(err);
        }
    };

    const handleTogglePause = async () => {
        if (!selectedJudge) return;
        const newPauseState = !isPaused;
        setIsPaused(newPauseState);
        try {
            await stewardApi.togglePause(currentShowId, selectedJudge.id, newPauseState);
            fetchQueue();
        } catch (err) {
            console.error(err);
            setIsPaused(!newPauseState);
        }
    };

    const currentCats = useMemo(() => queue.filter(q => q.status === 'JUDGING'), [queue]);
    const readyCats = useMemo(() => queue.filter(q => q.status === 'READY'), [queue]);
    const waitingCats = useMemo(() => queue.filter(q => q.status === 'WAITING'), [queue]);
    const allActiveCats = useMemo(() => queue.filter(q => q.status !== 'ABSENT'), [queue]);

    const bivGroups = useMemo(() => {
        const groups = new Map<string, StewardQueueEntry[]>();
        queue.forEach(cat => {
            if (cat.status === 'ABSENT') return;
            const key = `${cat.breed} ${cat.ems.split(' ')[1] || ''}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(cat);
        });
        return Array.from(groups.entries()).filter(([_, cats]) => cats.length >= 3);
    }, [queue]);

    const usedTables = useMemo(() => judges.map(j => j.tableNumber).filter((t): t is number => t !== null), [judges]);

    if (loading) return <LoadingSpinner fullScreen />;

    if (!selectedJudge) {
        return (
            <JudgeSelector
                judges={judges}
                usedTables={usedTables}
                onInitiateLock={initiateLock}
                onConfirmTable={confirmTableSelection}
                judgeToLock={judgeToLock}
                onCancelLock={() => setJudgeToLock(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20 md:pb-0 font-sans">
            <StewardHeader
                judgeName={selectedJudge.name}
                tableNumber={selectedJudge.tableNumber}
                onRefresh={fetchQueue}
                onLeave={handleLeaveTable}
                onRelease={handleReleaseTable}
            />

            <div className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <ActiveTablePanel
                    currentCats={currentCats}
                    readyCats={readyCats}
                    isPaused={isPaused}
                    onTogglePause={handleTogglePause}
                    onSetUrgency={handleSetUrgency}
                    onFinishJudging={handleFinishJudging}
                    onFinishAll={handleFinishAll}
                    onCallToTable={handleCallToTable}
                    onStatusChange={handleStatusChange}
                />

                <QueuePanel
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    waitingCats={waitingCats}
                    bivGroups={bivGroups}
                    allActiveCats={allActiveCats}
                    onStatusChange={handleStatusChange}
                    onCallToTable={handleCallToTable}
                    onCallBivGroup={handleCallBivGroup}
                    onPrepareGroup={handlePrepareGroup}
                />
            </div>
        </div>
    );
};