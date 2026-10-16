import React, { useState, useEffect } from 'react';
import { sound } from '../audio/soundEngine';
import { Clock, MapPin, Sparkles, Code2, Users, Flame, Heart, CheckCircle2 } from 'lucide-react';

export const StallInfoSection: React.FC = () => {
  const [fryerSeconds, setFryerSeconds] = useState(105);
  const [likeCount, setLikeCount] = useState(256);
  const [hasLiked, setHasLiked] = useState(false);

  // Fryer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setFryerSeconds((prev) => (prev <= 1 ? 120 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      sound.playCheerSound();
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      sound.playPopSound(500);
      setLikeCount((prev) => prev + 1);
    }
  };

  const minutes = Math.floor(fryerSeconds / 60);
  const seconds = fryerSeconds % 60;

  return (
    <section id="stall-info" className="w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl my-8 relative overflow-hidden">
      {/* Background Tech Network Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white font-dela text-xs sm:text-sm rounded-full mb-2 shadow-lg">
          <Code2 className="w-4 h-4 text-amber-300" />
          出店情報 ＆ ブース案内
        </div>
        <h2 className="text-3xl sm:text-4xl font-dela text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-rose-400">
          情報システム学科 AIプログラミング専攻 2年
        </h2>
        <p className="text-amber-200 font-bold text-sm sm:text-base mt-2">
          『揚げたて！のび〜る！AIチーズボール研究所』
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Card 1: Stall Location & Hours */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-amber-400/30 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-dela text-base mb-3">
              <MapPin className="w-5 h-5" />
              出店場所 ＆ アクセス
            </div>
            <div className="space-y-2 text-xs sm:text-sm font-bold text-slate-200">
              <p className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                <span className="text-slate-400">場所:</span>
                <span className="text-amber-300 font-dela text-right">中庭屋台ストリート ブース No.7</span>
              </p>
              <p className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                <span className="text-slate-400">営業時間:</span>
                <span>10:00 〜 16:30（完売次第終了）</span>
              </p>
              <p className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                <span className="text-slate-400">お支払い:</span>
                <span className="text-emerald-400 font-dela">現金（おつり完備）</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">目印:</span>
                <span>黄色と赤の「超のび〜る」大のぼり旗！</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: AI Fryer Real-time Timer */}
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-5 rounded-2xl border-2 border-amber-400 shadow-xl flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-dela text-amber-300 bg-black/40 px-3 py-1 rounded-full mb-2">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            AI制御フライヤー状況
          </div>
          <div className="text-xs text-slate-300 font-bold mb-1">
            次の揚げたてロット仕上がりまで
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-amber-300 tracking-wider my-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-amber-400/50 shadow-inner">
            0{minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <span className="text-[11px] text-amber-200 font-bold">
            油温175℃徹底キープで常にサクサク熱々を提供！
          </span>
        </div>

        {/* Card 3: Message from Students & Cheering Button */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-amber-400/30 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 font-dela text-base mb-2">
              <Users className="w-5 h-5 text-indigo-400" />
              専攻学生一同より
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-bold">
              「普段はPythonやニューラルネットワークのコードを書いている情報システム学科AIプログラミング専攻2年です！
              学園祭を最高に盛り上げるため、特製テーマソング制作から揚げたての温度制御まで本気で挑みました！ぜひ食べに来てね！」
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
            <button
              onClick={handleLike}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-dela text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition"
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              屋台を応援する！
            </button>
            <span className="font-mono text-sm font-bold text-amber-300">
              {likeCount} Cheer!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
