import React from 'react';
import { Trophy, Sparkles, ArrowRight, HelpCircle, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuiz: () => void;
  onNextMission: () => void;
  onReplay: () => void;
  missionNumber: number;
  totalMissions: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  onOpenQuiz,
  onNextMission,
  onReplay,
  missionNumber,
  totalMissions,
}) => {
  if (!isOpen) return null;

  const hasNext = missionNumber < totalMissions;

  return (
    <div
      id="victory-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="victory-modal-card"
        className="w-full max-w-md bg-gradient-to-b from-[#1c1a52] via-[#141442] to-[#0c0d2b] border-2 border-yellow-400/60 rounded-3xl p-6 sm:p-8 text-center text-white relative shadow-2xl shadow-yellow-500/20 overflow-hidden"
      >
        {/* Decorative rays */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Sunflower & Trophy icon */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="relative w-20 h-20 rounded-full bg-[#121438] flex items-center justify-center text-4xl shadow-inner">
            🌻
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-950 shadow-md">
            <Trophy className="w-4 h-4" />
          </div>
        </div>

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 font-extrabold text-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          MISSION COMPLETE!
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-['Fredoka',_'Noto_Sans_KR']">
          해바라기 개화 성공! 🌻
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          고기압(H)과 저기압(L)을 멋지게 배치하여 바람길을 완성했어요! 꽃가루가 바람을 타고 목표 해바라기에 닿아 활짝 피어났습니다.
        </p>

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Quiz Button */}
          <button
            id="victory-quiz-button"
            onClick={() => {
              soundFx.playClick();
              onClose();
              onOpenQuiz();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-purple-900/40 border border-purple-400/40 flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-yellow-300" />
            <span>기상 퀴즈 풀고 미션 완수하기!</span>
            <ArrowRight className="w-4 h-4 text-white ml-1" />
          </button>

          {/* Next Mission or Replay */}
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                soundFx.playClick();
                onReplay();
                onClose();
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 플레이</span>
            </button>

            {hasNext && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onNextMission();
                  onClose();
                }}
                className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <span>다음 코스 도전</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
