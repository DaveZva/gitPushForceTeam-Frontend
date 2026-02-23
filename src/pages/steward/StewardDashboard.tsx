import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { stewardApi, StewardQueueEntry, JudgeInfo } from "../../services/api/stewardApi";

const STORAGE_KEY_JUDGE = "steward_selected_judge";

const Icons = {
    ChevronRight: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    ),
    Refresh: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    ),
    Logout: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
    ),
    Bell: ({ active }: { active?: boolean }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${active ? 'animate-bounce' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
    ),
    Check: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    ),
    User: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    ),
    Megaphone: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.1-.444 1.364l-3.75 1.943c-.2.103-.422.166-.648.191a2.965 2.965 0 01-2.508-3.448 4.496 4.496 0 01-3.924-3.65m9.69.258l-5.618 1.438m5.618-1.438a3.375 3.375 0 000 6.75 3.375 3.375 0 000-6.75z" />
        </svg>
    ),
    XMark: () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
};

export const StewardDashboard = () => {
    const { t } = useTranslation();
    const [selectedJudge, setSelectedJudge] = useState<JudgeInfo | null>(null);
    const [judges, setJudges] = useState<JudgeInfo[]>([]);
    const [queue, setQueue] = useState<StewardQueueEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'QUEUE' | 'BIV' | 'BIS'>('QUEUE');

    useEffect(() => {
        const loadJudges = async () => {
            try {
                const data = await stewardApi.getJudges();
                setJudges(data);
                const savedJudgeId = localStorage.getItem(STORAGE_KEY_JUDGE);
                if (savedJudgeId) {
                    const found = data.find(j => j.id.toString() === savedJudgeId);
                    if (found) setSelectedJudge(found);
                }
            } catch (error) {
                console.error(error);
            }
        };
        loadJudges();
    }, []);

    const fetchQueue = useCallback(async () => {
        if (!selectedJudge) return;
        setLoading(true);
        try {
            const data = await stewardApi.getQueue(selectedJudge.id);
            setQueue(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedJudge]);

    useEffect(() => {
        if (selectedJudge) {
            fetchQueue();
            const interval = setInterval(fetchQueue, 10000);
            return () => clearInterval(interval);
        }
    }, [selectedJudge, fetchQueue]);

    const handleJudgeSelect = (judge: JudgeInfo) => {
        setSelectedJudge(judge);
        localStorage.setItem(STORAGE_KEY_JUDGE, judge.id.toString());
    };

    const handleLogout = () => {
        setSelectedJudge(null);
        localStorage.removeItem(STORAGE_KEY_JUDGE);
        setQueue([]);
    };

    const handleStatusChange = async (entryId: number, newStatus: StewardQueueEntry['status'], urgency: boolean = false) => {
        const updatedQueue = queue.map(entry => {
            if (entry.id === entryId) return { ...entry, status: newStatus, urgency };
            return entry;
        });

        if (newStatus === 'JUDGING') {
            const currentIndex = updatedQueue.findIndex(e => e.id === entryId);
            if (currentIndex !== -1 && updatedQueue[currentIndex + 1]) {
                if (updatedQueue[currentIndex + 1].status === 'WAITING') {
                    updatedQueue[currentIndex + 1].status = 'READY';
                }
            }
        }

        setQueue(updatedQueue);

        try {
            await stewardApi.updateStatus(entryId, newStatus, urgency);
            if (newStatus === 'JUDGING' || newStatus === 'READY') {
                await stewardApi.callForAction(entryId, 'JUDGING');
            }
        } catch (error) {
            console.error(error);
            fetchQueue();
        }
    };

    const toggleUrgency = async (entry: StewardQueueEntry) => {
        handleStatusChange(entry.id, entry.status, !entry.urgency);
    };

    const currentCat = useMemo(() => queue.find(q => q.status === 'JUDGING'), [queue]);
    const nextCat = useMemo(() => queue.find(q => q.status === 'READY'), [queue]);
    const waitingCats = useMemo(() => queue.filter(q => q.status === 'WAITING'), [queue]);

    const bivGroups = useMemo(() => {
        const groups = new Map<string, StewardQueueEntry[]>();
        queue.forEach(cat => {
            if (cat.status === 'DONE' || cat.status === 'ABSENT') return;
            const key = `${cat.breed} ${cat.ems.split(' ')[1] || ''} ${cat.group || ''}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(cat);
        });
        return Array.from(groups.entries()).filter(([_, cats]) => cats.length >= 3);
    }, [queue]);

    if (!selectedJudge) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#027BFF]">
                            <Icons.User />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('steward.selectJudgeTitle')}</h1>
                        <p className="text-gray-500 mt-2 text-sm">{t('steward.selectJudgeSubtitle')}</p>
                    </div>
                    <div className="space-y-3">
                        {judges.map(judge => (
                            <button
                                key={judge.id}
                                onClick={() => handleJudgeSelect(judge)}
                                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-[#027BFF] hover:ring-1 hover:ring-[#027BFF] transition-all bg-white flex justify-between items-center group"
                            >
                                <span className="font-bold text-gray-700 group-hover:text-[#027BFF]">{judge.name}</span>
                                <span className="text-gray-300 group-hover:text-[#027BFF]"><Icons.ChevronRight /></span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20 md:pb-0 font-sans">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 shadow-sm flex justify-between items-center">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedJudge.name}</h2>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t('steward.role')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchQueue} className="p-2 text-gray-400 hover:text-[#027BFF] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                        <Icons.Refresh className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                        <Icons.Logout />
                    </button>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[300px] flex flex-col">
                        <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
                            <span className="font-bold uppercase text-sm tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t('steward.status.judging')}
                            </span>
                            {currentCat && (
                                <button
                                    onClick={() => toggleUrgency(currentCat)}
                                    className={`text-xs font-bold px-3 py-1 rounded transition-colors flex items-center gap-2 ${currentCat.urgency ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <Icons.Bell active={currentCat.urgency} />
                                    {currentCat.urgency ? t('steward.urgencyActive') : t('steward.increaseUrgency')}
                                </button>
                            )}
                        </div>

                        {currentCat ? (
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="text-6xl font-black text-gray-900 tracking-tighter">#{currentCat.catalogNumber}</span>
                                        <span className="text-2xl text-gray-400 font-light">{currentCat.sex}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-[#027BFF] mb-4">{currentCat.catName}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-lg inline-flex">
                                        <span>EMS: <strong className="text-gray-900">{currentCat.ems}</strong></span>
                                        <span className="text-gray-300">|</span>
                                        <span>Born: <strong className="text-gray-900">{currentCat.birthDate}</strong></span>
                                        {currentCat.group && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <span>Group: <strong className="text-gray-900">{currentCat.group}</strong></span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleStatusChange(currentCat.id, 'DONE')}
                                    className="mt-8 w-full bg-[#027BFF] hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <Icons.Check />
                                    {t('steward.finishJudging')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                                <span className="text-lg font-medium">{t('steward.tableEmpty')}</span>
                                <span className="text-sm">{t('steward.callNextCat')}</span>
                            </div>
                        )}
                    </div>

                    {nextCat && (
                        <div className="bg-white rounded-xl shadow-sm border border-l-4 border-l-yellow-400 border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-50 text-yellow-700 w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl border border-yellow-100">
                                    {nextCat.catalogNumber}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{t('steward.status.ready')}</div>
                                    <div className="font-bold text-gray-900">{nextCat.ems} <span className="font-normal text-gray-500">({nextCat.sex})</span></div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleStatusChange(nextCat.id, 'JUDGING')}
                                className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Icons.Megaphone />
                                {t('steward.callToTable')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 flex flex-col h-[calc(100vh-140px)] sticky top-24">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            {[
                                { id: 'QUEUE', label: t('steward.tabs.queue') },
                                { id: 'BIV', label: t('steward.tabs.biv'), count: bivGroups.length },
                                { id: 'BIS', label: 'BIS / NOM' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-4 font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors relative ${
                                        activeTab === tab.id
                                            ? 'text-[#027BFF] border-b-2 border-[#027BFF] bg-blue-50/10'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count ? (
                                        <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span>
                                    ) : null}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50">
                            {activeTab === 'QUEUE' && (
                                <>
                                    {waitingCats.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400 text-sm">{t('steward.queueEmpty')}</div>
                                    ) : (
                                        waitingCats.map(cat => (
                                            <div key={cat.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-[#027BFF] transition-all shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-900 font-bold w-8 text-right">{cat.catalogNumber}</span>
                                                    <div className="h-8 w-px bg-gray-100"></div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{cat.ems}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{cat.catName}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleStatusChange(cat.id, 'READY')}
                                                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                        title={t('steward.setReady')}
                                                    >
                                                        <Icons.Megaphone />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(cat.id, 'ABSENT')}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title={t('steward.setAbsent')}
                                                    >
                                                        <Icons.XMark />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}

                            {activeTab === 'BIV' && (
                                <div className="space-y-3">
                                    {bivGroups.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400 text-sm">{t('steward.noBivAvailable')}</div>
                                    ) : (
                                        bivGroups.map(([groupName, cats]) => (
                                            <div key={groupName} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                                <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
                                                    <span className="font-bold text-[#027BFF] text-sm">{groupName}</span>
                                                    <span className="text-xs font-bold text-blue-400">{cats.length} {t('steward.cats')}</span>
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {cats.map(c => (
                                                            <span key={c.id} className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                                                                #{c.catalogNumber}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <button className="w-full bg-white border border-[#027BFF] text-[#027BFF] hover:bg-blue-50 font-bold py-2 rounded-lg text-sm transition-colors">
                                                        {t('steward.startBiv')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'BIS' && (
                                <div className="p-2 grid grid-cols-1 gap-3">
                                    <button className="bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 p-4 rounded-xl font-bold flex items-center justify-between group transition-colors">
                                        <span>{t('steward.openNominations')}</span>
                                        <Icons.ChevronRight />
                                    </button>
                                    <button className="bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-xl font-bold flex items-center justify-between group transition-colors shadow-lg">
                                        <span>{t('steward.goToPanelPanel')}</span>
                                        <Icons.ChevronRight />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};