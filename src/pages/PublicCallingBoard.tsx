import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

interface BoardCat {
    catalogNumber: number;
    ems: string;
    type: string;
    urgency: string;
}

interface TableState {
    judgeId: number;
    judgeName: string;
    tableNo: string;
    currentCat?: BoardCat | null;
    currentCats?: BoardCat[];
    preparingCats: BoardCat[];
    waitingCats: BoardCat[];
    isPaused?: boolean;
}

const playGong = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const playTone = (freq: number, startTime: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);
            osc.start(startTime);
            osc.stop(startTime + 1.5);
        };
        const now = ctx.currentTime;
        playTone(659.25, now);
        playTone(523.25, now + 0.2);
    } catch (e) {
        console.error(e);
    }
};

export const PublicCallingBoard = () => {
    const { t } = useTranslation();
    const { showId } = useParams<{ showId: string }>();
    const currentShowId = Number(showId) || 1;
    const [tables, setTables] = useState<TableState[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMuted, setIsMuted] = useState(false);
    const [boardLng, setBoardLng] = useState<'cs' | 'en'>('cs');
    const [isTextVisible, setIsTextVisible] = useState(true);
    const isMutedRef = useRef(false);
    const languageSwitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stompClient = useRef<Client | null>(null);

    const boardTextClass = `board-text-transition ${isTextVisible ? 'board-text-visible' : 'board-text-hidden'}`;
    const translateBoard = (key: string, options?: Record<string, unknown>) => t(key, { lng: boardLng, ...options });

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const languageTimer = setInterval(() => {
            setIsTextVisible(false);
            if (languageSwitchTimeoutRef.current) {
                clearTimeout(languageSwitchTimeoutRef.current);
            }
            languageSwitchTimeoutRef.current = setTimeout(() => {
                setBoardLng(prev => (prev === 'cs' ? 'en' : 'cs'));
                setIsTextVisible(true);
            }, 220);
        }, 5000);

        return () => {
            clearInterval(languageTimer);
            if (languageSwitchTimeoutRef.current) {
                clearTimeout(languageSwitchTimeoutRef.current);
            }
        };
    }, []);

    const fetchBoardState = useCallback(async () => {
        try {
            const res = await api.get(`/calling/show/${currentShowId}/board-state`);
            setTables(res.data);
        } catch (error) {
            console.error(error);
        }
    }, [currentShowId]);

    useEffect(() => {
        if (!isStarted) return;
        fetchBoardState();

        const backendUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
            : 'http://localhost:8080';

        const client = new Client({
            webSocketFactory: () => new SockJS(`${backendUrl}/ws-calling`),
            debug: () => { },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/show/${currentShowId}/board`, () => {
                    fetchBoardState();
                    if (!isMutedRef.current) playGong();
                });
            },
        });
        client.activate();
        stompClient.current = client;
        return () => {
            if (stompClient.current) stompClient.current.deactivate();
        };
    }, [currentShowId, fetchBoardState, isStarted]);

    const getColorClass = (type: string, urgency: string) => {
        if (urgency === 'FINAL_CALL') return 'bg-red-600 text-white animate-pulse border-4 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.6)]';
        let colorClass = '';
        switch (type) {
            case 'BIS': colorClass = 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'; break;
            case 'BIV': colorClass = 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'; break;
            default: colorClass = 'bg-slate-800 text-white'; break;
        }
        if (urgency === 'URGENT') return `${colorClass} border-4 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.7)]`;
        return `${colorClass} border-2 ${type === 'NORMAL' || !type ? 'border-slate-600' : 'border-white/40'} shadow-xl`;
    };

    const getTypeLabel = (type: string) => {
        if (type === 'NORMAL' || !type) return '';
        return <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-1.5 2xl:px-10 2xl:py-3 min-[2560px]:px-14 min-[2560px]:py-5 rounded-full text-lg sm:text-xl 2xl:text-3xl min-[2560px]:text-5xl font-black tracking-widest uppercase border-2 border-white/20 shadow-2xl z-10">{type}</span>;
    };

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-10 rounded-2xl text-center border border-slate-700 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-white mb-4 tracking-[-2px]">
                        <span className={boardTextClass}>{translateBoard('board.title')}</span>
                    </h1>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white hover:text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-500/30 cursor-pointer"
                    >
                        <span className={boardTextClass}>{translateBoard('board.start')}</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 p-3 sm:p-5 2xl:p-8 min-[2560px]:p-12 flex flex-col font-sans">
            <header className="flex flex-wrap justify-between items-end mb-4 2xl:mb-8 min-[2560px]:mb-12 border-b border-slate-800 pb-3 2xl:pb-6 min-[2560px]:pb-8 shrink-0 gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl min-[2560px]:text-[5rem] font-black text-white tracking-tight uppercase leading-none">
                        <span className={boardTextClass}>{translateBoard('board.activeJudging')}</span>
                    </h1>
                    <div className="text-slate-500 text-xs sm:text-sm 2xl:text-xl min-[2560px]:text-3xl font-bold tracking-widest mt-1 2xl:mt-3">
                        <span className={boardTextClass}>{translateBoard('board.broadcast')}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 2xl:gap-3 select-none">
                    <div className="flex items-center gap-3 2xl:gap-6 min-[2560px]:gap-8">
                        <button
                            onClick={() => setIsMuted(m => !m)}
                            title={isMuted ? translateBoard('board.soundOn') : translateBoard('board.soundOff')}
                            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 2xl:w-16 2xl:h-16 min-[2560px]:w-24 min-[2560px]:h-24 rounded-lg 2xl:rounded-2xl transition-all text-lg sm:text-xl 2xl:text-3xl min-[2560px]:text-5xl ${isMuted
                                ? 'bg-red-500/20 border border-red-500/40 hover:bg-red-500/30'
                                : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                            }`}
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                        <div className="text-slate-400 font-mono text-xl sm:text-2xl 2xl:text-4xl min-[2560px]:text-6xl font-bold">{currentTime.toLocaleTimeString()}</div>
                    </div>
                    <div className="flex items-center gap-2 2xl:gap-4 min-[2560px]:gap-6 mt-1">
                        <span className="text-slate-300 font-bold text-sm sm:text-base 2xl:text-2xl min-[2560px]:text-4xl tracking-tight">Pawdium</span>
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] 2xl:text-base min-[2560px]:text-xl font-black tracking-widest uppercase px-2 py-0.5 2xl:px-4 2xl:py-1 rounded-full">Beta</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 2xl:gap-8 min-[2560px]:gap-12 mt-2 2xl:mt-4">
                {[1, 2, 3, 4].map(tableNum => {
                    const table = tables.find(t => t.tableNo === `T${tableNum}`);
                    if (!table) {
                        return (
                            <div key={`empty-${tableNum}`} className="bg-slate-900 rounded-2xl 2xl:rounded-[2rem] border border-slate-800 flex flex-col shadow-xl relative min-h-[250px] 2xl:min-h-[400px] min-[2560px]:min-h-[600px]">
                                <div className="bg-slate-800/40 px-5 py-3 2xl:px-8 2xl:py-6 min-[2560px]:px-12 min-[2560px]:py-8 text-center border-b border-slate-800 flex justify-between items-center rounded-t-2xl 2xl:rounded-t-[2rem]">
                                    <span className="bg-slate-800/80 text-slate-500 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full text-sm sm:text-base 2xl:text-2xl min-[2560px]:text-4xl font-bold tracking-wider border border-slate-700 uppercase">
                                        <span className={boardTextClass}>{translateBoard('board.table')} {tableNum}</span>
                                    </span>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl min-[2560px]:text-6xl font-black text-slate-700 tracking-tight truncate">
                                        <span className={boardTextClass}>{translateBoard('board.waitingSteward')}</span>
                                    </h2>
                                    <span className="w-[70px] 2xl:w-[120px] min-[2560px]:w-[180px]"></span>
                                </div>
                                <div className="p-4 2xl:p-8 min-[2560px]:p-12 flex-1 flex flex-col gap-4 2xl:gap-8 min-[2560px]:gap-12">
                                    <div className="flex-1 bg-slate-800/20 rounded-xl 2xl:rounded-3xl border border-slate-800/50 border-dashed flex items-center justify-center text-slate-700 text-xl sm:text-2xl lg:text-3xl 2xl:text-5xl min-[2560px]:text-7xl font-bold tracking-widest min-h-[150px] 2xl:min-h-[250px] min-[2560px]:min-h-[350px]">
                                        <span className={boardTextClass}>{translateBoard('board.unoccupied')}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 2xl:gap-8 min-[2560px]:gap-12 opacity-20">
                                        <div className="h-[80px] 2xl:h-[140px] min-[2560px]:h-[200px] bg-slate-800 rounded-lg 2xl:rounded-2xl border border-slate-700 border-dashed"></div>
                                        <div className="h-[80px] 2xl:h-[140px] min-[2560px]:h-[200px] bg-slate-800 rounded-lg 2xl:rounded-2xl border border-slate-700 border-dashed"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    const displayCats = table.currentCats?.length ? table.currentCats : (table.currentCat ? [table.currentCat] : []);

                    return (
                        <div key={table.judgeId} className="bg-slate-900 rounded-2xl 2xl:rounded-[2rem] border border-slate-800 flex flex-col shadow-2xl relative h-full">
                            <div className="bg-slate-800 px-5 py-3 2xl:px-8 2xl:py-6 min-[2560px]:px-12 min-[2560px]:py-8 text-center border-b border-slate-700 flex justify-between items-center rounded-t-2xl 2xl:rounded-t-[2rem]">
                                <span className="bg-blue-600/20 text-blue-400 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full text-sm sm:text-base 2xl:text-2xl min-[2560px]:text-4xl font-bold tracking-wider border border-blue-500/30 uppercase">
                                    <span className={boardTextClass}>{translateBoard('board.table')} {tableNum}</span>
                                </span>
                                <h2 className="text-2xl sm:text-3xl 2xl:text-5xl min-[2560px]:text-7xl font-black text-white tracking-tight truncate px-2">{table.judgeName}</h2>
                                <span className="w-[70px] 2xl:w-[120px] min-[2560px]:w-[180px]"></span>
                            </div>

                            <div className="p-4 sm:p-5 2xl:p-8 min-[2560px]:p-12 flex-1 flex flex-col gap-4 sm:gap-5 2xl:gap-8 min-[2560px]:gap-12">
                                <div className="flex-1 flex flex-col">
                                    {displayCats.length > 0 ? (
                                        <div className={`relative rounded-xl 2xl:rounded-3xl pt-12 pb-8 2xl:pt-24 2xl:pb-16 min-[2560px]:pt-32 min-[2560px]:pb-24 px-4 sm:px-6 2xl:px-12 flex flex-col items-center justify-center transition-all duration-300 w-full flex-grow min-h-[200px] 2xl:min-h-[400px] min-[2560px]:min-h-[600px] ${getColorClass(displayCats[0].type, displayCats[0].urgency)}`}>
                                            {getTypeLabel(displayCats[0].type)}

                                            {displayCats[0].type !== 'BIV' && displayCats[0].type !== 'BIS' && (
                                                <span className="text-4xl sm:text-5xl 2xl:text-6xl min-[2560px]:text-[6rem] font-bold opacity-90 drop-shadow-md shrink-0 mb-4 2xl:mb-8 min-[2560px]:mb-12 text-center">
                                                    {displayCats[0].ems}
                                                </span>
                                            )}

                                            {(displayCats[0].type === 'BIV' || displayCats[0].type === 'BIS') && (
                                                <span className="text-xl sm:text-2xl 2xl:text-3xl min-[2560px]:text-5xl font-bold opacity-70 tracking-widest mb-4 2xl:mb-8 min-[2560px]:mb-12 shrink-0 text-center">
                                                    <span className={boardTextClass}>{translateBoard('board.catCount', { count: displayCats.length })}</span>
                                                </span>
                                            )}

                                            <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 2xl:gap-x-16 min-[2560px]:gap-x-24 gap-y-4 sm:gap-y-6 2xl:gap-y-12 min-[2560px]:gap-y-20 w-full align-middle">
                                                {displayCats.map((cat, index) => (
                                                    <span
                                                        key={`${cat.catalogNumber}-${index}`}
                                                        className="font-black tracking-tighter drop-shadow-lg font-mono break-words [font-variant-ligatures:none] [font-variant-numeric:normal] text-6xl sm:text-7xl md:text-[80px] lg:text-[95px] xl:text-[110px] 2xl:text-[180px] min-[2560px]:text-[280px] leading-normal pb-1 shrink-0"
                                                    >
                                                        #{cat.catalogNumber}
                                                    </span>
                                                ))}
                                            </div>

                                            {displayCats[0].urgency === 'FINAL_CALL' && (
                                                <span className="absolute bottom-3 2xl:bottom-8 min-[2560px]:bottom-12 left-1/2 -translate-x-1/2 bg-white text-red-600 px-6 py-1.5 2xl:px-10 2xl:py-3 min-[2560px]:px-14 min-[2560px]:py-5 rounded-full text-base sm:text-lg 2xl:text-3xl min-[2560px]:text-5xl font-black uppercase tracking-widest animate-bounce shadow-xl text-center whitespace-nowrap">
                                                    <span className={boardTextClass}>{translateBoard('board.finalCall')}</span>
                                                </span>
                                            )}
                                        </div>
                                    ) : table.isPaused ? (
                                        <div className="w-full h-full min-h-[200px] 2xl:min-h-[400px] min-[2560px]:min-h-[600px] bg-yellow-500/10 rounded-xl 2xl:rounded-3xl border border-yellow-500/30 border-dashed flex items-center justify-center text-yellow-500 text-3xl sm:text-4xl lg:text-5xl 2xl:text-[4rem] min-[2560px]:text-[6rem] font-black tracking-widest animate-pulse text-center p-6 2xl:p-12 flex-grow">
                                            <span className={boardTextClass}>{translateBoard('board.pausedJudging')}</span>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full min-h-[200px] 2xl:min-h-[400px] min-[2560px]:min-h-[600px] bg-slate-800/50 rounded-xl 2xl:rounded-3xl border border-slate-700/50 border-dashed flex items-center justify-center text-slate-600 text-2xl sm:text-3xl lg:text-4xl 2xl:text-[3rem] min-[2560px]:text-[5rem] font-bold p-6 2xl:p-12 flex-grow">
                                            <span className={boardTextClass}>{translateBoard('board.tableEmpty')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 2xl:gap-8 min-[2560px]:gap-12 shrink-0">
                                    <div className="flex flex-col">
                                        <div className="text-slate-500 text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-3xl min-[2560px]:text-[3rem] font-black uppercase tracking-widest mb-2 sm:mb-3 2xl:mb-4 min-[2560px]:mb-8 text-center text-yellow-500">
                                            <span className={boardTextClass}>{translateBoard('board.preparing')}</span>
                                        </div>
                                        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-2 2xl:gap-4 min-[2560px]:gap-6">
                                            {table.preparingCats.length > 0 ? table.preparingCats.slice(0, 6).map((cat, index) => (
                                                <div key={`prep-${cat.catalogNumber}-${index}`} className="bg-slate-800 border-l-[3px] 2xl:border-l-[6px] border-yellow-500 rounded-lg 2xl:rounded-2xl p-3 sm:p-4 2xl:p-6 min-[2560px]:p-8 text-center flex flex-col justify-center shadow-sm min-h-[70px] sm:min-h-[80px] 2xl:min-h-[120px] min-[2560px]:min-h-[180px]">
                                                    <div className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl min-[2560px]:text-[4.5rem] font-black text-white leading-none font-mono [font-variant-ligatures:none]">#{cat.catalogNumber}</div>
                                                    <div className="text-xs sm:text-sm 2xl:text-2xl min-[2560px]:text-4xl text-slate-400 font-bold mt-2 2xl:mt-4 truncate leading-none">{cat.ems}</div>
                                                </div>
                                            )) : (
                                                <div className="col-span-full bg-slate-800/30 rounded-lg 2xl:rounded-2xl p-4 2xl:p-6 text-center text-slate-600 text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl min-[2560px]:text-[6rem] border border-slate-700/50 border-dashed flex items-center justify-center min-h-[70px] sm:min-h-[80px] 2xl:min-h-[120px] min-[2560px]:min-h-[180px]">-</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="text-slate-500 text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-3xl min-[2560px]:text-[3rem] font-black uppercase tracking-widest mb-2 sm:mb-3 2xl:mb-4 min-[2560px]:mb-8 text-center">
                                            <span className={boardTextClass}>{translateBoard('board.nextInLine')}</span>
                                        </div>
                                        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-2 2xl:gap-4 min-[2560px]:gap-6">
                                            {table.waitingCats.length > 0 ? table.waitingCats.slice(0, 6).map((cat, index) => (
                                                <div key={`wait-${cat.catalogNumber}-${index}`} className="bg-slate-800 border-l-[3px] 2xl:border-l-[6px] border-slate-600 rounded-lg 2xl:rounded-2xl p-3 sm:p-4 2xl:p-6 min-[2560px]:p-8 flex items-center justify-center min-h-[70px] sm:min-h-[80px] 2xl:min-h-[120px] min-[2560px]:min-h-[180px]">
                                                    <div className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl min-[2560px]:text-[4.5rem] font-bold text-slate-300 leading-none font-mono [font-variant-ligatures:none]">#{cat.catalogNumber}</div>
                                                </div>
                                            )) : (
                                                <div className="col-span-full bg-slate-800/30 rounded-lg 2xl:rounded-2xl p-4 2xl:p-6 text-center text-slate-600 text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl min-[2560px]:text-[6rem] border border-slate-700/50 border-dashed flex items-center justify-center min-h-[70px] sm:min-h-[80px] 2xl:min-h-[120px] min-[2560px]:min-h-[180px]">-</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};