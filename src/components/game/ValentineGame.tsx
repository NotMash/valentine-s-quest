import React, { useState, useCallback, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import MobileControls from './MobileControls';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboard } from '../../hooks/useKeyboard';
import { GameState, GAME_CONFIG } from '../../game/types';
import { createLevel } from '../../game/levels';
import { updatePlayer, checkHeartCollision, createHeartParticles, updateParticles } from '../../game/physics';

interface ValentineGameProps {
  girlfriendName?: string;
}

const createInitialState = (): GameState => {
  const { platforms, hearts } = createLevel();
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
  };
};

const ValentineGame: React.FC<ValentineGameProps> = ({ girlfriendName }) => {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const keys = useKeyboard();
  const [mobileKeys, setMobileKeys] = useState({ left: false, right: false, up: false });

  const combinedKeys = {
    left: keys.left || mobileKeys.left,
    right: keys.right || mobileKeys.right,
    up: keys.up || mobileKeys.up,
  };

  const gameLoop = useCallback((deltaTime: number) => {
    setGameState(prev => {
      if (!prev.gameStarted || prev.gameWon) return prev;

      // Update player
      const newPlayer = updatePlayer(prev.player, combinedKeys, prev.platforms, deltaTime);

      // Check heart collisions
      let newHearts = [...prev.hearts];
      let newScore = prev.score;
      let newParticles = [...prev.particles];

      newHearts = newHearts.map(heart => {
        if (!heart.collected && checkHeartCollision(newPlayer, heart)) {
          newScore++;
          newParticles = [...newParticles, ...createHeartParticles(heart.x + heart.size / 2, heart.y + heart.size / 2)];
          return { ...heart, collected: true };
        }
        return heart;
      });

      // Update particles
      newParticles = updateParticles(newParticles, deltaTime);

      // Check win condition
      const gameWon = newScore >= prev.totalHearts;

      return {
        ...prev,
        player: newPlayer,
        hearts: newHearts,
        particles: newParticles,
        score: newScore,
        gameWon,
      };
    });

    // Reset mobile up key after jump is registered
    if (mobileKeys.up) {
      setMobileKeys(prev => ({ ...prev, up: false }));
    }
  }, [combinedKeys, mobileKeys.up]);

  useGameLoop(gameLoop, gameState.gameStarted && !gameState.gameWon);

  const handleStart = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  const handleRestart = () => {
    setGameState(createInitialState());
  };

  // Prevent scrolling when using arrow keys
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
      {/* Decorative hearts in background */}
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
          onStart={handleStart}
          onRestart={handleRestart}
          girlfriendName={girlfriendName}
        />
      </div>

      <MobileControls
        onLeftStart={() => setMobileKeys(prev => ({ ...prev, left: true }))}
        onLeftEnd={() => setMobileKeys(prev => ({ ...prev, left: false }))}
        onRightStart={() => setMobileKeys(prev => ({ ...prev, right: true }))}
        onRightEnd={() => setMobileKeys(prev => ({ ...prev, right: false }))}
        onJump={() => setMobileKeys(prev => ({ ...prev, up: true }))}
      />

      <p className="mt-4 text-sm text-foreground/60 text-center hidden md:block">
        Arrow Keys / WASD to move • Space / Up to jump
      </p>
    </div>
  );
};

export default ValentineGame;
