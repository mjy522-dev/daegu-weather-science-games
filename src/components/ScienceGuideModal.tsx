import React from 'react';
import { X, ArrowRight, Sun, CloudRain, Wind, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ScienceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScienceGuideModal: React.FC<ScienceGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="science-guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="science-guide-card"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#141846] to-[#0a0d2a] border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-white relative shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Wind className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-400/10 px-2.5 py-0.5 rounded-full border border-sky-400/30">
              국립대구기상과학관 과학 교실
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              바람은 왜 불까요? (Wind Science)
            </h2>
          </div>
        </div>

        {/* Big visual comparison card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* High Pressure (H) Card */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-sm shadow">
                  H
                </span>
                <h3 className="font-extrabold text-base text-red-300">고기압 (High Pressure)</h3>
              </div>
              <Sun className="w-5 h-5 text-amber-400" />
            </div>

            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>공기가 무거워요:</strong> 차갑거나 밀도가 높아 아래로 가라앉아요 (하강 기류).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>바람이 밖으로:</strong> 주변보다 기압이 높아 공기가 밖으로 불어나가요.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>시계방향 회전:</strong> 지구 자전(전향력) 때문에 북반구에서는 시계방향으로 회전해요!</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>날씨:</strong> 구름이 소멸하여 대체로 <strong>맑고 화창한 날씨</strong>가 돼요.</span>
              </li>
            </ul>
          </div>

          {/* Low Pressure (L) Card */}
          <div className="bg-blue-950/40 border border-blue-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow">
                  L
                </span>
                <h3 className="font-extrabold text-base text-blue-300">저기압 (Low Pressure)</h3>
              </div>
              <CloudRain className="w-5 h-5 text-sky-400" />
            </div>

            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>공기가 가벼워요:</strong> 따뜻해진 공기가 위로 솟구쳐 올라가요 (상승 기류).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>바람이 안으로:</strong> 비어 있는 중심을 향해 사방에서 공기가 빨려 들어와요.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>반시계방향 회전:</strong> 북반구에서는 중심을 향해 반시계방향으로 소용돌이쳐요!</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>날씨:</strong> 공기가 올라가며 구름이 생겨 <strong>비나 눈, 흐린 날씨</strong>가 돼요.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How Wind Flows Infographic Box */}
        <div className="bg-gradient-to-r from-red-950/30 via-indigo-950/40 to-blue-950/30 border border-indigo-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-center gap-3 font-black text-sm sm:text-base text-yellow-300 mb-2">
            <span>고기압 (H)</span>
            <div className="flex items-center text-yellow-400">
              <div className="h-0.5 w-8 sm:w-16 bg-yellow-400 animate-pulse" />
              <ArrowRight className="w-5 h-5" />
            </div>
            <span>저기압 (L)</span>
          </div>
          <p className="text-center text-xs text-slate-200 leading-relaxed max-w-xl mx-auto">
            공기는 기압이 높은 곳(빽빽함)에서 기압이 낮은 곳(헐렁함)으로 균형을 맞추기 위해 쏟아져 나갑니다. 이 공기의 흐름이 바로 우리가 피부로 느끼는 <strong>바람(Wind)</strong>입니다!
          </p>
        </div>

        {/* Interactive Simulator Tips */}
        <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-2xl p-4 text-xs space-y-2 text-indigo-200">
          <div className="flex items-center gap-2 font-bold text-yellow-300">
            <Sparkles className="w-4 h-4" />
            <span>시뮬레이터 조작 팁:</span>
          </div>
          <p>1. <strong>노드 드래그:</strong> 빨간 H와 파란 L 노드를 캔버스 위에서 손가락이나 마우스로 원하는 곳에 끌어다 놓으세요.</p>
          <p>2. <strong>충격파 (Shockwave):</strong> 꽃가루가 날아가는 동안 캔버스를 터치하거나 클릭하면 파동이 퍼져 꽃가루 방향을 꺾을 수 있습니다.</p>
          <p>3. <strong>기압 차이 조절:</strong> 노드를 선택하고 + / - 버튼으로 기압 크기를 조절하면 풍속이 달라집니다.</p>
        </div>

        {/* Bottom Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-950/60 cursor-pointer"
          >
            확인하고 실험하기
          </button>
        </div>
      </div>
    </div>
  );
};
