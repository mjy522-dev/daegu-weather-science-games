import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCompletion?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onSuccessCompletion }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  if (!isOpen) return null;

  // Question directly from specification:
  // "In which direction does wind blow? High -> Low"
  const question = "바람은 어느 방향으로 불까요? (In which direction does wind blow?)";
  const options = [
    {
      id: 0,
      text: "고기압 (H) ➔ 저기압 (L)",
      subtext: "High Pressure ➔ Low Pressure",
      isCorrect: true,
      reason: "정답입니다! 공기가 빽빽하고 무거운 고기압에서 공기가 가벼운 저기압으로 공기가 밀려 이동하며 '바람'이 만들어집니다.",
    },
    {
      id: 1,
      text: "저기압 (L) ➔ 고기압 (H)",
      subtext: "Low Pressure ➔ High Pressure",
      isCorrect: false,
      reason: "틀렸어요! 저기압은 공기가 상승해 모여드는 곳이므로, 공기는 고기압에서 저기압으로 흘러갑니다.",
    },
    {
      id: 2,
      text: "언제나 북쪽에서 남쪽으로만",
      subtext: "Always North to South",
      isCorrect: false,
      reason: "바람은 방위가 아닌 두 지점 사이의 기압 차이(기압경도력)에 의해 흐릅니다.",
    },
    {
      id: 3,
      text: "온도가 높은 곳에서 차가운 곳으로만",
      subtext: "Hot to Cold always",
      isCorrect: false,
      reason: "기온 차이가 기압 차이를 만들지만, 직접적인 바람의 구동력은 고기압에서 저기압으로의 기압 차이입니다.",
    },
  ];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (options[index].isCorrect) {
      soundFx.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (onSuccessCompletion) {
        onSuccessCompletion();
      }
    } else {
      soundFx.playShockwave();
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const currentOption = selectedOption !== null ? options[selectedOption] : null;

  return (
    <div
      id="quiz-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="quiz-modal-card"
        className="w-full max-w-lg bg-gradient-to-b from-[#161c4d] to-[#0b0e2b] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-indigo-950/80 text-white relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <HelpCircle className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full border border-yellow-400/30">
              국립대구기상과학관 탐험 퀴즈
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              도전! 기상 물리 퀴즈
            </h2>
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-4 mb-5">
          <p className="text-base sm:text-lg font-bold text-yellow-200 leading-snug">
            Q. {question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-2.5 mb-5">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
              } else {
                btnStyle = 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center font-bold text-xs shrink-0 text-slate-300">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-white">{opt.text}</div>
                    <div className="text-[11px] text-slate-400">{opt.subtext}</div>
                  </div>
                </div>

                {isAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Feedback */}
        {isAnswered && currentOption && (
          <div
            className={`p-4 rounded-2xl border mb-5 animate-in fade-in slide-in-from-bottom-2 ${
              currentOption.isCorrect
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-sm mb-1">
              {currentOption.isCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>대단해요! 정답입니다! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>아쉬워요! 다시 확인해볼까요?</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-200">{currentOption.reason}</p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          {isAnswered ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                다시 풀기
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>시뮬레이터로 돌아가기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-400 italic">
              정답이라고 생각하는 보기를 클릭해주세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
