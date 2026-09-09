import React from 'react';
import { Wind, HelpCircle, Volume2, VolumeX, Sparkles, BookOpen, Compass } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TopBarProps {
  missionTitle: string;
  avgWindSpeed: number;
  pressureDiff: number;
  onOpenQuiz: () => void;
  onOpenGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  missionNumber: number;
  totalMissions: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  missionTitle,
  avgWindSpeed,
  pressureDiff,
  onOpenQuiz,
  onOpenGuide,
  soundEnabled,
  onToggleSound,
  missionNumber,
  totalMissions,
}) => {
  // Determine wind condition name for elementary students
  const getWindDescription = (speed: number) => {
    if (speed < 3) return { text: '실바람 (Light Air)', color: 'text-sky-300' };
    if (speed < 8) return { text: '남실바람 (Gentle Breeze)', color: 'text-emerald-300' };
    if (speed < 15) return { text: '산들바람 (Fresh Wind)', color: 'text-yellow-300' };
    return { text: '된바람 (Strong Wind)', color: 'text-amber-400' };
  };

  const windDesc = getWindDescription(avgWindSpeed);

  return (
    <header id="app-top-bar" className="w-full bg-[#0a0d28]/90 border-b border-indigo-500/20 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: App Branding & Mission Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/40">
              <Compass className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '14s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-1.5">
                  Wind Maker <span className="text-yellow-400 text-xs sm:text-sm font-bold">바람 생성기</span>
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  어린이 기상 물리
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                고기압(H) vs 저기압(L) 대기 대순환 시뮬레이터
              </p>
            </div>
          </div>

          {/* Mission Badge (Top Bar requirement) */}
          <div
            id="mission-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-emerald-500/20 border border-yellow-500/40 shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-xs font-bold text-yellow-300 whitespace-nowrap">
              미션 {missionNumber}/{totalMissions}: {missionTitle}
            </span>
          </div>
        </div>

        {/* Center/Right: Wind Flow Meter & Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Wind Flow Meter (Top Bar requirement) */}
          <div
            id="wind-flow-meter"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 shadow-md backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
              <Wind className="w-4 h-4 text-sky-400 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">풍속계</span>
                <span className={`text-xs font-bold ${windDesc.color}`}>
                  {windDesc.text}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black text-white font-mono">
                  {avgWindSpeed.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">m/s</span>
                </span>
                <span className="text-[10px] text-indigo-300 font-mono">
                  ΔP: {pressureDiff} hPa
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Quiz, Guide, Sound */}
          <div className="flex items-center gap-2">
            {/* Quiz Trigger (Top Bar requirement) */}
            <button
              id="quiz-trigger-button"
              onClick={() => {
                soundFx.playClick();
                onOpenQuiz();
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-950/40 border border-purple-400/40 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
              <span>기상 퀴즈!</span>
            </button>

            {/* Science Guide Trigger */}
            <button
              id="science-guide-button"
              onClick={() => {
                soundFx.playClick();
                onOpenGuide();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 shadow transition-colors cursor-pointer"
              title="바람 원리 공부하기"
              aria-label="바람 원리 설명 보기"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-button"
              onClick={() => {
                soundFx.playClick();
                onToggleSound();
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 border-slate-700/60'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              aria-label="효과음 토글"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
