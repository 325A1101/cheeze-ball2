import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../audio/soundEngine';
import { SONG_LYRICS } from '../data/festivalData';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Music,
  Radio,
  Sparkles,
  Flame,
  Award,
  PartyPopper
} from 'lucide-react';

export const AudioPlayerSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSourceType, setAudioSourceType] = useState<'builtin' | 'custom'>('builtin');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(90);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync lyrics based on current playback time
  useEffect(() => {
    let matched = 0;
    for (let i = 0; i < SONG_LYRICS.length; i++) {
      if (currentTime >= SONG_LYRICS[i].timeSec) {
        matched = i;
      }
    }
    setActiveLyricIndex(matched);
  }, [currentTime]);

  // Audio Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderVisualizer = () => {
      animationFrameRef.current = requestAnimationFrame(renderVisualizer);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      let dataArray = new Uint8Array(64);
      if (sound.analyser && isPlaying) {
        dataArray = new Uint8Array(sound.analyser.frequencyBinCount);
        sound.analyser.getByteFrequencyData(dataArray);
      }

      // Draw background glow
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw frequency spectrum bars
      const barCount = 32;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * 2] || (isPlaying ? Math.sin(Date.now() / 200 + i) * 30 + 40 : 10);
        const barHeight = (val / 255) * (height - 30);

        const x = i * (barWidth + 2);
        const y = height - barHeight - 10;

        const grad = ctx.createLinearGradient(x, y, x, height);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.5, '#fbbf24');
        grad.addColorStop(1, '#10b981');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }

      // Draw 3 bouncing cheese balls on top of the bars!
      const mascotPositions = [width * 0.2, width * 0.5, width * 0.8];
      mascotPositions.forEach((mx, index) => {
        const sampleIdx = Math.min(dataArray.length - 1, (index + 1) * 8);
        const freqVal = dataArray[sampleIdx] || (isPlaying ? 50 : 10);
        const bounceOffset = (freqVal / 255) * 45;
        const my = height * 0.45 - bounceOffset;

        // Draw Cheese Ball Mascot
        ctx.save();
        ctx.translate(mx, my);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(0, height * 0.45 - my + 15, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cheese Ball Body
        const ballGrad = ctx.createRadialGradient(-4, -4, 4, 0, 0, 20);
        ballGrad.addColorStop(0, '#fef08a');
        ballGrad.addColorStop(0.7, '#f59e0b');
        ballGrad.addColorStop(1, '#d97706');

        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cute face
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(-5, -2, 2.5, 0, Math.PI * 2);
        ctx.arc(5, -2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Cheeks
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(-8, 3, 2, 0, Math.PI * 2);
        ctx.arc(8, 3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 1, 5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // Steam / Sparkle
        if (isPlaying) {
          ctx.font = '12px serif';
          ctx.fillText('✨', 10, -12);
        }

        ctx.restore();
      });
    };

    renderVisualizer();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Handle play / pause toggle
  const togglePlay = () => {
    sound.playPopSound(500);

    if (isPlaying) {
      if (audioSourceType === 'builtin') {
        sound.stopBuiltinBgm();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioSourceType === 'builtin') {
        sound.startBuiltinBgm((step) => {
          // Increment simulated time in built-in mode
          setCurrentTime((prev) => (prev + 0.12) % 90);
        });
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.play().then(() => {
          sound.connectAudioElement(audioRef.current!);
          setIsPlaying(true);
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomAudioName(file.name);
      setAudioSourceType('custom');

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
      sound.playRegisterSound();
    }
  };

  // Soundboard Trigger
  const triggerSound = (name: string, action: () => void) => {
    action();
  };

  return (
    <div id="music-station" className="w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl relative overflow-hidden my-8">
      {/* Decorative Festival Lanterns */}
      <div className="absolute top-0 left-6 sm:left-12 flex gap-4 -translate-y-2 pointer-events-none">
        <span className="text-3xl animate-bounce">🏮</span>
        <span className="text-3xl animate-bounce delay-150">🏮</span>
      </div>
      <div className="absolute top-0 right-6 sm:right-12 flex gap-4 -translate-y-2 pointer-events-none">
        <span className="text-3xl animate-bounce delay-300">🏮</span>
        <span className="text-3xl animate-bounce delay-75">🏮</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-4 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400 text-slate-950 font-dela text-xs sm:text-sm rounded-full mb-3 shadow-lg">
          <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
          屋台公認テーマソング ＆ 盛り上げDJブース
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-dela text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-400 drop-shadow">
          サクサク伸びるチーズボール
        </h2>
        <p className="text-amber-200 font-bold text-sm sm:text-base mt-2">
          情報システム学科 AIプログラミング専攻 2年 公式テーマソング
        </p>
      </div>

      {/* Main Grid: Visualizer & Player on Left, Lyrics & Soundboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visualizer + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Visualizer Canvas */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-inner bg-black aspect-video flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full object-cover"
            />
            {/* Visualizer Floating Tag */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 border border-amber-400/40 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              {isPlaying ? 'NOW PLAYING (142 BPM)' : 'PAUSED'}
            </div>
            {/* Audio Source Badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-amber-400/40">
              {audioSourceType === 'builtin' ? '🎹 ブラウザ高音質シンセ音源' : `🎵 ${customAudioName || 'MP3音源'}`}
            </div>
          </div>

          {/* Audio Controls Bar */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col gap-4 shadow-xl">
            {/* Source Selector Tabs */}
            <div className="flex gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  sound.playPopSound(500);
                  if (isPlaying) {
                    if (audioSourceType === 'custom' && audioRef.current) audioRef.current.pause();
                    sound.startBuiltinBgm();
                  }
                  setAudioSourceType('builtin');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-dela transition flex items-center justify-center gap-1.5 ${
                  audioSourceType === 'builtin'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Music className="w-4 h-4" />
                内蔵フェスシンセ
              </button>
              <button
                onClick={() => {
                  sound.playPopSound(500);
                  if (isPlaying) {
                    sound.stopBuiltinBgm();
                    if (audioRef.current && customAudioUrl) audioRef.current.play();
                  }
                  setAudioSourceType('custom');
                  if (!customAudioUrl && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-dela transition flex items-center justify-center gap-1.5 ${
                  audioSourceType === 'custom'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                MP3ファイル再生
              </button>
            </div>

            {/* MP3 File Picker UI if custom */}
            {audioSourceType === 'custom' && (
              <div className="p-3 bg-slate-900/60 border border-dashed border-amber-400/60 rounded-xl flex items-center justify-between gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="truncate text-xs font-mono">
                  {customAudioName ? (
                    <span className="text-emerald-400 font-bold">📄 {customAudioName}</span>
                  ) : (
                    <span className="text-amber-200">添付のチーズボールMP3ファイルを選択してください</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-dela rounded-lg whitespace-nowrap shadow"
                >
                  ファイル選択
                </button>
              </div>
            )}

            {/* Hidden HTML5 Audio Element for custom MP3s */}
            <audio
              ref={audioRef}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  setCurrentTime(audioRef.current.currentTime);
                  setDuration(audioRef.current.duration || 90);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              loop
            />

            {/* Seek bar */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono text-amber-200">
                <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration || 90}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current && audioSourceType === 'custom') {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Main Play / Volume Row */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={togglePlay}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-dela text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6 fill-current" />
                    一時停止 (PAUSE)
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current animate-pulse" />
                    ソングを再生する！ (PLAY)
                  </>
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
                <button
                  onClick={() => {
                    const nextMute = !isMuted;
                    setIsMuted(nextMute);
                    sound.setVolume(nextMute ? 0 : volume);
                    if (audioRef.current) audioRef.current.volume = nextMute ? 0 : volume;
                  }}
                  className="text-amber-300 hover:text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    setIsMuted(false);
                    sound.setVolume(val);
                    if (audioRef.current) audioRef.current.volume = val;
                  }}
                  className="w-16 sm:w-24 accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized Karaoke Lyrics + Festival Soundboard */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Karaoke Lyrics Screen */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border-2 border-amber-400/50 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-dela text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                カラオケ歌詞シンクロ表示
              </span>
              <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">
                LYRICS
              </span>
            </div>

            {/* Scrollable lyrics list */}
            <div className="h-44 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-amber-500">
              {SONG_LYRICS.map((line, idx) => {
                const isActive = idx === activeLyricIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentTime(line.timeSec);
                      if (audioRef.current && audioSourceType === 'custom') {
                        audioRef.current.currentTime = line.timeSec;
                      }
                      sound.playPopSound(600);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-amber-500/20 border-2 border-amber-400 scale-[1.02] shadow-lg'
                        : 'bg-slate-900/40 hover:bg-slate-800/60 border border-transparent opacity-65'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm sm:text-base font-dela tracking-wide ${
                          isActive ? 'text-amber-300' : 'text-slate-200'
                        } ${line.accent ? 'text-rose-400 font-extrabold' : ''}`}
                      >
                        {line.text}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {Math.floor(line.timeSec / 60)}:{Math.floor(line.timeSec % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    {line.subText && (
                      <p className="text-xs text-amber-200/80 font-bold mt-0.5">
                        {line.subText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Festival Soundboard (屋台盛り上げSEマシーン) */}
          <div className="bg-gradient-to-br from-amber-500/20 to-rose-500/20 p-4 sm:p-5 rounded-2xl border-2 border-amber-400 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-dela text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                屋台ポン出しSEサンプラー
              </h3>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                タップで即発音！
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => triggerSound('fry', () => sound.playFrySound(1.5))}
                className="p-2.5 bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-amber-200"
              >
                <span className="text-lg">🍳</span>
                <span className="leading-tight">揚げる</span>
              </button>

              <button
                onClick={() => triggerSound('stretch', () => sound.playStretchSound(1.5))}
                className="p-2.5 bg-gradient-to-b from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-yellow-200"
              >
                <span className="text-lg">🧀</span>
                <span className="leading-tight">のび〜る</span>
              </button>

              <button
                onClick={() => triggerSound('cheer', () => sound.playCheerSound())}
                className="p-2.5 bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-rose-300"
              >
                <span className="text-lg">🙌</span>
                <span className="leading-tight">歓声</span>
              </button>

              <button
                onClick={() => triggerSound('jackpot', () => sound.playJackpotSound())}
                className="p-2.5 bg-gradient-to-b from-emerald-400 to-teal-600 hover:from-emerald-300 hover:to-teal-500 text-white font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-emerald-200"
              >
                <span className="text-lg">🎺</span>
                <span className="leading-tight">ファンファーレ</span>
              </button>

              <button
                onClick={() => triggerSound('bell', () => sound.playRegisterSound())}
                className="p-2.5 bg-gradient-to-b from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-sky-200"
              >
                <span className="text-lg">🛎️</span>
                <span className="leading-tight">レジピピッ</span>
              </button>

              <button
                onClick={() => triggerSound('tick', () => sound.playTickSound())}
                className="p-2.5 bg-gradient-to-b from-purple-400 to-indigo-600 hover:from-purple-300 hover:to-indigo-500 text-white font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-purple-200"
              >
                <span className="text-lg">🎯</span>
                <span className="leading-tight">カチッ</span>
              </button>

              <button
                onClick={() => triggerSound('pop', () => sound.playPopSound(800))}
                className="p-2.5 bg-gradient-to-b from-pink-400 to-rose-500 hover:from-pink-300 hover:to-rose-400 text-white font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-pink-200"
              >
                <span className="text-lg">🎉</span>
                <span className="leading-tight">Hey! Hey!</span>
              </button>

              <button
                onClick={() => {
                  sound.playPopSound(950);
                  sound.playCheerSound();
                }}
                className="p-2.5 bg-gradient-to-b from-amber-300 to-orange-600 hover:from-amber-200 hover:to-orange-500 text-slate-950 font-dela text-xs rounded-xl shadow-md transform active:scale-90 transition flex flex-col items-center gap-1 border border-amber-300"
              >
                <span className="text-lg">🔥</span>
                <span className="leading-tight">Go Go!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
