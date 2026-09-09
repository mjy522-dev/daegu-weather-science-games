import React from 'react';
import { RotateCcw, Lightbulb, X } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface RetryToastProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  tip: string;
}

export const RetryToast: React.FC<RetryToastProps> = ({ isOpen, onClose, onRetry, tip }) => {
  if (!isOpen) return null;

  return (
    <div
      id="retry-state-toast"
      className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-gradient-to-r from-[#1f163b] to-[#161a46] border-2 border-amber-400/60 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/80 text-white flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
          <Lightbulb className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-yellow-300">
              꽃가루가 닿지 못했어요! 💨
            </h3>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="text-slate-400 hover:text-white p-1"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            {tip || '바람은 언제나 고기압(H)에서 저기압(L)으로 붑니다. 고기압 노드를 시작 지점 뒤에, 저기압 노드를 해바라기 쪽에 배치해 보세요!'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              id="retry-try-again-button"
              onClick={() => {
                soundFx.playClick();
                onRetry();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 시도하기</span>
            </button>
            <span className="text-[11px] text-indigo-300">
              노드를 드래그해서 위치를 옮겨보세요!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
