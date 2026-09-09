import React from 'react';
import { Plus, RotateCcw, Play, Eye, EyeOff, Trash2, ArrowUpRight, ShieldAlert, Sparkles, Compass } from 'lucide-react';
import { PressureNode } from '../types';
import { soundFx } from '../utils/audio';

interface ControlPanelProps {
  nodes: PressureNode[];
  onAddNode: (type: 'H' | 'L') => void;
  onRemoveSelectedNode: () => void;
  selectedNode: PressureNode | null;
  onUpdateSelectedStrength: (delta: number) => void;
  onReleasePollen: () => void;
  onResetCanvas: () => void;
  isFlying: boolean;
  showStreamlines: boolean;
  onToggleStreamlines: () => void;
  missionIndex: number;
  onChangeMission: (index: number) => void;
  missionsCount: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  nodes,
  onAddNode,
  onRemoveSelectedNode,
  selectedNode,
  onUpdateSelectedStrength,
  onReleasePollen,
  onResetCanvas,
  isFlying,
  showStreamlines,
  onToggleStreamlines,
  missionIndex,
  onChangeMission,
  missionsCount,
}) => {
  return (
    <div id="bottom-control-panel" className="w-full space-y-4">
      {/* Galaxy Quest Kids Science Mission Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-yellow-400" />
            탐험 코스:
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: missionsCount }).map((_, idx) => (
              <button
                key={idx}
                id={`mission-select-btn-${idx + 1}`}
                onClick={() => {
                  soundFx.playClick();
                  onChangeMission(idx);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  missionIndex === idx
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                코스 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Streamline wind lines toggle */}
        <button
          id="toggle-streamlines-button"
          onClick={() => {
            soundFx.playClick();
            onToggleStreamlines();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            showStreamlines
              ? 'bg-sky-950/60 border-sky-400/50 text-sky-300 shadow-sm'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {showStreamlines ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>바람결(기류) 표시: {showStreamlines ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Control Card */}
      <div className="bg-gradient-to-b from-[#11163e] to-[#0a0d2a] border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Left: Spawn Node Buttons & Active Selection Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">
            {/* Add High Pressure (Red H) */}
            <button
              id="spawn-h-node-button"
              onClick={() => onAddNode('H')}
              disabled={isFlying}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-900/40 border border-red-400/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-black">
                H
              </div>
              <div className="text-left">
                <div className="leading-tight">고기압 (H) 배치</div>
                <div className="text-[10px] text-red-200 font-normal">바람을 밀어냄 (시계방향)</div>
              </div>
              <Plus className="w-4 h-4 ml-1" />
            </button>

            {/* Add Low Pressure (Blue L) */}
            <button
              id="spawn-l-node-button"
              onClick={() => onAddNode('L')}
              disabled={isFlying}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-900/40 border border-blue-400/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-black">
                L
              </div>
              <div className="text-left">
                <div className="leading-tight">저기압 (L) 배치</div>
                <div className="text-[10px] text-blue-200 font-normal">바람을 당김 (반시계방향)</div>
              </div>
              <Plus className="w-4 h-4 ml-1" />
            </button>

            {/* Selected Node Quick Adjust Bar */}
            {selectedNode && (
              <div
                id="selected-node-controls"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-yellow-500/50 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={`font-black px-1.5 py-0.5 rounded text-white ${
                      selectedNode.type === 'H' ? 'bg-red-600' : 'bg-blue-600'
                    }`}
                  >
                    {selectedNode.type}
                  </span>
                  <span className="text-slate-300 font-mono text-xs">{selectedNode.hPa} hPa</span>
                </div>

                <div className="flex items-center gap-1 ml-1">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onUpdateSelectedStrength(-1);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center border border-slate-700 cursor-pointer"
                    title="기압 세기 약하게"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onUpdateSelectedStrength(1);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center border border-slate-700 cursor-pointer"
                    title="기압 세기 강하게"
                  >
                    +
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onRemoveSelectedNode();
                    }}
                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-200 border border-red-800/60 ml-1 cursor-pointer"
                    title="선택한 기압 노드 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Large Glowing RELEASE POLLEN Button & Reset */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
            {/* Canvas Reset Button */}
            <button
              id="reset-canvas-button"
              onClick={() => {
                soundFx.playClick();
                onResetCanvas();
              }}
              className="px-4 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white font-bold text-sm border border-slate-700/70 shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="캔버스 초기화"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>초기화 (Reset)</span>
            </button>

            {/* Large Glowing 'RELEASE POLLEN!' Button (SPECIFICATION REQUIRED) */}
            <button
              id="release-pollen-button"
              onClick={onReleasePollen}
              disabled={isFlying}
              className={`relative group px-6 sm:px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 transition-all shadow-2xl cursor-pointer ${
                isFlying
                  ? 'bg-amber-600/60 text-amber-200 cursor-wait opacity-80'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-yellow-500/50 hover:shadow-yellow-400/70 hover:scale-105 active:scale-95 animate-pulse'
              }`}
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span className="tracking-wide font-['Noto_Sans_KR']">
                {isFlying ? '꽃가루 날아가는 중...' : 'RELEASE POLLEN! 💨'}
              </span>
              <ArrowUpRight className="w-5 h-5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Kid-Friendly Science Tip Banner (Galaxy Quest Style) */}
      <div
        id="science-tip-banner"
        className="flex items-start sm:items-center gap-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200"
      >
        <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-sm">
          💡
        </div>
        <div className="flex-1 leading-relaxed">
          <strong className="text-yellow-300 font-bold mr-1">국립대구기상과학관 탐험 팁:</strong>
          바람은 공기가 무거운 <span className="text-red-400 font-bold">고기압(H)</span>에서 공기가 가벼운{' '}
          <span className="text-blue-400 font-bold">저기압(L)</span> 쪽으로 불어갑니다. 고기압 노드를 꽃가루 출발지 뒤에 놓고, 저기압 노드를 해바라기 쪽에 놓아보세요!
        </div>
      </div>
    </div>
  );
};
