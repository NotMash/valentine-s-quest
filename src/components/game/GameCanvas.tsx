import React, { useRef, useEffect } from 'react';
import { GameState, GAME_CONFIG, Enemy } from '../../game/types';

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

    ctx.save();

    // Screen shake
    if (gameState.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * gameState.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * gameState.screenShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    ctx.clearRect(-10, -10, GAME_CONFIG.width + 20, GAME_CONFIG.height + 20);

    // Draw level-specific background
    const bg = gameState.background;
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.height);
    gradient.addColorStop(0, bg.skyTop);
    gradient.addColorStop(1, bg.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    // Stars for night level
    if (bg.name === 'night') {
      drawStars(ctx, frameRef.current);
    }

    // Draw decorative clouds
    drawBackgroundClouds(ctx, frameRef.current, bg.name);

    // Draw platforms
    gameState.platforms.forEach(platform => {
      if (platform.type === 'cloud') {
        drawCloudPlatform(ctx, platform.x, platform.y, platform.width, platform.height);
      } else {
        drawGroundPlatform(ctx, platform.x, platform.y, platform.width, platform.height, bg.name);
      }
    });

    // Draw hearts
    gameState.hearts.forEach(heart => {
      if (!heart.collected) {
        drawHeart(ctx, heart.x, heart.y, heart.size, frameRef.current);
      } else if (heart.respawnTimer !== undefined) {
        // Draw faded heart with timer
        ctx.globalAlpha = 0.3;
        drawHeart(ctx, heart.x, heart.y, heart.size, frameRef.current);
        ctx.globalAlpha = 1;
      }
    });

    // Draw enemies
    gameState.enemies.forEach(enemy => {
      drawEnemy(ctx, enemy, frameRef.current);
    });

    // Draw sparkle trails
    gameState.sparkleTrails.forEach(spark => {
      ctx.globalAlpha = spark.life / spark.maxLife;
      ctx.fillStyle = spark.color;
      const s = spark.size * (spark.life / spark.maxLife);
      drawStar(ctx, spark.x, spark.y, s);
      ctx.globalAlpha = 1;
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      drawMiniHeart(ctx, particle.x, particle.y, particle.size, particle.color);
      ctx.globalAlpha = 1;
    });

    // Draw player (blink when invincible)
    if (gameState.invincibleTimer <= 0 || Math.floor(gameState.invincibleTimer * 10) % 2 === 0) {
      drawPlayer(ctx, gameState.player, frameRef.current);
    }

    ctx.restore();
    frameRef.current += 1;
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.width}
      height={GAME_CONFIG.height}
      className="w-full h-full rounded-2xl game-glow"
    />
  );
};

// === Drawing helpers ===

const drawStars = (ctx: CanvasRenderingContext2D, frame: number) => {
  ctx.fillStyle = '#ffffff';
  const stars = [
    { x: 50, y: 30 }, { x: 150, y: 80 }, { x: 300, y: 20 }, { x: 450, y: 60 },
    { x: 600, y: 40 }, { x: 700, y: 90 }, { x: 100, y: 120 }, { x: 520, y: 100 },
    { x: 380, y: 130 }, { x: 750, y: 30 }, { x: 200, y: 50 }, { x: 650, y: 110 },
  ];
  stars.forEach((star, i) => {
    const twinkle = 0.4 + Math.sin(frame * 0.05 + i * 1.7) * 0.4;
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(star.x, star.y, 1.5 + Math.sin(frame * 0.03 + i) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
};

const drawBackgroundClouds = (ctx: CanvasRenderingContext2D, frame: number, theme: string) => {
  const alpha = theme === 'night' ? 0.15 : 0.4;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  
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
  ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number
) => {
  ctx.save();
  ctx.shadowColor = 'rgba(150, 180, 200, 0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const centerY = y + height / 2;
  const radius = height;
  ctx.arc(x + radius, centerY, radius, 0, Math.PI * 2);
  for (let i = 1; i < width / (radius * 1.5); i++) {
    ctx.arc(x + radius + i * radius * 1.2, centerY - 5, radius * 1.1, 0, Math.PI * 2);
  }
  ctx.arc(x + width - radius, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawGroundPlatform = (
  ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, theme: string
) => {
  let colors: [string, string, string];
  switch (theme) {
    case 'sunset': colors = ['#c9e4a5', '#a8d88c', '#7cba5a']; break;
    case 'twilight': colors = ['#b8a9c9', '#9b8db8', '#7a6d99']; break;
    case 'night': colors = ['#2d4a3e', '#1e3a2f', '#152b22']; break;
    case 'love': colors = ['#f8b4c8', '#e899b0', '#d87e9a']; break;
    default: colors = ['#90EE90', '#7CCD7C', '#6B8E23']; break;
  }

  const grad = ctx.createLinearGradient(x, y, x, y + height);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.3, colors[1]);
  grad.addColorStop(1, colors[2]);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [15, 15, 0, 0]);
  ctx.fill();

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
  ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frame: number
) => {
  const pulse = 1 + Math.sin(frame * 0.1) * 0.1;
  const floatY = y + Math.sin(frame * 0.05) * 3;
  ctx.save();
  ctx.translate(x + size / 2, floatY + size / 2);
  ctx.scale(pulse, pulse);
  ctx.translate(-(x + size / 2), -(floatY + size / 2));
  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = 15;
  drawHeartShape(ctx, x, floatY, size, '#ff6b9d');
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(x + size * 0.3, floatY + size * 0.3, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy, frame: number) => {
  const { x, y, width, height } = enemy;
  const bounce = Math.sin(frame * 0.15) * 3;
  
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2 + bounce);
  
  // Body — spiky purple blob
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  const spikes = 8;
  for (let i = 0; i < spikes; i++) {
    const angle = (Math.PI * 2 / spikes) * i + frame * 0.05;
    const r = i % 2 === 0 ? width * 0.6 : width * 0.4;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Angry eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-5, -3, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(5, -3, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(-5, -2, 2.5, 0, Math.PI * 2);
  ctx.arc(5, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -8);
  ctx.lineTo(-3, -6);
  ctx.moveTo(8, -8);
  ctx.lineTo(3, -6);
  ctx.stroke();
  
  ctx.restore();
};

const drawMiniHeart = (
  ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string
) => {
  drawHeartShape(ctx, x - size / 2, y - size / 2, size, color);
};

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = ctx.fillStyle as string;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
};

const drawHeartShape = (
  ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x + size / 2, y + size);
  ctx.bezierCurveTo(x + size / 2, y + size * 0.7, x, y + size * 0.5, x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x + size / 2, y, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x + size, y, x + size, y + topCurveHeight);
  ctx.bezierCurveTo(x + size, y + size * 0.5, x + size / 2, y + size * 0.7, x + size / 2, y + size);
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

  const bodySize = width * 0.9;
  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = 10;
  drawHeartShape(ctx, -bodySize / 2, -bodySize / 2 - 5, bodySize, '#ff85a1');
  ctx.shadowBlur = 0;

  // Eyes
  const eyeY = -5;
  const eyeSpacing = 8;
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(-eyeSpacing, eyeY, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
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
