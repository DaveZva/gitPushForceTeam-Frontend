import React from 'react';
import { useTranslation } from 'react-i18next';


const MOCK_DATA = [
    { id: 1, judge: "Bc. Jan Novák (CZ)", catalogNo: "142", breed: "MCO", status: "JUDGING", ring: "1" },
    { id: 2, judge: "Helena Šmídová (SK)", catalogNo: "015", breed: "BSH", status: "PREPARING", ring: "2" },
    { id: 3, judge: "Fabio Brambilla (IT)", catalogNo: "210", breed: "PER", status: "JUDGING", ring: "3" },
    { id: 4, judge: "Světlana Stoljarova (BY)", catalogNo: "088", breed: "NFO", status: "WAITING", ring: "4" },
];

const PublicCallingBoard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-indigo-400">
                        {t('callingBoard.title')}
                    </h1>
                    <p className="text-slate-400 text-lg">{t('callingBoard.subtitle')}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-mono font-bold">14:45</div>
                    <div className="text-sm text-indigo-300 uppercase tracking-widest">{t('callingBoard.liveUpdates')}</div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {MOCK_DATA.map((item) => (
                    <div
                        key={item.id}
                        className={`relative overflow-hidden rounded-3xl border-4 bg-slate-800 transition-all duration-500 ${
                            item.status === 'JUDGING' ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' :
                                item.status === 'PREPARING' ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.1)]' : 'border-slate-700'
                        }`}
                    >
                        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-bold uppercase text-xs tracking-widest ${
                            item.status === 'JUDGING' ? 'bg-red-500 text-white animate-pulse' :
                                item.status === 'PREPARING' ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'
                        }`}>
                            {item.status === 'JUDGING' ? t('callingBoard.status.judging') :
                                item.status === 'PREPARING' ? t('callingBoard.status.preparing') : t('callingBoard.status.waiting')}
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-slate-400 uppercase text-sm font-bold tracking-widest">{t('callingBoard.ring')}</span>
                                    <div className="text-6xl font-black text-indigo-400 leading-none">{item.ring}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-400 uppercase text-sm font-bold tracking-widest">{t('callingBoard.judge')}</span>
                                    <div className="text-xl font-semibold">{item.judge}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center py-6 bg-slate-900/50 rounded-2xl my-4">
                                <div className="text-center">
                                    <span className="text-slate-500 uppercase text-xs font-bold tracking-widest block mb-1">{t('callingBoard.catNo')}</span>
                                    <div className="text-9xl font-black tracking-tighter text-white leading-none">
                                        {item.catalogNo}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <span className="text-slate-400 uppercase text-xs font-bold tracking-widest block">{t('callingBoard.breed')}</span>
                                    <span className="text-3xl font-bold text-white uppercase">{item.breed}</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                    <div className={`w-3 h-3 rounded-full ${item.status === 'JUDGING' ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-12 text-center text-slate-500 text-sm border-t border-slate-800 pt-6">
                {t('callingBoard.footer')}
                <br />
                <span className="text-indigo-500 font-semibold italic">{t('callingBoard.powering')}</span>
            </footer>
        </div>
    );
};

export default PublicCallingBoard;