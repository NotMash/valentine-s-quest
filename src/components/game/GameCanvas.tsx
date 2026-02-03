import React, { useRef, useEffect } from 'react';
import { GameState, GAME_CONFIG } from '../../game/types';

interface GameCanvasProps {
  gameState: GameState;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    // Draw sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.height);
    gradient.addColorStop(0, '#b8e0ff');
    gradient.addColorStop(1, '#ffd6e7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    // Draw decorative clouds in background
    drawBackgroundClouds(ctx, frameRef.current);

    // Draw platforms
    gameState.platforms.forEach(platform => {
      if (platform.type === 'cloud') {
        drawCloudPlatform(ctx, platform.x, platform.y, platform.width, platform.height);
      } else {
        drawGroundPlatform(ctx, platform.x, platform.y, platform.width, platform.height);
      }
    });

    // Draw hearts
    gameState.hearts.forEach(heart => {
      if (!heart.collected) {
        drawHeart(ctx, heart.x, heart.y, heart.size, frameRef.current);
      }
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      drawMiniHeart(ctx, particle.x, particle.y, particle.size, particle.color);
      ctx.globalAlpha = 1;
    });

    // Draw player
    drawPlayer(ctx, gameState.player, frameRef.current);

    frameRef.current += 1;
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.width}
      height={GAME_CONFIG.height}
      className="rounded-2xl game-glow"
    />
  );
};

const drawBackgroundClouds = (ctx: CanvasRenderingContext2D, frame: number) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  
  const clouds = [
    { x: 50, y: 80, size: 60 },
    { x: 200, y: 120, size: 45 },
    { x: 500, y: 60, size: 55 },
    { x: 650, y: 140, size: 50 },
  ];

  clouds.forEach(cloud => {
    const floatOffset = Math.sin(frame * 0.02 + cloud.x) * 3;
    drawCloudShape(ctx, cloud.x, cloud.y + floatOffset, cloud.size);
  });
};

const drawCloudShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
  ctx.fill();
};

const drawCloudPlatform = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  ctx.save();
  ctx.shadowColor = 'rgba(150, 180, 200, 0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  // Main cloud body
  const centerY = y + height / 2;
  const radius = height;
  
  // Left puff
  ctx.arc(x + radius, centerY, radius, 0, Math.PI * 2);
  // Middle puffs
  for (let i = 1; i < width / (radius * 1.5); i++) {
    ctx.arc(x + radius + i * radius * 1.2, centerY - 5, radius * 1.1, 0, Math.PI * 2);
  }
  // Right puff
  ctx.arc(x + width - radius, centerY, radius, 0, Math.PI * 2);
  
  ctx.fill();
  ctx.restore();
};

const drawGroundPlatform = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  // Grass layer
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, '#90EE90');
  gradient.addColorStop(0.3, '#7CCD7C');
  gradient.addColorStop(1, '#6B8E23');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [15, 15, 0, 0]);
  ctx.fill();

  // Draw little flowers
  for (let i = 0; i < width; i += 40) {
    if (Math.sin(i) > 0) {
      drawFlower(ctx, x + i + 20, y - 5);
    }
  }
};

const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = '#ff85a1';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    const angle = (Math.PI * 2 / 5) * i;
    ctx.arc(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
};

const drawHeart = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  frame: number
) => {
  const pulse = 1 + Math.sin(frame * 0.1) * 0.1;
  const floatY = y + Math.sin(frame * 0.05) * 3;

  ctx.save();
  ctx.translate(x + size / 2, floatY + size / 2);
  ctx.scale(pulse, pulse);
  ctx.translate(-(x + size / 2), -(floatY + size / 2));

  // Glow effect
  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = 15;

  drawHeartShape(ctx, x, floatY, size, '#ff6b9d');

  // Shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(x + size * 0.3, floatY + size * 0.3, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawMiniHeart = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  drawHeartShape(ctx, x - size / 2, y - size / 2, size, color);
};

const drawHeartShape = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x + size / 2, y + size);
  ctx.bezierCurveTo(
    x + size / 2, y + size * 0.7,
    x, y + size * 0.5,
    x, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x, y,
    x + size / 2, y,
    x + size / 2, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + size / 2, y,
    x + size, y,
    x + size, y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + size, y + size * 0.5,
    x + size / 2, y + size * 0.7,
    x + size / 2, y + size
  );
  ctx.fill();
};

const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: { position: { x: number; y: number }; width: number; height: number; facingRight: boolean; isGrounded: boolean; velocity: { y: number } },
  frame: number
) => {
  const { position, width, height, facingRight, isGrounded, velocity } = player;
  const squish = isGrounded ? 1 : (velocity.y > 0 ? 0.9 : 1.1);
  const stretch = isGrounded ? 1 : (velocity.y > 0 ? 1.1 : 0.9);

  ctx.save();
  ctx.translate(position.x + width / 2, position.y + height / 2);
  ctx.scale(facingRight ? 1 : -1, 1);
  ctx.scale(squish, stretch);

  // Body (pink heart character)
  const bodySize = width * 0.9;
  
  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = 10;
  
  // Main body
  drawHeartShape(ctx, -bodySize / 2, -bodySize / 2 - 5, bodySize, '#ff85a1');
  
  // Cute face
  ctx.shadowBlur = 0;
  
  // Eyes
  const eyeY = -5;
  const eyeSpacing = 8;
  
  // Left eye
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(-eyeSpacing, eyeY, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Right eye
  ctx.beginPath();
  ctx.ellipse(eyeSpacing, eyeY, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye shines
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-eyeSpacing + 1, eyeY - 2, 2, 0, Math.PI * 2);
  ctx.arc(eyeSpacing + 1, eyeY - 2, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Blush
  ctx.fillStyle = 'rgba(255, 150, 180, 0.5)';
  ctx.beginPath();
  ctx.ellipse(-15, 5, 6, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(15, 5, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Cute smile
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 5, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
};

export default GameCanvas;
