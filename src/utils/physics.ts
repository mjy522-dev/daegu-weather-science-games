/**
 * Physics engine for Wind Maker: Vector field dynamics and particle motion
 */

import { PressureNode, PollenParticle, Shockwave, FireworkParticle } from '../types';

/**
 * Calculates the combined wind velocity vector at a given position (x, y)
 * based on all High and Low pressure nodes.
 *
 * Physics rules:
 * - High Pressure (H): Outward radial force + Clockwise tangential twist (Northern Hemisphere anticyclone)
 * - Low Pressure (L): Inward radial force + Counter-Clockwise tangential twist (Northern Hemisphere cyclone)
 */
export function calculateWindField(
  x: number,
  y: number,
  nodes: PressureNode[]
): { fx: number; fy: number; speed: number } {
  let fx = 0;
  let fy = 0;

  for (const node of nodes) {
    const dx = x - node.x;
    const dy = y - node.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    // Softening parameter to prevent division by zero or infinite forces
    const softening = 45;
    const effectiveDist = Math.max(dist, softening);

    // Falloff: force scales with strength and inverse distance
    // Using 1 / (dist + 30) for smooth macroscopic air stream
    const baseMagnitude = (node.strength * 900) / (effectiveDist * 1.8 + 80);

    // Radial unit vectors
    const nx = dx / effectiveDist;
    const ny = dy / effectiveDist;

    // Tangential unit vectors (perpendicular)
    // Clockwise: (ny, -nx)
    // Counter-clockwise: (-ny, nx)
    const twistRatio = 0.55; // Realistic Coriolis swirl component

    if (node.type === 'H') {
      // High pressure pushes OUTWARD and spirals CLOCKWISE
      const radialX = nx;
      const radialY = ny;
      const tangX = -ny; // Clockwise in screen coordinates (y is down)
      const tangY = nx;

      fx += (radialX * (1 - twistRatio) + tangX * twistRatio) * baseMagnitude;
      fy += (radialY * (1 - twistRatio) + tangY * twistRatio) * baseMagnitude;
    } else {
      // Low pressure pulls INWARD and spirals COUNTER-CLOCKWISE
      const radialX = -nx;
      const radialY = -ny;
      const tangX = ny; // Counter-clockwise in screen coordinates
      const tangY = -nx;

      fx += (radialX * (1 - twistRatio) + tangX * twistRatio) * baseMagnitude;
      fy += (radialY * (1 - twistRatio) + tangY * twistRatio) * baseMagnitude;
    }
  }

  const speed = Math.hypot(fx, fy);
  return { fx, fy, speed };
}

/**
 * Creates a batch of 1,000+ pollen particles originating from the start flower
 */
export function generatePollenBatch(
  startX: number,
  startY: number,
  count: number = 1200
): PollenParticle[] {
  const particles: PollenParticle[] = [];
  const colors = [
    '#fef08a', // Yellow 200
    '#fde047', // Yellow 300
    '#facc15', // Yellow 400
    '#fbbf24', // Amber 400
    '#fed7aa', // Orange 200
    '#ffffff', // Pure spark
  ];

  for (let i = 0; i < count; i++) {
    // Clustered initial spray with natural dispersion
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 26;
    const px = startX + Math.cos(angle) * radius;
    const py = startY + Math.sin(angle) * radius;

    // Initial slight ejection velocity toward top-right
    const initAngle = -Math.PI / 4 + (Math.random() - 0.5) * 1.2;
    const initSpeed = 0.8 + Math.random() * 2.2;

    particles.push({
      x: px,
      y: py,
      vx: Math.cos(initAngle) * initSpeed,
      vy: Math.sin(initAngle) * initSpeed,
      size: 1.4 + Math.random() * 2.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.7 + Math.random() * 0.3,
      currentLife: 0,
      maxLife: 380 + Math.random() * 160,
      seed: Math.random() * 1000,
      swayFreq: 0.03 + Math.random() * 0.05,
      swayAmp: 0.25 + Math.random() * 0.65,
      hitTarget: false,
    });
  }

  return particles;
}

/**
 * Updates a single pollen particle's physics
 */
export function updatePollen(
  particle: PollenParticle,
  nodes: PressureNode[],
  shockwaves: Shockwave[],
  time: number
): void {
  // 1. Vector field force
  const { fx, fy } = calculateWindField(particle.x, particle.y, nodes);

  // 2. Organic Sine/Cosine wave turbulence
  const turbulenceX = Math.sin(time * particle.swayFreq + particle.seed) * particle.swayAmp;
  const turbulenceY = Math.cos(time * (particle.swayFreq * 0.85) + particle.seed * 1.3) * particle.swayAmp;

  // 3. Accelerate towards wind vector with fluid air resistance
  const airDrag = 0.94;
  particle.vx = (particle.vx + fx * 0.07 + turbulenceX * 0.1) * airDrag;
  particle.vy = (particle.vy + fy * 0.07 + turbulenceY * 0.1) * airDrag;

  // 4. Shockwave deflection impulse
  for (const wave of shockwaves) {
    const dx = particle.x - wave.x;
    const dy = particle.y - wave.y;
    const dist = Math.hypot(dx, dy);

    // Shockwave wavefront is a ring of thickness ~45px
    const wavefrontDist = Math.abs(dist - wave.radius);
    if (wavefrontDist < 50 && dist > 1) {
      const falloff = (1 - wavefrontDist / 50) * (wave.alpha);
      const impulse = wave.strength * falloff;
      particle.vx += (dx / dist) * impulse * 1.4;
      particle.vy += (dy / dist) * impulse * 1.4;
    }
  }

  // 5. Apply velocity
  particle.x += particle.vx;
  particle.y += particle.vy;

  // 6. Age & life fading
  particle.currentLife++;
  const lifeRatio = particle.currentLife / particle.maxLife;
  if (lifeRatio > 0.75) {
    particle.alpha = Math.max(0, (1 - lifeRatio) * 4);
  }
}

/**
 * Creates fireworks particles upon target pollination
 */
export function createFireworks(x: number, y: number, count: number = 180): FireworkParticle[] {
  const fireworks: FireworkParticle[] = [];
  const palette = ['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#c084fc', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 8.5;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      size: 2 + Math.random() * 3.5,
      alpha: 1,
      life: 0,
      maxLife: 45 + Math.random() * 35,
    });
  }

  return fireworks;
}
