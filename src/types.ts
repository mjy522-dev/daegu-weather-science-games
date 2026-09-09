/**
 * Types for Wind Maker: High vs. Low Pressure Adventure
 */

export type NodeType = 'H' | 'L';

export interface PressureNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  radius: number;
  strength: number; // Positive value
  hPa: number;      // e.g., 1024 for H, 996 for L
  rotationAngle: number;
}

export interface PollenParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  currentLife: number;
  maxLife: number;
  seed: number;
  swayFreq: number;
  swayAmp: number;
  hitTarget: boolean;
}

export interface Shockwave {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  alpha: number;
}

export interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface StreamlineParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  speed: number;
}

export type GameStatus = 'idle' | 'flying' | 'success' | 'retry';

export interface MissionPreset {
  id: number;
  title: string;
  koreanTitle: string;
  subtitle: string;
  description: string;
  targetPosRatio: { x: number; y: number };
  startPosRatio: { x: number; y: number };
  tip: string;
}
