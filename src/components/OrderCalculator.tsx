import React, { useState } from 'react';
import { MENU_ITEMS, TOPPINGS, DRINKS } from '../data/festivalData';
import { sound } from '../audio/soundEngine';
import { ShoppingCart, Plus, Minus, Calculator, Sparkles, CheckCircle, RefreshCw, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderCalculatorProps {
  onOpenRoulette: () => void;
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({ onOpenRoulette }) => {
  const [pack3Count, setPack3Count] = useState(0);
  const [pack5Count, setPack5Count] = useState(1); // default 1 for demo
  const [selectedToppings, setSelectedToppings] = useState<{ [id: string]: number }>({});
  const [selectedDrinks, setSelectedDrinks] = useState<{ [id: string]: number }>({});
  const [cashReceived, setCashReceived] = useState<number>(1000);
  const [issuedTicket, setIssuedTicket] = useState<{ ticketNumber: number; total: number; balls: number; rouletteCount: number } | null>(null);

  // Totals
  const totalBalls = pack3Count * 3 + pack5Count * 5;
  const rouletteChances = pack5Count;

  const packsTotal = pack3Count * 300 + pack5Count * 500;
  const toppingsTotal = Object.entries(selectedToppings).reduce((sum, [id, qty]) => {
    const item = TOPPINGS.find((t) => t.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const drinksTotal = Object.entries(selectedDrinks).reduce((sum, [id, qty]) => {
    const item = DRINKS.find((d) => d.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const grandTotal = packsTotal + toppingsTotal + drinksTotal;
  const changeDue = Math.max(0, cashReceived - grandTotal);

  const handleUpdatePack3 = (delta: number) => {
    sound.playPopSound(delta > 0 ? 600 : 400);
    setPack3Count((prev) => Math.max(0, prev + delta));
  };

  const handleUpdatePack5 = (delta: number) => {
    sound.playPopSound(delta > 0 ? 650 : 420);
    setPack5Count((prev) => Math.max(0, prev + delta));
  };

  const toggleTopping = (id: string) => {
    sound.playPopSound(550);
    setSelectedToppings((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) > 0 ? 0 : 1
    }));
  };

  const handleCompleteOrder = () => {
    if (grandTotal === 0) return;

    sound.playRegisterSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    const ticketNum = Math.floor(Math.random() * 800) + 101;
    setIssuedTicket({
      ticketNumber: ticketNum,
      total: grandTotal,
      balls: totalBalls,
      rouletteCount: rouletteChances
    });
  };

  const resetOrder = () => {
    sound.playPopSound(400);
    setPack3Count(0);
    setPack5Count(0);
    setSelectedToppings({});
    setSelectedDrinks({});
    setIssuedTicket(null);
  };

  return (
    <div id="order-calculator" className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl my-8 text-slate-900 relative">
      {/* Top Banner Ribbon */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-slate-950 font-dela text-xs sm:text-sm rounded-full shadow-md mb-2">
          <Calculator className="w-4 h-4" />
          屋台お会計シミュレーター ＆ POS
        </div>
        <h2 className="text-2xl sm:text-4xl font-dela text-slate-950">
          📋 ご注文・お会計カンタン計算 📋
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
          お客さまのご注文確認やおつり計算、整理券の発行がワンタップで完了！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Menu Item Selection */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Cheese Ball Packs */}
          <div className="space-y-4">
            <h3 className="font-dela text-lg text-amber-950 flex items-center gap-2">
              <span>🧀</span> メインメニュー選択
            </h3>

            {/* 3 Balls Pack */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-amber-400 transition">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner">
                  🧀
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-dela text-base sm:text-lg text-slate-900">
                      3個パック
                    </h4>
                    <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      定番
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">
                    おてがる食べ歩きサイズ
                  </p>
                  <p className="text-lg font-dela text-rose-600">
                    300円 <span className="text-xs text-slate-500 font-normal">（税込）</span>
                  </p>
                </div>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border-2 border-amber-300 shadow-sm">
                <button
                  onClick={() => handleUpdatePack3(-1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold active:scale-90 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-dela text-xl text-slate-900">
                  {pack3Count}
                </span>
                <button
                  onClick={() => handleUpdatePack3(1)}
                  className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center font-bold active:scale-90 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5 Balls Pack + Roulette */}
            <div className="p-4 bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-3 border-rose-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-dela px-3 py-0.5 rounded-bl-xl shadow">
                ★ ルーレット付き！
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-200 border-2 border-rose-400 flex items-center justify-center text-3xl shadow-inner">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-dela text-base sm:text-lg text-slate-900">
                      5個パック ＋ おまけルーレット
                    </h4>
                  </div>
                  <p className="text-xs text-rose-700 font-bold mt-0.5">
                    大満足ボリューム ＆ ハズレなしルーレット挑戦権！
                  </p>
                  <p className="text-lg font-dela text-rose-600">
                    500円 <span className="text-xs text-slate-500 font-normal">（税込）</span>
                  </p>
                </div>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border-2 border-rose-400 shadow-sm">
                <button
                  onClick={() => handleUpdatePack5(-1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold active:scale-90 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-dela text-xl text-slate-900">
                  {pack5Count}
                </span>
                <button
                  onClick={() => handleUpdatePack5(1)}
                  className="w-8 h-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center font-bold active:scale-90 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Optional Toppings & Flavors */}
          <div>
            <h4 className="font-dela text-sm text-slate-800 mb-2 flex items-center gap-1.5">
              <span>✨</span> 特製トッピング追加（各50円 / シュガー無料）
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TOPPINGS.map((top) => {
                const isSelected = (selectedToppings[top.id] || 0) > 0;
                return (
                  <button
                    key={top.id}
                    onClick={() => toggleTopping(top.id)}
                    className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{top.icon}</div>
                    <div className="text-xs font-dela text-slate-900 leading-tight">
                      {top.name}
                    </div>
                    <div className="text-xs font-bold text-rose-600 mt-1">
                      {top.price === 0 ? '無料！' : `+${top.price}円`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Drinks */}
          <div>
            <h4 className="font-dela text-sm text-slate-800 mb-2 flex items-center gap-1.5">
              <span>🥤</span> 冷たいドリンクセット
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {DRINKS.map((drk) => {
                const count = selectedDrinks[drk.id] || 0;
                return (
                  <div
                    key={drk.id}
                    className="p-3 bg-slate-50 border-2 border-slate-200 rounded-xl flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{drk.icon}</span>
                      <span className="text-xs font-dela text-slate-900 truncate">{drk.name}</span>
                    </div>
                    <div className="text-xs font-bold text-rose-600 my-1">
                      +{drk.price}円
                    </div>
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => {
                          sound.playPopSound(400);
                          setSelectedDrinks((prev) => ({
                            ...prev,
                            [drk.id]: Math.max(0, (prev[drk.id] || 0) - 1)
                          }));
                        }}
                        className="text-slate-600 font-bold hover:text-rose-600"
                      >
                        -
                      </button>
                      <span className="text-xs font-dela">{count}</span>
                      <button
                        onClick={() => {
                          sound.playPopSound(600);
                          setSelectedDrinks((prev) => ({
                            ...prev,
                            [drk.id]: (prev[drk.id] || 0) + 1
                          }));
                        }}
                        className="text-slate-600 font-bold hover:text-emerald-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Checkout & Change Calculation */}
        <div className="lg:col-span-5 bg-gradient-to-b from-amber-50 to-orange-100/60 p-6 rounded-3xl border-3 border-amber-400 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
            <h3 className="font-dela text-lg text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-rose-600" />
              お会計サマリー
            </h3>
            <button
              onClick={resetOrder}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> リセット
            </button>
          </div>

          {/* Counts overview */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-3 rounded-2xl border border-amber-300 shadow-sm">
              <span className="text-xs text-slate-500 font-bold">チーズボール総数</span>
              <div className="text-2xl font-dela text-amber-600">{totalBalls} 個</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-rose-300 shadow-sm relative">
              <span className="text-xs text-slate-500 font-bold">ルーレット挑戦権</span>
              <div className="text-2xl font-dela text-rose-600">{rouletteChances} 回分</div>
              {rouletteChances > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  権利あり！
                </span>
              )}
            </div>
          </div>

          {/* Roulette Trigger shortcut */}
          {rouletteChances > 0 && (
            <button
              onClick={onOpenRoulette}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-dela text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 animate-bounce transition"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              おまけルーレットを今すぐ回す！
            </button>
          )}

          {/* Total Price */}
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-400 shadow-inner flex items-baseline justify-between">
            <span className="text-sm font-dela text-slate-600">合計お支払い金額</span>
            <div className="text-3xl sm:text-4xl font-dela text-rose-600">
              ¥{grandTotal.toLocaleString()}
            </div>
          </div>

          {/* Cash Received & Change */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>お預かり金額（ワンタップ入力）:</span>
              <span className="font-mono text-slate-900 font-dela">¥{cashReceived}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[grandTotal, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    sound.playPopSound(500);
                    setCashReceived(amt);
                  }}
                  className={`py-1.5 px-2 text-xs font-dela rounded-xl border transition ${
                    cashReceived === amt
                      ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold shadow'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {amt === grandTotal ? 'ぴったり' : `¥${amt}`}
                </button>
              ))}
            </div>

            {/* Change Display */}
            <div className="flex items-center justify-between p-3 bg-amber-100 rounded-xl border border-amber-300">
              <span className="text-xs font-dela text-slate-700">おつり</span>
              <span className="text-2xl font-dela text-emerald-700">
                ¥{changeDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Issue Ticket / Complete Order Button */}
          <button
            onClick={handleCompleteOrder}
            disabled={grandTotal === 0}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-dela text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
          >
            <Printer className="w-5 h-5" />
            注文確定 ＆ 呼出整理券を発行
          </button>

          {/* Issued Ticket Modal Card */}
          {issuedTicket && (
            <div className="p-4 bg-white border-3 border-dashed border-slate-400 rounded-2xl shadow-xl animate-in zoom-in-95 text-center">
              <div className="inline-block px-3 py-0.5 bg-emerald-600 text-white text-xs font-dela rounded-full mb-1">
                整理券発行完了！
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">呼出番号</div>
              <div className="text-4xl font-dela text-rose-600 tracking-wider">
                #{issuedTicket.ticketNumber}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">
                チーズボール {issuedTicket.balls}個（お会計 ¥{issuedTicket.total}）
              </div>
              {issuedTicket.rouletteCount > 0 && (
                <div className="text-xs font-dela text-amber-600 mt-1 bg-amber-50 py-1 rounded">
                  ★ おまけルーレット {issuedTicket.rouletteCount}回 チャレンジ可能！
                </div>
              )}
              <div className="text-[10px] text-slate-500 mt-2 border-t border-slate-100 pt-1">
                揚げたてをご用意しております。少々お待ちください！
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
