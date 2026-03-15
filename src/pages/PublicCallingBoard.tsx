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
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
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
            debug: () => {},
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/show/${currentShowId}/board`, () => {
                    fetchBoardState();
                    playGong();
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
        return <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-1.5 rounded-full text-lg sm:text-xl font-black tracking-widest uppercase border-2 border-white/20 shadow-2xl z-10">{type}</span>;
    };

    if (!isStarted) {
        return (
            <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-10 rounded-2xl text-center border border-slate-700 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-white mb-4 tracking-[-2px]">
                        {t('board.title')}
                    </h1>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white hover:text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-500/30 cursor-pointer"
                    >
                        START BOARD
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-slate-950 p-2 sm:p-4 flex flex-col font-sans overflow-hidden">
            <header className="flex justify-between items-end mb-3 border-b border-slate-800 pb-2 shrink-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none">{t('board.activeJudging')}</h1>
                    <div className="text-slate-500 text-xs font-bold tracking-widest mt-1">{t('board.broadcast')}</div>
                </div>

                <div className="flex flex-col items-end gap-0.5 select-none">
                    <div className="text-slate-400 font-mono text-xl font-bold">{currentTime.toLocaleTimeString()}</div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-bold text-sm tracking-tight">Pawdium</span>
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full">Beta</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-3 sm:gap-4 min-h-0">
                {[1, 2, 3, 4].map(tableNum => {
                    const table = tables.find(t => t.tableNo === `T${tableNum}`);
                    if (!table) {
                        return (
                            <div key={`empty-${tableNum}`} className="bg-slate-900/40 rounded-2xl border border-slate-800/40 flex flex-col overflow-hidden shadow-lg relative min-h-0">
                                <div className="bg-slate-800/20 px-4 py-2 text-center border-b border-slate-800/40 flex justify-between items-center shrink-0">
                                    <span className="bg-slate-800/50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-slate-700/50 uppercase">STŮL {tableNum}</span>
                                    <h2 className="text-lg font-black text-slate-700 tracking-tight truncate">{t('board.waitingSteward')}</h2>
                                    <span className="w-[70px]"></span>
                                </div>
                                <div className="p-3 flex-1 flex flex-col gap-3 min-h-0">
                                    <div className="flex-1 bg-slate-800/10 rounded-xl border border-slate-800/50 border-dashed flex items-center justify-center text-slate-700 font-bold tracking-widest min-h-0">{t('board.unoccupied')}</div>
                                    <div className="grid grid-cols-2 gap-3 shrink-0 opacity-20">
                                        <div className="h-[60px] bg-slate-800 rounded border border-slate-700 border-dashed"></div>
                                        <div className="h-[60px] bg-slate-800 rounded border border-slate-700 border-dashed"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    const displayCats = table.currentCats?.length ? table.currentCats : (table.currentCat ? [table.currentCat] : []);

                    return (
                        <div key={table.judgeId} className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative min-h-0">
                            <div className="bg-slate-800 px-4 py-2 text-center border-b border-slate-700 flex justify-between items-center shrink-0">
                                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-blue-500/30 uppercase">STŮL {tableNum}</span>
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">{table.judgeName}</h2>
                                <span className="w-[70px]"></span>
                            </div>

                            <div className="p-3 flex-1 flex flex-col gap-3 min-h-0">
                                <div className="flex-1 flex flex-col min-h-0 relative">
                                    {displayCats.length > 0 ? (
                                        <div className={`relative rounded-xl pt-8 pb-4 px-4 flex flex-col items-center justify-center transition-all duration-300 w-full h-full min-h-0 ${getColorClass(displayCats[0].type, displayCats[0].urgency)}`}>
                                            {getTypeLabel(displayCats[0].type)}

                                            <span className="text-2xl sm:text-4xl font-bold opacity-90 drop-shadow-md shrink-0 mb-2">
                                                {displayCats[0].ems}
                                            </span>

                                            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 w-full overflow-hidden content-center flex-1">
                                                {displayCats.map(cat => (
                                                    <span key={cat.catalogNumber} className={`font-black tracking-tighter leading-none drop-shadow-lg ${displayCats.length > 2 ? 'text-5xl md:text-6xl lg:text-[75px]' : 'text-7xl md:text-8xl lg:text-[110px]'}`}>
                                                        #{cat.catalogNumber}
                                                    </span>
                                                ))}
                                            </div>

                                            {displayCats[0].urgency === 'FINAL_CALL' && <span className="absolute bottom-3 bg-white text-red-600 px-6 py-1.5 rounded-full text-sm sm:text-base font-black uppercase tracking-widest animate-bounce shadow-xl">{t('board.finalCall')}</span>}
                                        </div>
                                    ) : table.isPaused ? (
                                        <div className="w-full h-full bg-yellow-500/10 rounded-xl border border-yellow-500/30 border-dashed flex items-center justify-center text-yellow-500 text-2xl sm:text-3xl font-black tracking-widest animate-pulse text-center p-4 min-h-0">
                                            PAUZA POSUZOVÁNÍ
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-slate-800/50 rounded-xl border border-slate-700/50 border-dashed flex items-center justify-center text-slate-600 font-bold min-h-0">
                                            TABLE EMPTY
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 shrink-0">
                                    <div className="flex flex-col min-h-0">
                                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 text-center text-yellow-500">{t('board.preparing')}</div>
                                        <div className="grid grid-cols-3 gap-1.5 flex-1">
                                            {table.preparingCats.length > 0 ? table.preparingCats.slice(0, 6).map(cat => (
                                                <div key={cat.catalogNumber} className="bg-slate-800 border-l-2 border-yellow-500 rounded p-1 sm:p-1.5 text-center flex flex-col justify-center shadow-sm h-full">
                                                    <div className="text-base sm:text-lg font-black text-white leading-none">#{cat.catalogNumber}</div>
                                                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate leading-none">{cat.ems}</div>
                                                </div>
                                            )) : (
                                                <div className="col-span-3 bg-slate-800/30 rounded p-2 text-center text-slate-600 text-xs border border-slate-700/50 border-dashed flex items-center justify-center h-full">-</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col min-h-0">
                                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 text-center">{t('board.nextInLine')}</div>
                                        <div className="grid grid-cols-3 gap-1.5 flex-1">
                                            {table.waitingCats.length > 0 ? table.waitingCats.slice(0, 6).map(cat => (
                                                <div key={cat.catalogNumber} className="bg-slate-800 border-l-2 border-slate-600 rounded p-1 sm:p-1.5 flex items-center justify-center h-full">
                                                    <div className="text-base sm:text-lg font-bold text-slate-300 leading-none">#{cat.catalogNumber}</div>
                                                </div>
                                            )) : (
                                                <div className="col-span-3 bg-slate-800/30 rounded p-2 text-center text-slate-600 text-xs border border-slate-700/50 border-dashed flex items-center justify-center h-full">-</div>
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