import React from 'react';
import { sound } from '../audio/soundEngine';
import { Music, Trophy, Calculator, Sparkles, Flame, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenRoulette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRoulette }) => {
  const scrollTo = (id: string) => {
    sound.playPopSound(500);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-amber-400/95 backdrop-blur-md border-b-4 border-amber-600 shadow-xl">
      {/* Top micro marquee ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-600 text-white text-[11px] sm:text-xs font-dela py-1 px-4 overflow-hidden flex justify-around items-center">
        <span className="flex items-center gap-1.5 whitespace-nowrap animate-pulse">
          🏮 学園祭大盛況開催中！
        </span>
        <span className="hidden sm:inline font-mono">
          【情報システム学科 AIプログラミング専攻 2年】
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap text-yellow-300">
          ✨ 3個300円 / 5個500円(ルーレット付！)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand / Stall Title */}
        <div
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-600 border-2 border-white flex items-center justify-center text-2xl shadow group-hover:scale-110 transition">
            🧀
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-900 text-amber-300 text-[10px] font-dela px-2 py-0.5 rounded-full">
                AI専攻2年
              </span>
              <span className="text-xs font-bold text-slate-800 hidden md:inline">
                情報システム学科
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-dela text-slate-950 leading-tight">
              チーズボール屋台フェス
            </h1>
          </div>
        </div>

        {/* Action navigation links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => scrollTo('music-station')}
            className="px-2.5 sm:px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-amber-300 text-xs font-dela rounded-xl shadow flex items-center gap-1 transition"
          >
            <Music className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">公式ソング & DJ</span>
            <span className="sm:hidden">音楽</span>
          </button>

          <button
            onClick={() => {
              sound.playPopSound(700);
              onOpenRoulette();
            }}
            className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-dela rounded-xl shadow flex items-center gap-1 animate-bounce transition"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>おまけルーレット</span>
          </button>

          <button
            onClick={() => scrollTo('stretch-game')}
            className="px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-dela rounded-xl shadow hidden md:flex items-center gap-1 transition"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>のび〜る体験</span>
          </button>

          <button
            onClick={() => scrollTo('order-calculator')}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-dela rounded-xl shadow flex items-center gap-1 transition"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">お会計計算</span>
            <span className="sm:hidden">POS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
