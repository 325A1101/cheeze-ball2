/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AudioPlayerSection } from './components/AudioPlayerSection';
import { RouletteModal } from './components/RouletteModal';
import { CheeseStretchGame } from './components/CheeseStretchGame';
import { OrderCalculator } from './components/OrderCalculator';
import { StallInfoSection } from './components/StallInfoSection';
import { sound } from './audio/soundEngine';
import { MENU_ITEMS, TOPPINGS, ROULETTE_PRIZES } from './data/festivalData';
import { Sparkles, Trophy, Flame, Music, ShoppingBag, Heart, Star, Check } from 'lucide-react';

export default function App() {
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  const openRoulette = () => {
    sound.playPopSound(700);
    setIsRouletteOpen(true);
  };

  const closeRoulette = () => {
    setIsRouletteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-400 via-amber-300 to-yellow-400 font-maru text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Sticky Festive Navigation */}
      <Navbar onOpenRoulette={openRoulette} />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <HeroBanner
          onOpenRoulette={openRoulette}
          onPlaySong={() => {
            sound.startBuiltinBgm();
          }}
        />

        {/* Feature Highlights Grid */}
        <section className="my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3 Balls Pack Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-400 transition">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white font-dela text-xs px-4 py-1 rounded-bl-2xl shadow">
                手軽にサクッと！
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition">
                    🧀
                  </div>
                  <div>
                    <h3 className="font-dela text-2xl text-slate-900">
                      3個入りパック
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      おひとり様の食べ歩きにちょうどいいサイズ！
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">
                  外はカリッ＆サクッ！中は厳選モッツァレラ100％がとろ〜り溢れ出す！揚げたてアツアツの至福をどうぞ！
                </p>

                <ul className="space-y-1.5 text-xs font-bold text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    注文が入ってから揚げるからいつでもアツアツ！
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    魔法のシュガーパウダー無料トッピングOK！
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t-2 border-amber-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400">税込価格</span>
                  <div className="text-4xl font-dela text-slate-900">
                    300<span className="text-lg ml-1">円</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playPopSound(500);
                    const el = document.getElementById('order-calculator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-dela text-sm rounded-xl shadow-md transition"
                >
                  注文計算へ進む
                </button>
              </div>
            </div>

            {/* 5 Balls Pack + Roulette Card */}
            <div className="bg-gradient-to-br from-rose-500 via-red-500 to-amber-500 text-white rounded-3xl p-6 sm:p-8 border-4 border-yellow-300 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-slate-950 font-dela text-xs px-4 py-1 rounded-bl-2xl shadow animate-pulse">
                ★ 豪華おまけルーレット付き！
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-300 border-2 border-white flex items-center justify-center text-4xl shadow-inner text-slate-950">
                    👑
                  </div>
                  <div>
                    <h3 className="font-dela text-2xl text-yellow-200">
                      5個パック ＋ ルーレット
                    </h3>
                    <p className="text-xs font-bold text-rose-100 mt-0.5">
                      大満足ボリューム ＆ ハズレなし大抽選会！
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold text-white/95 leading-relaxed mb-4">
                  お友達とのシェアにもバッチリ！さらにその場で豪華賞品が当たる特製おまけルーレットに挑戦できるプレミアムパック！
                </p>

                <div className="p-3 bg-black/25 backdrop-blur rounded-2xl border border-yellow-300/40 mb-6">
                  <span className="text-xs font-dela text-yellow-300 flex items-center gap-1.5 mb-1.5">
                    <Trophy className="w-4 h-4" /> ルーレットで当たる豪華おまけ一覧:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-bold text-rose-100">
                    <span>👑 チーズボール＋2個大増量！</span>
                    <span>🧀 チーズボール＋1個増量！</span>
                    <span>🍯 ハニーバターソース無料</span>
                    <span>🌶️ スパイシーチリ無料</span>
                    <span>💻 神バグ除けステッカー</span>
                    <span>💖 感謝の追いがけチーズ</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-white/20 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-yellow-200">税込価格</span>
                  <div className="text-4xl font-dela text-yellow-300">
                    500<span className="text-lg ml-1">円</span>
                  </div>
                </div>
                <button
                  onClick={openRoulette}
                  className="py-3 px-6 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-dela text-base rounded-xl shadow-xl flex items-center gap-2 transform active:scale-95 transition"
                >
                  <Trophy className="w-5 h-5 text-red-600 animate-bounce" />
                  ルーレット挑戦！
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Player & DJ Soundboard Section */}
        <AudioPlayerSection />

        {/* Interactive Cheese Stretch Game */}
        <CheeseStretchGame />

        {/* Booth POS & Order Calculator */}
        <OrderCalculator onOpenRoulette={openRoulette} />

        {/* Stall & Department Information Section */}
        <StallInfoSection />
      </main>

      {/* Interactive Roulette Modal */}
      <RouletteModal
        isOpen={isRouletteOpen}
        onClose={closeRoulette}
      />

      {/* Festive Footer */}
      <footer className="mt-16 bg-slate-950 text-white border-t-4 border-amber-400 py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-2xl">
            <span>🏮</span>
            <span className="font-dela text-amber-300">学園祭 チーズボール屋台フェス</span>
            <span>🏮</span>
          </div>
          <p className="text-xs font-bold text-slate-400">
            情報システム学科 AIプログラミング専攻 2年 出店ブース
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            揚げたてモッツァレラ100% | 3個300円 / 5個おまけルーレット付き500円
          </p>
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-600">
            © 2026 Information Systems & AI Programming Major - School Festival Booth
          </div>
        </div>
      </footer>
    </div>
  );
}
