import React from 'react';
import { sound } from '../audio/soundEngine';
import { Trophy, Music, Flame, Sparkles, Star, ChevronDown, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onOpenRoulette: () => void;
  onPlaySong: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenRoulette, onPlaySong }) => {
  const lanterns = [
    { text: '祭', sub: '文化祭', color: 'from-red-600 to-rose-700' },
    { text: '揚', sub: '熱々', color: 'from-amber-500 to-orange-600' },
    { text: '技', sub: 'AI専攻', color: 'from-indigo-600 to-blue-700' },
    { text: '伸', sub: 'のび〜る', color: 'from-emerald-500 to-teal-600' },
    { text: '旨', sub: '黄金比', color: 'from-red-600 to-rose-700' }
  ];

  const scrollTo = (id: string) => {
    sound.playPopSound(500);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-12 px-4 overflow-hidden">
      {/* Decorative Festival Lanterns Hanging Line */}
      <div className="flex justify-center items-start gap-3 sm:gap-6 md:gap-10 mb-4">
        {lanterns.map((l, i) => (
          <div key={i} className="flex flex-col items-center group">
            {/* Hanging String */}
            <div className="w-0.5 h-4 sm:h-7 bg-amber-950"></div>
            {/* Lantern Body */}
            <div
              className={`w-12 h-16 sm:w-16 sm:h-22 rounded-full bg-gradient-to-b ${l.color} border-3 border-amber-950 shadow-xl flex flex-col items-center justify-center text-white relative transform transition hover:scale-110 cursor-pointer`}
              onClick={() => sound.playPopSound(400 + i * 100)}
            >
              {/* Lantern top/bottom caps */}
              <div className="absolute -top-1.5 w-6 sm:w-8 h-2 bg-amber-950 rounded-sm"></div>
              <div className="absolute -bottom-1.5 w-6 sm:w-8 h-2 bg-amber-950 rounded-sm"></div>
              <span className="font-dela text-base sm:text-2xl drop-shadow-md">{l.text}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-yellow-200 mt-0.5">{l.sub}</span>
            </div>
            {/* Tassel */}
            <div className="w-1 h-3 sm:h-4 bg-red-600 rounded-b mt-1"></div>
          </div>
        ))}
      </div>

      {/* Main Title Badge */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-slate-950 text-amber-300 font-dela text-xs sm:text-base rounded-full shadow-2xl border-2 border-amber-300 mb-4 transform -rotate-1 hover:rotate-0 transition">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          情報システム学科 AIプログラミング専攻 2年 出店
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-dela tracking-wider text-slate-950 mb-3 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
          揚げたて熱々！
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
            極上のび〜るチーズボール
          </span>
        </h1>

        <p className="font-dela text-sm sm:text-xl text-amber-950 max-w-2xl mx-auto mb-6 leading-relaxed">
          サクサク食感止まらない！熱々のままで召し上がれ！
          <br className="hidden sm:inline" />
          AIプログラミング専攻が黄金比で揚げる、学園祭No.1名物屋台！
        </p>

        {/* Pricing Cards Spotlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto my-6 text-left">
          {/* Card 1: 3 Balls for 300 Yen */}
          <div className="bg-white/95 backdrop-blur border-4 border-amber-400 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 relative">
            <span className="absolute -top-3 right-4 bg-emerald-500 text-white font-dela text-xs px-3 py-1 rounded-full shadow">
              お手軽定番！
            </span>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🧀</span>
              <div>
                <h3 className="font-dela text-lg text-slate-900">
                  チーズボール 3個入り
                </h3>
                <p className="text-xs text-slate-600 font-bold">
                  外サクッ＆中とろ〜り食べ歩き！
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-500">お祭り特別価格</span>
              <div className="text-3xl font-dela text-rose-600">
                300<span className="text-sm text-slate-800 ml-1">円</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1個あたりたったの100円！
            </div>
          </div>

          {/* Card 2: 5 Balls + Roulette for 500 Yen */}
          <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white border-4 border-yellow-300 rounded-3xl p-5 shadow-2xl hover:shadow-yellow-400/50 transition transform hover:-translate-y-1 relative overflow-hidden animate-pulse-glow">
            <span className="absolute -top-3 right-4 bg-yellow-400 text-slate-950 font-dela text-xs px-3 py-1 rounded-full shadow animate-bounce">
              👑 目玉メニュー！
            </span>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎰</span>
              <div>
                <h3 className="font-dela text-lg text-yellow-300">
                  5個 ＋ おまけルーレット
                </h3>
                <p className="text-xs text-rose-100 font-bold">
                  大満足ボリューム＆豪華景品！
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-400/60 flex items-baseline justify-between">
              <span className="text-xs font-bold text-yellow-200">ハズレなし特典付き</span>
              <div className="text-3xl font-dela text-yellow-300">
                500<span className="text-sm text-white ml-1">円</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-200 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              最大＋2個増量や特製ソースが当たる！
            </div>
          </div>
        </div>

        {/* Big Action CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={() => {
              sound.playPopSound(700);
              onOpenRoulette();
            }}
            className="py-4 px-6 sm:px-8 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-dela text-lg sm:text-xl rounded-2xl shadow-2xl flex items-center gap-2 transform active:scale-95 transition border-b-4 border-red-800"
          >
            <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />
            おまけルーレットを回す！
          </button>

          <button
            onClick={() => {
              scrollTo('music-station');
              onPlaySong();
            }}
            className="py-4 px-6 sm:px-8 bg-indigo-950 hover:bg-indigo-900 text-amber-300 font-dela text-lg sm:text-xl rounded-2xl shadow-xl flex items-center gap-2 transform active:scale-95 transition border-2 border-amber-400"
          >
            <Music className="w-6 h-6 text-yellow-400" />
            公式ソングを聴く！
          </button>

          <button
            onClick={() => scrollTo('stretch-game')}
            className="py-4 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-dela text-base sm:text-lg rounded-2xl shadow-lg flex items-center gap-2 transform active:scale-95 transition border-2 border-amber-700"
          >
            <Flame className="w-5 h-5 text-rose-600" />
            のび〜る体験ゲーム
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => scrollTo('music-station')}
            className="animate-bounce p-2 bg-white/70 hover:bg-white rounded-full text-slate-700 shadow-md transition"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};
