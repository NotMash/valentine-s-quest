import React, { useState, useCallback, useEffect, useRef } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import MobileControls from './MobileControls';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboard } from '../../hooks/useKeyboard';
import { GameState, GAME_CONFIG } from '../../game/types';
import { createLevel, TOTAL_LEVELS } from '../../game/levels';
import { updatePlayer, checkHeartCollision, createHeartParticles, updateParticles } from '../../game/physics';
import { playJumpSound, playCollectSound, playWinSound, playLevelCompleteSound } from '../../game/sounds';

interface ValentineGameProps {
  girlfriendName?: string;
}

const createInitialState = (level: number = 1): GameState => {
  const { platforms, hearts } = createLevel(level);
  return {
    player: {
      position: { x: 100, y: 450 },
      velocity: { x: 0, y: 0 },
      width: GAME_CONFIG.playerSize,
      height: GAME_CONFIG.playerSize,
      isGrounded: false,
      facingRight: true,
    },
    platforms,
    hearts,
    particles: [],
    score: 0,
    totalHearts: hearts.length,
    gameWon: false,
    gameStarted: false,
    level,
    levelComplete: false,
    screenShake: 0,
    sparkleTrails: [],
  };
};

const ValentineGame: React.FC<ValentineGameProps> = ({ girlfriendName }) => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(1));
  const keys = useKeyboard();
  const [mobileKeys, setMobileKeys] = useState({ left: false, right: false, up: false, boost: false });
  const prevGrounded = useRef(false);

  const combinedKeys = {
    left: keys.left || mobileKeys.left,
    right: keys.right || mobileKeys.right,
    up: keys.up || mobileKeys.up,
    boost: keys.boost || mobileKeys.boost,
  };

  const gameLoop = useCallback((deltaTime: number) => {
    setGameState(prev => {
      if (!prev.gameStarted || prev.gameWon || prev.levelComplete) return prev;

      const newPlayer = updatePlayer(prev.player, combinedKeys, prev.platforms, deltaTime);

      // Jump sound
      if (prevGrounded.current && !newPlayer.isGrounded && newPlayer.velocity.y < 0) {
        playJumpSound();
      }
      prevGrounded.current = newPlayer.isGrounded;

      // Check heart collisions
      let newHearts = [...prev.hearts];
      let newScore = prev.score;
      let newParticles = [...prev.particles];
      let screenShake = Math.max(0, prev.screenShake - deltaTime * 10);

      newHearts = newHearts.map(heart => {
        if (!heart.collected && checkHeartCollision(newPlayer, heart)) {
          newScore++;
          newParticles = [...newParticles, ...createHeartParticles(heart.x + heart.size / 2, heart.y + heart.size / 2)];
          screenShake = 3;
          playCollectSound();
          return { ...heart, collected: true };
        }
        return heart;
      });

      // Sparkle trail behind player when moving
      let sparkleTrails = [...prev.sparkleTrails];
      if (Math.abs(newPlayer.velocity.x) > 50 || Math.abs(newPlayer.velocity.y) > 50) {
        sparkleTrails.push({
          id: Date.now() + Math.random(),
          x: newPlayer.position.x + newPlayer.width / 2,
          y: newPlayer.position.y + newPlayer.height / 2,
          vx: (Math.random() - 0.5) * 30,
          vy: (Math.random() - 0.5) * 30,
          life: 0.6,
          maxLife: 0.6,
          size: 4 + Math.random() * 4,
          color: ['#ff6b9d', '#ffc2d1', '#ffb7c5', '#ff85a1'][Math.floor(Math.random() * 4)],
        });
      }
      sparkleTrails = sparkleTrails
        .map(p => ({ ...p, x: p.x + p.vx * deltaTime, y: p.y + p.vy * deltaTime, life: p.life - deltaTime * 2 }))
        .filter(p => p.life > 0);

      newParticles = updateParticles(newParticles, deltaTime);

      // Check level complete
      const levelComplete = newScore >= prev.totalHearts;
      const gameWon = levelComplete && prev.level >= TOTAL_LEVELS;

      if (levelComplete && !prev.levelComplete) {
        if (gameWon) {
          playWinSound();
        } else {
          playLevelCompleteSound();
        }
      }

      return {
        ...prev,
        player: newPlayer,
        hearts: newHearts,
        particles: newParticles,
        score: newScore,
        gameWon,
        levelComplete: levelComplete && !gameWon,
        screenShake,
        sparkleTrails,
      };
    });

    if (mobileKeys.up) {
      setMobileKeys(prev => ({ ...prev, up: false }));
    }
  }, [combinedKeys, mobileKeys.up]);

  useGameLoop(gameLoop, gameState.gameStarted && !gameState.gameWon && !gameState.levelComplete);

  const handleStart = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  const handleRestart = () => {
    setGameState(createInitialState(1));
  };

  const handleNextLevel = () => {
    const nextLevel = gameState.level + 1;
    const newState = createInitialState(nextLevel);
    newState.gameStarted = true;
    setGameState(newState);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-gradient p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-love-pink/20 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${30 + i * 10}px`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-[800px] aspect-[4/3]">
        <div className="absolute inset-0 flex items-center justify-center">
          <GameCanvas gameState={gameState} />
        </div>
        <GameUI
          score={gameState.score}
          totalHearts={gameState.totalHearts}
          gameStarted={gameState.gameStarted}
          gameWon={gameState.gameWon}
          levelComplete={gameState.levelComplete}
          level={gameState.level}
          totalLevels={TOTAL_LEVELS}
          onStart={handleStart}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
          girlfriendName={girlfriendName}
        />
      </div>

      <MobileControls
        onLeftStart={() => setMobileKeys(prev => ({ ...prev, left: true }))}
        onLeftEnd={() => setMobileKeys(prev => ({ ...prev, left: false }))}
        onRightStart={() => setMobileKeys(prev => ({ ...prev, right: true }))}
        onRightEnd={() => setMobileKeys(prev => ({ ...prev, right: false }))}
        onJump={() => setMobileKeys(prev => ({ ...prev, up: true }))}
        onBoostStart={() => setMobileKeys(prev => ({ ...prev, boost: true }))}
        onBoostEnd={() => setMobileKeys(prev => ({ ...prev, boost: false }))}
      />

      <p className="mt-4 text-sm text-foreground/60 text-center hidden md:block">
        Arrow Keys / WASD to move • Space / Up to jump • Hold Shift for boost jump 🚀
      </p>
    </div>
  );
};

export default ValentineGame;
