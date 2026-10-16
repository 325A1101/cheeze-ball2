import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ROULETTE_PRIZES } from '../data/festivalData';
import { RoulettePrize } from '../types';
import { sound } from '../audio/soundEngine';
import { X, Sparkles, Trophy, RotateCcw, CheckCircle2 } from 'lucide-react';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrizeWon?: (prize: RoulettePrize) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({ isOpen, onClose, onPrizeWon }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wonPrize, setWonPrize] = useState<RoulettePrize | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const tickIntervalRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const spinWheel = () => {
    if (isSpinning) return;

    sound.playPopSound(700);
    setIsSpinning(true);
    setWonPrize(null);

    // Pick a prize according to weighted or random probability
    const rand = Math.random();
    let accumulated = 0;
    let selectedPrize = ROULETTE_PRIZES[0];
    for (const p of ROULETTE_PRIZES) {
      accumulated += p.probability;
      if (rand <= accumulated) {
        selectedPrize = p;
        break;
      }
    }

    const prizeIndex = ROULETTE_PRIZES.findIndex((p) => p.id === selectedPrize.id);
    const segmentAngle = 360 / ROULETTE_PRIZES.length; // 60 degrees
    
    // Top pointer is at 270 deg (top center), segment i is centered at (i * 60 + 30)
    // To land pointer on segment i, wheel must rotate such that segment angle aligns with top.
    const targetOffset = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const extraFullSpins = (5 + Math.floor(Math.random() * 3)) * 360; // 5-7 spins
    const currentBase = rotationAngle - (rotationAngle % 360);
    const newTotalAngle = currentBase + extraFullSpins + targetOffset + (Math.random() * 20 - 10);

    setRotationAngle(newTotalAngle);

    // Audio tick loop during spin
    let tickCount = 0;
    const totalTicks = 32;
    const playNextTick = () => {
      sound.playTickSound();
      tickCount++;
      if (tickCount < totalTicks) {
        const delay = 40 + (tickCount * tickCount * 4.2); // exponential slowdown
        tickIntervalRef.current = window.setTimeout(playNextTick, delay);
      }
    };
    playNextTick();

    // Finish spin
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      setSpinCount((prev) => prev + 1);

      if (tickIntervalRef.current) {
        clearTimeout(tickIntervalRef.current);
      }

      // Fanfare & Confetti
      sound.playJackpotSound();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff']
      });

      if (onPrizeWon) {
        onPrizeWon(selectedPrize);
      }
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-300 via-amber-400 to-orange-400 border-4 border-amber-200 rounded-3xl shadow-2xl p-6 text-slate-900 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPopSound(400);
            onClose();
          }}
          disabled={isSpinning}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold shadow-lg transition disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-600 text-white font-dela text-sm rounded-full shadow-md mb-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            5個パック（500円）購入者限定特典！
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-dela text-slate-950 tracking-wider">
            ★ おまけつき特製ルーレット ★
          </h2>
          <p className="text-xs sm:text-sm font-bold text-amber-950 mt-1">
            ハズレ一切なし！何かが必ずその場で当たる大チャンス！
          </p>
        </div>

        {/* Roulette Wheel Container */}
        <div className="relative flex flex-col items-center justify-center my-4">
          {/* Top Indicator Arrow */}
          <div className="absolute -top-3 z-20 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[28px] border-t-rose-600 drop-shadow-md"></div>
          </div>

          {/* Wheel Frame */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 border-amber-900 bg-amber-900 shadow-2xl p-2 flex items-center justify-center">
            {/* The Rotating Wheel */}
            <div
              className="relative w-full h-full rounded-full overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transitionDuration: isSpinning ? '4.5s' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.2, 1)'
              }}
            >
              {/* Conic Gradient wheel or SVG segments */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {ROULETTE_PRIZES.map((prize, idx) => {
                  const segAngle = 360 / ROULETTE_PRIZES.length;
                  const startAngle = idx * segAngle;
                  const endAngle = (idx + 1) * segAngle;
                  
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  // Text position
                  const midAngle = (startAngle + endAngle) / 2;
                  const rad = (Math.PI * midAngle) / 180;
                  const tx = 50 + 32 * Math.cos(rad);
                  const ty = 50 + 32 * Math.sin(rad);

                  return (
                    <g key={prize.id}>
                      <path d={pathData} fill={prize.color} stroke="#fff" strokeWidth="0.8" />
                      <g transform={`translate(${tx}, ${ty}) rotate(${midAngle + 90})`}>
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          fontSize="5.2"
                          fontWeight="bold"
                          className="font-pop"
                          style={{ textShadow: '1px 1px 2px #000' }}
                        >
                          {prize.icon} {prize.name.length > 7 ? prize.name.slice(0, 7) + '…' : prize.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 border-4 border-amber-950 flex items-center justify-center shadow-lg">
                <span className="text-xl">🧀</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spin Action Button */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full sm:w-4/5 py-4 px-6 bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-dela text-xl sm:text-2xl rounded-2xl shadow-xl transform active:scale-95 transition-all border-b-4 border-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSpinning ? (
              <>
                <RotateCcw className="w-6 h-6 animate-spin" />
                抽選中... 祈れッ！！
              </>
            ) : (
              <>
                <Trophy className="w-7 h-7 text-yellow-300 animate-pulse" />
                ルーレットを回す！ (SPIN!)
              </>
            )}
          </button>
          <span className="text-xs font-bold text-amber-950">
            ※屋台で5個パックをご注文後、画面を見せてスタッフと一緒に回そう！
          </span>
        </div>

        {/* Winning Prize Banner */}
        {wonPrize && (
          <div className="mt-4 p-4 bg-white/95 border-3 border-rose-500 rounded-2xl shadow-xl animate-in zoom-in-95 duration-300 text-center">
            <div className="inline-block px-3 py-1 bg-rose-600 text-white text-xs font-dela rounded-full mb-1">
              🎉 ご当選おめでとうございます！ 🎉
            </div>
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="text-4xl">{wonPrize.icon}</span>
              <h3 className="text-xl sm:text-2xl font-dela text-rose-600">
                {wonPrize.name}
              </h3>
            </div>
            <p className="text-sm font-bold text-slate-800 my-1">
              {wonPrize.winMessage}
            </p>
            <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono font-bold bg-amber-100 px-2 py-0.5 rounded text-amber-800">
                交換コード: #WIN-{wonPrize.id}-{Date.now().toString().slice(-4)}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 屋台スタッフにご提示ください
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
