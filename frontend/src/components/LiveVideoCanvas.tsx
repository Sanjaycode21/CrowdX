import React, { useRef, useEffect } from 'react';
import { RiskCurrentData } from '../types/crowd';

interface LiveVideoCanvasProps {
  data: RiskCurrentData;
  showBoxes: boolean;
  showVectors: boolean;
  showHeatmap: boolean;
  showROI: boolean;
  showExit: boolean;
}

export const LiveVideoCanvas: React.FC<LiveVideoCanvasProps> = ({
  data,
  showBoxes,
  showVectors,
  showHeatmap,
  showROI,
  showExit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Base Surveillance Camera Background (Simulated Video Surface)
      ctx.fillStyle = '#0f172a'; // Deep slate camera feed background
      ctx.fillRect(0, 0, width, height);

      // Grid floor pattern simulating stadium concourse / hall floor
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render Crowd Dots (Simulated People)
      const numPeople = Math.min(80, Math.floor(data.people_count / 15));
      for (let i = 0; i < numPeople; i++) {
        const seedX = (i * 73 + frameCount * 0.5) % (width - 80) + 40;
        const seedY = (i * 47 + Math.sin(frameCount * 0.05 + i) * 10) % (height - 80) + 40;
        
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(seedX, seedY, 3.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 2. Density Heatmap Overlay (Subtle professional gradient overlay)
      if (showHeatmap) {
        const grad = ctx.createRadialGradient(
          width * 0.75, height * 0.3, 20,
          width * 0.75, height * 0.3, 180
        );

        if (data.level === 'CRITICAL') {
          grad.addColorStop(0, 'rgba(220, 38, 38, 0.45)');
          grad.addColorStop(0.5, 'rgba(234, 88, 12, 0.25)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (data.level === 'HIGH') {
          grad.addColorStop(0, 'rgba(234, 88, 12, 0.35)');
          grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.20)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (data.level === 'MEDIUM') {
          grad.addColorStop(0, 'rgba(217, 119, 6, 0.25)');
          grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.12)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          grad.addColorStop(0, 'rgba(34, 197, 94, 0.18)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Motion Vectors Overlay
      if (showVectors && data.vectors) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        data.vectors.slice(0, 35).forEach((v, idx) => {
          const vx = (v.x / 640) * width;
          const vy = (v.y / 360) * height;
          const dx = v.dx * 3;
          const dy = v.dy * 3;

          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(vx + dx, vy + dy);
          ctx.stroke();

          // Arrow head
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(vx + dx, vy + dy, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // 4. Bounding Boxes Overlay
      if (showBoxes && data.boxes) {
        ctx.lineWidth = 1.5;
        data.boxes.slice(0, 25).forEach((box) => {
          const bx = (box.x / 640) * width;
          const by = (box.y / 360) * height;
          const bw = (box.w / 640) * width;
          const bh = (box.h / 360) * height;

          ctx.strokeStyle = '#22c55e';
          ctx.strokeRect(bx, by, bw, bh);

          // Box tag
          ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
          ctx.fillRect(bx, by - 12, 42, 12);
          ctx.fillStyle = '#ffffff';
          ctx.font = '9px monospace';
          ctx.fillText(`P ${box.confidence}`, bx + 2, by - 3);
        });
      }

      // 5. ROI Boundary Overlay (Monitored Area: 250 m²)
      if (showROI) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(20, 20, width - 40, height - 40);
        ctx.setLineDash([]);

        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(20, 20, 110, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('ROI: 250 m²', 28, 33);
      }

      // 6. Exit Zone Overlay (Exit A)
      if (showExit) {
        const ex = width * 0.72;
        const ey = height * 0.12;
        const ew = 140;
        const eh = 65;

        ctx.strokeStyle = data.convergence_pct > 60 ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(ex, ey, ew, eh);

        ctx.fillStyle = data.convergence_pct > 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)';
        ctx.fillRect(ex, ey, ew, eh);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('EXIT A (GATE ZONE)', ex + 10, ey + 20);

        if (data.convergence_pct > 50) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText('⚠️ CONVERGING', ex + 10, ey + 42);
        }
      }

      // 7. Video Camera HUD Stamp
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`CAM-02 [GATE B MAIN] | ${data.mode} MODE | ${data.fps?.toFixed(1) || '29.4'} FPS`, 30, height - 16);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [data, showBoxes, showVectors, showHeatmap, showROI, showExit]);

  return (
    <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-lg overflow-hidden border border-slate-300 shadow-md">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={450} 
        className="w-full h-full object-cover"
      />
      {/* Live Badge Overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded border border-slate-700 flex items-center gap-2 font-mono">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span>LIVE REC</span>
      </div>
    </div>
  );
};
