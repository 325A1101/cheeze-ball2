import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RefreshCw, Award } from 'lucide-react';

export const CheeseStretchGame: React.FC = () => {
  const [stretchCm, setStretchCm] = useState(0);
  const [maxRecord, setMaxRecord] = useState(0);
  const [isStretching, setIsStretching] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 1
  const [rankTitle, setRankTitle] = useState('未測定');
  const [showCertificate, setShowCertificate] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute rank title based on stretch
  const getRank = (cm: number) => {
    if (cm < 30) return { title: 'とろ〜り初級者', desc: '美味しく伸びてます！', color: 'text-amber-600' };
    if (cm < 80) return { title: 'モッツァレラ達人', desc: 'サクサク＆とろとろの黄金比！', color: 'text-emerald-600' };
    if (cm < 160) return { title: '驚異ののびのびマスター', desc: '周りから歓声が上がっています！', color: 'text-blue-600' };
    if (cm < 250) return { title: '文化祭の伝説級！', desc: '校庭まで届きそうな限界突破！', color: 'text-purple-600' };
    return { title: '神バグ級！AIプログラミング覚醒', desc: '物理演算を超越した神の伸び！', color: 'text-rose-600' };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsStretching(true);
    sound.playPopSound(500);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isStretching || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const normalized = Math.max(0, Math.min(1, offsetY / rect.height));

    setPullProgress(normalized);
    const calculatedCm = Math.round(normalized * 300);
    setStretchCm(calculatedCm);

    if (calculatedCm > maxRecord) {
      setMaxRecord(calculatedCm);
    }

    if (Math.random() > 0.8) {
      sound.playStretchSound(normalized * 1.5);
    }
  };

  const handlePointerUp = () => {
    if (!isStretching) return;
    setIsStretching(false);

    if (stretchCm >= 150) {
      sound.playJackpotSound();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sound.playPopSound(700);
    }

    setRankTitle(getRank(stretchCm).title);
  };

  // Quick tap helper for mobile users
  const handleQuickPull = () => {
    const nextProg = Math.min(1, pullProgress + 0.15);
    setPullProgress(nextProg);
    const cm = Math.round(nextProg * 300);
    setStretchCm(cm);
    if (cm > maxRecord) setMaxRecord(cm);
    sound.playStretchSound(nextProg * 1.8);

    if (nextProg >= 0.95) {
      sound.playJackpotSound();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    setRankTitle(getRank(cm).title);
  };

  const resetGame = () => {
    sound.playPopSound(400);
    setPullProgress(0);
    setStretchCm(0);
    setShowCertificate(false);
  };

  const currentRankInfo = getRank(stretchCm);

  return (
    <div id="stretch-game" className="w-full bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-500 shadow-2xl my-8 text-slate-900 relative overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500 text-white font-dela text-xs sm:text-sm rounded-full shadow-md mb-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          屋台体感ミニゲーム
        </div>
        <h2 className="text-2xl sm:text-4xl font-dela text-amber-950">
          🧀 目指せ最長記録！のび〜るチーズ体験 🧀
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
          揚げたてチーズボールを引っ張って、何センチ伸びるか限界に挑戦しよう！
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Interactive Stretch Stage */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full max-w-md h-80 bg-gradient-to-b from-amber-200/60 to-yellow-300/40 border-4 border-dashed border-amber-400 rounded-3xl overflow-hidden shadow-inner flex flex-col items-center justify-between p-4 cursor-ns-resize select-none touch-none"
          >
            {/* Height Ruler on Left */}
            <div className="absolute left-3 top-4 bottom-4 flex flex-col justify-between text-[10px] font-mono font-bold text-amber-900/60 pointer-events-none">
              <span>0cm</span>
              <span>75cm</span>
              <span>150cm</span>
              <span>225cm</span>
              <span>300cm!</span>
            </div>

            {/* Top Half of Cheese Ball (Held in Hand) */}
            <div className="z-10 flex flex-col items-center">
              <div className="w-20 h-14 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 rounded-t-full border-2 border-amber-800 shadow-md flex items-center justify-center relative">
                <span className="text-xs font-bold text-amber-950 font-dela">サクッ！</span>
              </div>
            </div>

            {/* Stretched Molten Mozzarella SVG with dynamic physics */}
            <div className="absolute inset-x-0 top-14 bottom-14 flex items-center justify-center pointer-events-none">
              <svg className="w-48 h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cheeseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#fde047" />
                  </linearGradient>
                </defs>
                {/* Cheese strands */}
                {pullProgress > 0.05 && (
                  <>
                    <path
                      d={`M 35 0 Q ${50 + Math.sin(Date.now() / 300) * 8} ${100 * pullProgress} 45 ${200 * pullProgress}`}
                      stroke="url(#cheeseGrad)"
                      strokeWidth={Math.max(2, 16 * (1 - pullProgress * 0.65))}
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d={`M 65 0 Q ${50 - Math.sin(Date.now() / 300) * 8} ${100 * pullProgress} 55 ${200 * pullProgress}`}
                      stroke="url(#cheeseGrad)"
                      strokeWidth={Math.max(1.5, 12 * (1 - pullProgress * 0.65))}
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d={`M 50 0 Q ${50 + Math.cos(Date.now() / 250) * 12} ${120 * pullProgress} 50 ${200 * pullProgress}`}
                      stroke="#fff"
                      strokeWidth={Math.max(2, 10 * (1 - pullProgress * 0.7))}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Bottom Half of Cheese Ball (Dragged by pointer) */}
            <div
              className="z-10 flex flex-col items-center transition-transform"
              style={{
                transform: `translateY(${pullProgress * 130}px)`
              }}
            >
              <div className="w-20 h-14 bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-200 rounded-b-full border-2 border-amber-800 shadow-xl flex items-center justify-center relative">
                <span className="text-xs font-bold text-amber-950 font-dela">とろ〜り</span>
              </div>
              <div className="mt-1 px-3 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-bold shadow animate-bounce">
                ▼ 下にドラッグまたは連打！
              </div>
            </div>

            {/* Live Indicator overlay */}
            <div className="absolute top-2 right-3 bg-amber-950/80 text-yellow-300 px-3 py-1 rounded-full text-xs font-mono font-bold shadow">
              LIVE: {stretchCm} cm
            </div>
          </div>

          {/* Quick Tap Pull Button for mobile ease */}
          <div className="flex gap-3 mt-3 w-full max-w-md">
            <button
              onClick={handleQuickPull}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-dela text-sm sm:text-base rounded-2xl shadow-lg border-b-3 border-amber-700 active:scale-95 transition"
            >
              👆 タップでさらに伸ばす！ (PULL!)
            </button>
            <button
              onClick={resetGame}
              className="p-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl shadow flex items-center justify-center"
              title="リセット"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Info & Ranking Panel */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Record Display Card */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-400 shadow-xl text-center">
            <span className="text-xs font-dela text-slate-500">今回の伸び記録</span>
            <div className="text-5xl sm:text-6xl font-dela text-rose-600 tracking-tight my-1">
              {stretchCm}
              <span className="text-2xl text-slate-700 ml-1">cm</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mt-2">
              <span className="text-xs text-slate-500 font-bold">獲得ランク称号</span>
              <p className={`text-lg font-dela ${currentRankInfo.color}`}>
                {currentRankInfo.title}
              </p>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {currentRankInfo.desc}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600 border-t border-slate-100 pt-2">
              <span>本日ハイスコア:</span>
              <span className="text-amber-600 font-dela text-base">{maxRecord} cm</span>
            </div>
          </div>

          {/* Issue Certificate Button */}
          {stretchCm > 30 && (
            <button
              onClick={() => {
                sound.playJackpotSound();
                setShowCertificate(true);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-dela text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Award className="w-5 h-5 text-yellow-300" />
              認定証カードを表示する！
            </button>
          )}

          {/* Certificate Modal */}
          {showCertificate && (
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-amber-200 border-4 border-amber-600 rounded-2xl shadow-xl text-center animate-in zoom-in-95">
              <div className="text-xs font-dela text-amber-900">
                ★ 学園祭公認・チーズのびのび認定証 ★
              </div>
              <h4 className="text-lg font-dela text-rose-600 mt-1">
                記録：{stretchCm} センチ達成！
              </h4>
              <p className="text-xs font-bold text-slate-800 mt-1">
                貴殿は情報システム学科AIプログラミング専攻2年のチーズボールを極限まで伸ばした栄誉を称えます！
              </p>
              <div className="text-[10px] font-mono text-slate-600 mt-2">
                屋台ブースNo.7 | AIチーズボール研究所
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
