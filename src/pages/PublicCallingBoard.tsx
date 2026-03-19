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

const useContainerSize = (ref: React.RefObject<HTMLDivElement>) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, [ref]);
    return size;
};

const TableCard = ({
                       tableNum,
                       table,
                       boardTextClass,
                       translateBoard,
                   }: {
    tableNum: number;
    table: TableState | undefined;
    boardTextClass: string;
    translateBoard: (key: string, options?: Record<string, unknown>) => string;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { width: cardW, height: cardH } = useContainerSize(cardRef as React.RefObject<HTMLDivElement>);

    const scale = cardW > 0 ? Math.min(cardW / 320, cardH > 0 ? cardH / 280 : 999) : 1;
    const fs = (base: number) => `${Math.round(base * scale)}px`;

    const getColorClass = (type: string, urgency: string) => {
        if (urgency === 'FINAL_CALL') return 'bg-red-600 text-white animate-pulse border-4 border-red-400';
        let c = '';
        switch (type) {
            case 'BIS': c = 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'; break;
            case 'BIV': c = 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'; break;
            default: c = 'bg-slate-800 text-white'; break;
        }
        if (urgency === 'URGENT') return `${c} border-4 border-yellow-400`;
        return `${c} border-2 ${type === 'NORMAL' || !type ? 'border-slate-600' : 'border-white/40'}`;
    };

    if (!table) {
        return (
            <div ref={cardRef} className="bg-slate-900/40 rounded-2xl border border-slate-800/40 flex flex-col overflow-hidden min-h-0">
                <div className="bg-slate-800/20 px-3 py-2 border-b border-slate-800/40 flex justify-between items-center shrink-0">
                    <span
                        className="bg-slate-800/50 text-slate-500 px-2 py-0.5 rounded-full font-black tracking-wider border border-slate-700/50 uppercase"
                        style={{ fontSize: fs(10) }}
                    >
                        <span className={boardTextClass}>{translateBoard('board.table')} {tableNum}</span>
                    </span>
                    <span
                        className="font-black text-slate-700 tracking-tight truncate"
                        style={{ fontSize: fs(13) }}
                    >
                        <span className={boardTextClass}>{translateBoard('board.waitingSteward')}</span>
                    </span>
                    <span style={{ width: fs(50) }} />
                </div>
                <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                    <span
                        className="text-slate-700 font-black tracking-widest uppercase"
                        style={{ fontSize: fs(14) }}
                    >
                        <span className={boardTextClass}>{translateBoard('board.unoccupied')}</span>
                    </span>
                </div>
            </div>
        );
    }

    const displayCats = (table.currentCats?.length ? table.currentCats : (table.currentCat ? [table.currentCat] : []))
        .slice()
        .sort((a, b) => a.catalogNumber - b.catalogNumber);

    const numSize = displayCats.length > 2 ? fs(44) : fs(64);

    return (
        <div ref={cardRef} className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl min-h-0">
            <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex justify-between items-center shrink-0">
                <span
                    className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-black tracking-wider border border-blue-500/30 uppercase"
                    style={{ fontSize: fs(10) }}
                >
                    <span className={boardTextClass}>{translateBoard('board.table')} {tableNum}</span>
                </span>
                <span
                    className="font-black text-white tracking-tight truncate px-2"
                    style={{ fontSize: fs(15) }}
                >
                    {table.judgeName}
                </span>
                <span style={{ width: fs(50) }} />
            </div>

            <div className="flex-1 flex flex-col gap-2 p-2 min-h-0">
                <div className="flex-1 min-h-0 relative">
                    {displayCats.length > 0 ? (
                        <div className={`relative rounded-xl w-full h-full flex flex-col items-center justify-center shadow-xl ${getColorClass(displayCats[0].type, displayCats[0].urgency)}`}>
                            {(displayCats[0].type !== 'NORMAL' && displayCats[0].type) && (
                                <span
                                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-0.5 rounded-full font-black tracking-widest uppercase border border-white/20 z-10"
                                    style={{ fontSize: fs(10) }}
                                >
                                    {displayCats[0].type}
                                </span>
                            )}

                            {displayCats[0].type !== 'BIV' && displayCats[0].type !== 'BIS' && (
                                <span
                                    className="font-bold opacity-80 drop-shadow-md shrink-0 mb-1"
                                    style={{ fontSize: fs(18) }}
                                >
                                    {displayCats[0].ems}
                                </span>
                            )}

                            {(displayCats[0].type === 'BIV' || displayCats[0].type === 'BIS') && (
                                <span
                                    className="font-bold opacity-60 tracking-widest mb-1"
                                    style={{ fontSize: fs(11) }}
                                >
                                    <span className={boardTextClass}>{translateBoard('board.catCount', { count: displayCats.length })}</span>
                                </span>
                            )}

                            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 w-full px-2 overflow-hidden">
                                {displayCats.map(cat => (
                                    <span
                                        key={cat.catalogNumber}
                                        className="font-black tracking-tighter leading-none drop-shadow-lg font-mono"
                                        style={{ fontSize: numSize }}
                                    >
                                        #{cat.catalogNumber}
                                    </span>
                                ))}
                            </div>

                            {displayCats[0].urgency === 'FINAL_CALL' && (
                                <span
                                    className="absolute bottom-2 bg-white text-red-600 px-4 py-0.5 rounded-full font-black uppercase tracking-widest animate-bounce shadow-xl"
                                    style={{ fontSize: fs(10) }}
                                >
                                    <span className={boardTextClass}>{translateBoard('board.finalCall')}</span>
                                </span>
                            )}
                        </div>
                    ) : table.isPaused ? (
                        <div className="w-full h-full bg-yellow-500/10 rounded-xl border border-yellow-500/30 border-dashed flex items-center justify-center text-yellow-500 font-black tracking-widest animate-pulse text-center p-2">
                            <span className={boardTextClass} style={{ fontSize: fs(14) }}>{translateBoard('board.pausedJudging')}</span>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-800/50 rounded-xl border border-slate-700/50 border-dashed flex items-center justify-center text-slate-600 font-bold">
                            <span className={boardTextClass} style={{ fontSize: fs(13) }}>{translateBoard('board.tableEmpty')}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 shrink-0">
                    <div>
                        <div
                            className="text-yellow-500 font-black uppercase tracking-widest mb-1 text-center"
                            style={{ fontSize: fs(8) }}
                        >
                            <span className={boardTextClass}>{translateBoard('board.preparing')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            {table.preparingCats.length > 0 ? table.preparingCats.slice(0, 6).map(cat => (
                                <div key={cat.catalogNumber} className="bg-slate-800 border-l-2 border-yellow-500 rounded p-1 text-center flex flex-col justify-center">
                                    <div className="font-black text-white leading-none font-mono" style={{ fontSize: fs(12) }}>#{cat.catalogNumber}</div>
                                    <div className="text-slate-400 font-bold mt-0.5 truncate leading-none" style={{ fontSize: fs(8) }}>{cat.ems}</div>
                                </div>
                            )) : (
                                <div className="col-span-3 bg-slate-800/30 rounded p-1 text-center text-slate-600 border border-slate-700/50 border-dashed flex items-center justify-center" style={{ fontSize: fs(10) }}>-</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div
                            className="text-slate-500 font-black uppercase tracking-widest mb-1 text-center"
                            style={{ fontSize: fs(8) }}
                        >
                            <span className={boardTextClass}>{translateBoard('board.nextInLine')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            {table.waitingCats.length > 0 ? table.waitingCats.slice(0, 6).map(cat => (
                                <div key={cat.catalogNumber} className="bg-slate-800 border-l-2 border-slate-600 rounded p-1 flex items-center justify-center">
                                    <div className="font-bold text-slate-300 leading-none font-mono" style={{ fontSize: fs(12) }}>#{cat.catalogNumber}</div>
                                </div>
                            )) : (
                                <div className="col-span-3 bg-slate-800/30 rounded p-1 text-center text-slate-600 border border-slate-700/50 border-dashed flex items-center justify-center" style={{ fontSize: fs(10) }}>-</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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

    useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const languageTimer = setInterval(() => {
            setIsTextVisible(false);
            if (languageSwitchTimeoutRef.current) clearTimeout(languageSwitchTimeoutRef.current);
            languageSwitchTimeoutRef.current = setTimeout(() => {
                setBoardLng(prev => (prev === 'cs' ? 'en' : 'cs'));
                setIsTextVisible(true);
            }, 220);
        }, 5000);
        return () => {
            clearInterval(languageTimer);
            if (languageSwitchTimeoutRef.current) clearTimeout(languageSwitchTimeoutRef.current);
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
        return () => { if (stompClient.current) stompClient.current.deactivate(); };
    }, [currentShowId, fetchBoardState, isStarted]);

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-10 rounded-2xl text-center border border-slate-700 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-white mb-6 tracking-[-2px]">
                        <span className={boardTextClass}>{translateBoard('board.title')}</span>
                    </h1>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg cursor-pointer"
                    >
                        <span className={boardTextClass}>{translateBoard('board.start')}</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col font-sans overflow-hidden p-2 sm:p-3 gap-2 sm:gap-3">
            <header className="flex justify-between items-center border-b border-slate-800 pb-2 shrink-0">
                <div>
                    <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase leading-none">
                        <span className={boardTextClass}>{translateBoard('board.activeJudging')}</span>
                    </h1>
                    <div className="text-slate-500 text-[10px] sm:text-xs font-bold tracking-widest mt-0.5">
                        <span className={boardTextClass}>{translateBoard('board.broadcast')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 select-none">
                    <button
                        onClick={() => setIsMuted(m => !m)}
                        title={isMuted ? translateBoard('board.soundOn') : translateBoard('board.soundOff')}
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all text-sm ${isMuted ? 'bg-red-500/20 border border-red-500/40' : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'}`}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                    <div className="text-slate-400 font-mono text-sm sm:text-lg font-bold tabular-nums">
                        {currentTime.toLocaleTimeString()}
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                        <span className="text-slate-300 font-bold text-xs">Pawdium</span>
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full">Beta</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 min-h-0">
                {[1, 2, 3, 4].map(tableNum => (
                    <TableCard
                        key={tableNum}
                        tableNum={tableNum}
                        table={tables.find(t => t.tableNo === `T${tableNum}`)}
                        boardTextClass={boardTextClass}
                        translateBoard={translateBoard}
                    />
                ))}
            </div>
        </div>
    );
};