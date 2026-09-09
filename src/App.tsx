/**
 * Wind Maker: High vs. Low Pressure Adventure
 * Educational Physics Simulator for Elementary Students
 * In collaboration with National Daegu Meteorological Science Museum
 */

import React, { useState, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { WindCanvas } from './components/WindCanvas';
import { ControlPanel } from './components/ControlPanel';
import { QuizModal } from './components/QuizModal';
import { VictoryModal } from './components/VictoryModal';
import { RetryToast } from './components/RetryToast';
import { ScienceGuideModal } from './components/ScienceGuideModal';
import { FooterLogo } from './components/FooterLogo';
import { PressureNode } from './types';
import { MISSIONS, getDefaultNodesForMission } from './data/missions';
import { soundFx } from './utils/audio';

export default function App() {
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const currentMission = MISSIONS[missionIndex];

  // Canvas nodes state
  const [nodes, setNodes] = useState<PressureNode[]>(() => getDefaultNodesForMission(1, 800, 500));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Simulation status
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals & Popups
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isRetryOpen, setIsRetryOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Selected node
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // Calculate approximate wind speed & pressure gradient from nodes for the TopBar meter
  const { avgWindSpeed, pressureDiff } = useMemo(() => {
    let maxH = 1013;
    let minL = 1013;
    let totalStrength = 0;

    for (const node of nodes) {
      if (node.type === 'H') {
        maxH = Math.max(maxH, node.hPa);
      } else {
        minL = Math.min(minL, node.hPa);
      }
      totalStrength += node.strength;
    }

    const diff = Math.max(0, maxH - minL);
    // Convert to realistic intuitive wind speed range (3 ~ 18 m/s)
    const speed = Math.min(22, 2.5 + diff * 0.38 + totalStrength * 0.45);
    return { avgWindSpeed: speed, pressureDiff: diff };
  }, [nodes]);

  // Handle adding new node
  const handleAddNode = (type: 'H' | 'L') => {
    soundFx.playAddNode(type);
    const id = `node-${type}-${Date.now()}`;
    const newNode: PressureNode = {
      id,
      type,
      // Place near center of canvas with slight random offset
      x: 350 + (Math.random() - 0.5) * 160,
      y: 240 + (Math.random() - 0.5) * 120,
      radius: 36,
      strength: 5,
      hPa: type === 'H' ? 1024 : 996,
      rotationAngle: 0,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  // Remove selected node
  const handleRemoveSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
  };

  // Adjust strength / hPa of selected node
  const handleUpdateSelectedStrength = (delta: number) => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === selectedNodeId) {
          const newStrength = Math.max(2, Math.min(10, node.strength + delta));
          const hPaDelta = delta * 4;
          const newHpa = node.type === 'H' ? Math.max(1015, node.hPa + hPaDelta) : Math.min(1010, node.hPa - hPaDelta);
          return {
            ...node,
            strength: newStrength,
            hPa: newHpa,
          };
        }
        return node;
      })
    );
  };

  // Release Pollen Trigger
  const handleReleasePollen = () => {
    if (isFlying) return;
    setIsRetryOpen(false);
    setIsVictoryOpen(false);
    setIsFlying(true);
  };

  // Pollen Flight Completed
  const handlePollenEnd = (success: boolean) => {
    setIsFlying(false);
    if (success) {
      setIsRetryOpen(false);
      setIsVictoryOpen(true);
    } else {
      setIsRetryOpen(true);
    }
  };

  // Reset Canvas
  const handleResetCanvas = () => {
    setIsFlying(false);
    setIsRetryOpen(false);
    setIsVictoryOpen(false);
    setSelectedNodeId(null);
    setNodes(getDefaultNodesForMission(currentMission.id, 800, 500));
  };

  // Change Mission
  const handleChangeMission = (index: number) => {
    setMissionIndex(index);
    setIsFlying(false);
    setIsRetryOpen(false);
    setIsVictoryOpen(false);
    setSelectedNodeId(null);
    setNodes(getDefaultNodesForMission(MISSIONS[index].id, 800, 500));
  };

  const handleNextMission = () => {
    if (missionIndex < MISSIONS.length - 1) {
      handleChangeMission(missionIndex + 1);
    }
  };

  // Toggle Sound
  const handleToggleSound = () => {
    soundFx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#070919] via-[#0c1033] to-[#060818] text-slate-100 selection:bg-yellow-400 selection:text-black">
      {/* Top Header & Mission Bar */}
      <TopBar
        missionTitle={currentMission.title}
        avgWindSpeed={avgWindSpeed}
        pressureDiff={pressureDiff}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        missionNumber={currentMission.id}
        totalMissions={MISSIONS.length}
      />

      {/* Main Interactive Adventure Canvas & Controls */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* Mission Briefing Pill (Galaxy Quest Kids style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌻</span>
            <div>
              <span className="text-xs font-black text-yellow-300">
                {currentMission.koreanTitle}
              </span>
              <p className="text-[11px] text-slate-300">
                {currentMission.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 self-end sm:self-auto">
            <span>목표:</span>
            <span className="text-yellow-400 font-bold">1,000+ 꽃가루를 해바라기에 도달시키기</span>
          </div>
        </div>

        {/* The Physics Simulator Canvas */}
        <WindCanvas
          nodes={nodes}
          onUpdateNodes={setNodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          isFlying={isFlying}
          onPollenEnd={handlePollenEnd}
          showStreamlines={showStreamlines}
          missionNumber={currentMission.id}
        />

        {/* Control Panel (Spawn H/L, Release Pollen, Reset, etc.) */}
        <ControlPanel
          nodes={nodes}
          onAddNode={handleAddNode}
          onRemoveSelectedNode={handleRemoveSelectedNode}
          selectedNode={selectedNode}
          onUpdateSelectedStrength={handleUpdateSelectedStrength}
          onReleasePollen={handleReleasePollen}
          onResetCanvas={handleResetCanvas}
          isFlying={isFlying}
          showStreamlines={showStreamlines}
          onToggleStreamlines={() => setShowStreamlines(!showStreamlines)}
          missionIndex={missionIndex}
          onChangeMission={handleChangeMission}
          missionsCount={MISSIONS.length}
        />
      </main>

      {/* Popups & Modals */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        onClose={() => setIsVictoryOpen(false)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onNextMission={handleNextMission}
        onReplay={handleReleasePollen}
        missionNumber={currentMission.id}
        totalMissions={MISSIONS.length}
      />

      <RetryToast
        isOpen={isRetryOpen}
        onClose={() => setIsRetryOpen(false)}
        onRetry={handleReleasePollen}
        tip={currentMission.tip}
      />

      <ScienceGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer Logo & National Daegu Meteorological Science Museum Branding */}
      <FooterLogo />
    </div>
  );
}
