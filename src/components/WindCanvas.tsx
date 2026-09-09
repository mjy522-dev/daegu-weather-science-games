import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PressureNode, PollenParticle, Shockwave, FireworkParticle, StreamlineParticle } from '../types';
import { updatePollen, calculateWindField, createFireworks } from '../utils/physics';
import { soundFx } from '../utils/audio';

interface WindCanvasProps {
  nodes: PressureNode[];
  onUpdateNodes: (nodes: PressureNode[]) => void;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  isFlying: boolean;
  onPollenEnd: (success: boolean) => void;
  showStreamlines: boolean;
  missionNumber: number;
}

export const WindCanvas: React.FC<WindCanvasProps> = ({
  nodes,
  onUpdateNodes,
  selectedNodeId,
  onSelectNode,
  isFlying,
  onPollenEnd,
  showStreamlines,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simulation state stored in refs for 60fps performance
  const particlesRef = useRef<PollenParticle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const fireworksRef = useRef<FireworkParticle[]>([]);
  const streamlinesRef = useRef<StreamlineParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Dragging state
  const draggingNodeIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Flowers status
  const [isBloomed, setIsBloomed] = useState<boolean>(false);
  const bloomProgressRef = useRef<number>(0);
  const hitCountRef = useRef<number>(0);
  const hasTriggeredVictoryRef = useRef<boolean>(false);

  // Start & Target positions (calculated dynamically on canvas size)
  const startPosRef = useRef<{ x: number; y: number }>({ x: 90, y: 440 });
  const targetPosRef = useRef<{ x: number; y: number; radius: number }>({ x: 700, y: 120, radius: 50 });

  // Initialize and resize canvas
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Set flower locations proportionally
    startPosRef.current = {
      x: Math.max(70, width * 0.12),
      y: Math.min(height - 65, height * 0.85),
    };
    targetPosRef.current = {
      x: Math.min(width - 80, width * 0.86),
      y: Math.max(75, height * 0.18),
      radius: Math.min(54, Math.max(38, width * 0.055)),
    };

    // Initialize ambient streamlines
    if (streamlinesRef.current.length === 0) {
      const streamCount = 120;
      const streams: StreamlineParticle[] = [];
      for (let i = 0; i < streamCount; i++) {
        streams.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          life: Math.random() * 80,
          maxLife: 60 + Math.random() * 50,
          speed: 1.2 + Math.random() * 1.5,
        });
      }
      streamlinesRef.current = streams;
    }
  }, []);

  useEffect(() => {
    updateCanvasDimensions();
    const handleResize = () => updateCanvasDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasDimensions]);

  // Handle pollen release
  useEffect(() => {
    if (isFlying) {
      soundFx.playWhoosh();
      setIsBloomed(false);
      bloomProgressRef.current = 0;
      hitCountRef.current = 0;
      hasTriggeredVictoryRef.current = false;

      // Generate 1,200 glowing pollen particles from start flower
      const start = startPosRef.current;
      const count = 1200;
      const particles: PollenParticle[] = [];
      const colors = ['#fef08a', '#fde047', '#facc15', '#fbbf24', '#fef9c3', '#ffffff'];

      for (let i = 0; i < count; i++) {
        const spreadAngle = -Math.PI / 4 + (Math.random() - 0.5) * 1.4;
        const speed = 1.0 + Math.random() * 2.6;
        const r = Math.random() * 20;
        const offsetAng = Math.random() * Math.PI * 2;

        particles.push({
          x: start.x + Math.cos(offsetAng) * r,
          y: start.y + Math.sin(offsetAng) * r,
          vx: Math.cos(spreadAngle) * speed,
          vy: Math.sin(spreadAngle) * speed,
          size: 1.2 + Math.random() * 2.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8 + Math.random() * 0.2,
          currentLife: 0,
          maxLife: 420 + Math.random() * 180,
          seed: Math.random() * 1000,
          swayFreq: 0.025 + Math.random() * 0.045,
          swayAmp: 0.3 + Math.random() * 0.7,
          hitTarget: false,
        });
      }

      particlesRef.current = particles;
    } else {
      particlesRef.current = [];
    }
  }, [isFlying]);

  // Main animation loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      timeRef.current += 1;
      const time = timeRef.current;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Clear with dark atmospheric background
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric grid dots
      ctx.save();
      ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
      const gridSize = 40;
      for (let gx = 20; gx < width; gx += gridSize) {
        for (let gy = 20; gy < height; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 1. Render Streamline wind visualizers
      if (showStreamlines) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';

        for (const s of streamlinesRef.current) {
          const { fx, fy, speed } = calculateWindField(s.x, s.y, nodes);
          s.vx = fx * 0.08 * s.speed;
          s.vy = fy * 0.08 * s.speed;
          const prevX = s.x;
          const prevY = s.y;

          s.x += s.vx;
          s.y += s.vy;
          s.life += 1;

          if (s.life > s.maxLife || s.x < -20 || s.x > width + 20 || s.y < -20 || s.y > height + 20) {
            s.x = Math.random() * width;
            s.y = Math.random() * height;
            s.life = 0;
            continue;
          }

          // Draw wind trail segment
          const trailAlpha = Math.sin((s.life / s.maxLife) * Math.PI) * 0.35;
          ctx.strokeStyle = `rgba(125, 211, 252, ${trailAlpha})`;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();

          // Streamline particle head
          ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha * 1.5})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Render Pressure Nodes (High and Low)
      for (const node of nodes) {
        const isSelected = selectedNodeId === node.id;
        const isH = node.type === 'H';

        // Rotate airflow wave indicators
        // Northern hemisphere: H rotates clockwise (+), L rotates counter-clockwise (-)
        node.rotationAngle += isH ? 0.025 : -0.025;

        ctx.save();
        ctx.translate(node.x, node.y);

        // Animated Airflow Wave Rings
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
          const wavePhase = ((time * 0.02 + (w / waveCount)) % 1);
          const currentRadius = node.radius * (0.65 + wavePhase * 1.2);
          const waveAlpha = Math.max(0, (1 - wavePhase) * 0.45);

          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isH
            ? `rgba(239, 68, 68, ${waveAlpha})`
            : `rgba(59, 130, 246, ${waveAlpha})`;
          ctx.lineWidth = 2.0;
          ctx.setLineDash([8, 8]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Rotating tangential wind arrows around the node
        ctx.save();
        ctx.rotate(node.rotationAngle);
        const arrowCount = 4;
        const orbitRadius = node.radius + 16;
        for (let a = 0; a < arrowCount; a++) {
          const angle = (a * Math.PI * 2) / arrowCount;
          const ax = Math.cos(angle) * orbitRadius;
          const ay = Math.sin(angle) * orbitRadius;

          ctx.save();
          ctx.translate(ax, ay);
          // Direction of tangent: Clockwise for H, Counter-clockwise for L
          ctx.rotate(angle + (isH ? Math.PI / 2 : -Math.PI / 2));

          ctx.fillStyle = isH ? 'rgba(252, 165, 165, 0.7)' : 'rgba(147, 197, 253, 0.7)';
          ctx.beginPath();
          ctx.moveTo(0, -6);
          ctx.lineTo(8, 0);
          ctx.lineTo(0, 6);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Node Outer Glow
        const grad = ctx.createRadialGradient(0, 0, node.radius * 0.2, 0, 0, node.radius * 1.4);
        if (isH) {
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
          grad.addColorStop(0.6, 'rgba(220, 38, 38, 0.3)');
          grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
        } else {
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
          grad.addColorStop(0.6, 'rgba(37, 99, 235, 0.3)');
          grad.addColorStop(1, 'rgba(37, 99, 235, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, node.radius * 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Node Main Body
        ctx.beginPath();
        ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isH ? '#dc2626' : '#2563eb';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.strokeStyle = isSelected ? '#facc15' : '#ffffff';
        ctx.stroke();

        // High / Low Letter
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Fredoka", "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.type, 0, -5);

        // Pressure text (hPa)
        ctx.font = 'bold 11px "Noto Sans KR", sans-serif';
        ctx.fillStyle = isH ? '#fecaca' : '#bfdbfe';
        ctx.fillText(`${node.hPa} hPa`, 0, 14);

        // Name tag underneath
        ctx.font = 'bold 12px "Noto Sans KR", sans-serif';
        ctx.fillStyle = isH ? '#f87171' : '#60a5fa';
        ctx.fillText(isH ? '고기압 (High)' : '저기압 (Low)', 0, node.radius + 18);

        ctx.restore();
      }

      // 3. Render Start Flower (Bottom-Left)
      const start = startPosRef.current;
      ctx.save();
      ctx.translate(start.x, start.y);

      // Start zone ambient aura
      const startAura = ctx.createRadialGradient(0, 0, 10, 0, 0, 48);
      startAura.addColorStop(0, 'rgba(74, 222, 128, 0.35)');
      startAura.addColorStop(1, 'rgba(74, 222, 128, 0)');
      ctx.fillStyle = startAura;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();

      // Stem & Leaves
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.quadraticCurveTo(-10, 32, 0, 45);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(-14, 28, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Flower Dandelion Head
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Fluff spore spikes
      ctx.strokeStyle = '#bbf7d0';
      ctx.lineWidth = 1.8;
      const spikeCount = 12;
      for (let s = 0; s < spikeCount; s++) {
        const sa = (s * Math.PI * 2) / spikeCount + Math.sin(time * 0.05) * 0.1;
        const len = 22 + Math.sin(time * 0.08 + s) * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sa) * len, Math.sin(sa) * len);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * len, Math.sin(sa) * len, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Start Label
      ctx.font = 'bold 12px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#86efac';
      ctx.textAlign = 'center';
      ctx.fillText('출발 (Start)', 0, 58);
      ctx.restore();

      // 4. Render Target Flower Zone (Top-Right)
      const target = targetPosRef.current;
      ctx.save();
      ctx.translate(target.x, target.y);

      // Target ambient beacon aura
      const beaconRadius = target.radius + 12 + Math.sin(time * 0.08) * 6;
      const targetAura = ctx.createRadialGradient(0, 0, target.radius * 0.5, 0, 0, beaconRadius);
      if (isBloomed) {
        targetAura.addColorStop(0, 'rgba(250, 204, 21, 0.6)');
        targetAura.addColorStop(0.7, 'rgba(245, 158, 11, 0.3)');
        targetAura.addColorStop(1, 'rgba(250, 204, 21, 0)');
      } else {
        targetAura.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
        targetAura.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
        targetAura.addColorStop(1, 'rgba(251, 191, 36, 0)');
      }
      ctx.fillStyle = targetAura;
      ctx.beginPath();
      ctx.arc(0, 0, beaconRadius, 0, Math.PI * 2);
      ctx.fill();

      // Collision Target Circle
      ctx.strokeStyle = isBloomed ? '#facc15' : 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash(isBloomed ? [] : [6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!isBloomed) {
        // Budding state: Closed green calyx with golden tips waiting for pollen
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // Yellow petal tips peeking out
        ctx.fillStyle = '#facc15';
        for (let p = 0; p < 8; p++) {
          const pa = (p * Math.PI * 2) / 8;
          ctx.beginPath();
          ctx.arc(Math.cos(pa) * 20, Math.sin(pa) * 20, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sleeping face
        ctx.fillStyle = '#78350f';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('😴', 0, 0);

        ctx.font = 'bold 12px "Noto Sans KR", sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.fillText('목표: 해바라기 🌻', 0, target.radius + 18);
      } else {
        // Bloomed Sunflower state: fully open golden sunflower with rotating petals!
        if (bloomProgressRef.current < 1) {
          bloomProgressRef.current = Math.min(1, bloomProgressRef.current + 0.05);
        }
        const bp = bloomProgressRef.current;

        // Rotating Petals
        ctx.save();
        ctx.rotate(time * 0.015);
        const petalCount = 16;
        for (let p = 0; p < petalCount; p++) {
          const pa = (p * Math.PI * 2) / petalCount;
          ctx.save();
          ctx.rotate(pa);
          ctx.fillStyle = p % 2 === 0 ? '#facc15' : '#fbbf24';
          ctx.beginPath();
          ctx.ellipse(28 * bp, 0, 16 * bp, 7 * bp, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Big brown seed disc
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(0, 0, 20 * bp, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Happy blooming smiling face!
        ctx.font = `${Math.round(20 * bp)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('😊', 0, 0);

        ctx.font = 'bold 13px "Noto Sans KR", sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.fillText('개화 성공! 🌻', 0, target.radius + 20);
      }
      ctx.restore();

      // 5. Render 1,000+ Glowing Pollen Particles with `globalCompositeOperation = 'lighter'`
      const particles = particlesRef.current;
      if (particles.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // CRITICAL SPECIFICATION

        let activeCount = 0;
        const targetX = target.x;
        const targetY = target.y;
        const targetRadSq = (target.radius + 12) * (target.radius + 12);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.currentLife >= p.maxLife) continue;

          // Update physics
          updatePollen(p, nodes, shockwavesRef.current, time);

          // Bounds checking - cull offscreen particles to conserve life
          if (p.x < -80 || p.x > width + 80 || p.y < -80 || p.y > height + 80) {
            p.currentLife = p.maxLife;
            continue;
          }

          // Target collision detection
          if (!p.hitTarget) {
            const dx = p.x - targetX;
            const dy = p.y - targetY;
            if (dx * dx + dy * dy < targetRadSq) {
              p.hitTarget = true;
              hitCountRef.current++;

              // First hits trigger victory and fireworks
              if (hitCountRef.current >= 6 && !hasTriggeredVictoryRef.current) {
                hasTriggeredVictoryRef.current = true;
                setIsBloomed(true);
                soundFx.playVictory();
                fireworksRef.current = [
                  ...fireworksRef.current,
                  ...createFireworks(targetX, targetY, 220),
                ];
                onPollenEnd(true);
              }
            }
          }

          activeCount++;

          // Draw glowing particle
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Check if all particles finished without reaching target
        if (isFlying && activeCount === 0 && !hasTriggeredVictoryRef.current) {
          onPollenEnd(false);
        }
      }

      // 6. Render Expanding Shockwaves
      const shockwaves = shockwavesRef.current;
      if (shockwaves.length > 0) {
        ctx.save();
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.radius += 5.5;
          sw.alpha *= 0.94;

          // Shockwave glow ring
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${sw.alpha * 0.9})`;
          ctx.lineWidth = Math.max(1, 6 * sw.alpha);
          ctx.stroke();

          // Second inner shimmer ring
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 8), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(236, 72, 153, ${sw.alpha * 0.6})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          if (sw.radius >= sw.maxRadius || sw.alpha < 0.02) {
            shockwaves.splice(i, 1);
          }
        }
        ctx.restore();
      }

      // 7. Render Fireworks Particles
      const fireworks = fireworksRef.current;
      if (fireworks.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = fireworks.length - 1; i >= 0; i--) {
          const fw = fireworks[i];
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.09; // Gravity
          fw.vx *= 0.97;
          fw.life++;
          fw.alpha = 1 - fw.life / fw.maxLife;

          ctx.fillStyle = fw.color;
          ctx.globalAlpha = Math.max(0, fw.alpha);
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
          ctx.fill();

          if (fw.life >= fw.maxLife) {
            fireworks.splice(i, 1);
          }
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [nodes, selectedNodeId, isFlying, onPollenEnd, showStreamlines, isBloomed]);

  // Touch / Mouse interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on an existing pressure node
    let clickedNodeId: string | null = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dist = Math.hypot(x - node.x, y - node.y);
      if (dist <= node.radius + 10) {
        clickedNodeId = node.id;
        draggingNodeIdRef.current = node.id;
        dragOffsetRef.current = { x: x - node.x, y: y - node.y };
        soundFx.playClick();
        break;
      }
    }

    if (clickedNodeId) {
      onSelectNode(clickedNodeId);
      return;
    }

    // Deselect if clicked empty area
    onSelectNode(null);

    // Interactive Touch Reflection: Shockwave impulse when clicking canvas
    // Spec: "Clicking/tapping on the canvas while pollen is flying must trigger a shockwave impulse that deflects nearby particles in real time."
    soundFx.playShockwave();
    shockwavesRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      radius: 8,
      maxRadius: 130,
      strength: 7.0,
      alpha: 1.0,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !draggingNodeIdRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const updated = nodes.map((node) => {
      if (node.id === draggingNodeIdRef.current) {
        return {
          ...node,
          x: Math.max(node.radius + 10, Math.min(width - node.radius - 10, x - dragOffsetRef.current.x)),
          y: Math.max(node.radius + 10, Math.min(height - node.radius - 10, y - dragOffsetRef.current.y)),
        };
      }
      return node;
    });

    onUpdateNodes(updated);
  };

  const handlePointerUp = () => {
    draggingNodeIdRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      id="wind-simulator-canvas-container"
      className="relative w-full h-[460px] sm:h-[500px] lg:h-[560px] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl bg-radial from-[#0d1138] via-[#090c28] to-[#05071a] select-none touch-none"
    >
      <canvas
        ref={canvasRef}
        id="wind-maker-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Floating Canvas Hint */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-wrap gap-2 items-center text-xs">
        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          H는 시계방향 발산 (Outward)
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          L은 반시계방향 수렴 (Inward)
        </span>
      </div>

      {/* Shockwave instruction pill */}
      <div className="absolute bottom-3 left-3 pointer-events-none text-xs text-indigo-300/80 bg-indigo-950/60 border border-indigo-500/20 px-3 py-1 rounded-full backdrop-blur-sm">
        💡 캔버스를 터치/클릭하면 <span className="text-pink-300 font-bold">충격파(Shockwave)</span>로 꽃가루를 튕길 수 있어요!
      </div>
    </div>
  );
};
