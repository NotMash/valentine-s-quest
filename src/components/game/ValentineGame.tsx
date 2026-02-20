import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import MobileControls from './MobileControls';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboard } from '../../hooks/useKeyboard';
import { GameState, GAME_CONFIG } from '../../game/types';
import { createLevel, TOTAL_LEVELS } from '../../game/levels';
import { updatePlayer, checkHeartCollision, checkEnemyCollision, updateEnemies, createHeartParticles, createDamageParticles, updateParticles } from '../../game/physics';
import { playJumpSound, playBoostJumpSound, playLandSound, playCollectSound, playHitSound, playGameOverSound, playWinSound, playLevelCompleteSound, startLevelMusic, stopLevelMusic } from '../../game/sounds';

interface ValentineGameProps {
  girlfriendName?: string;
}

const createInitialState = (level: number = 1): GameState => {
  const { platforms, hearts, enemies, background, spawnPoint } = createLevel(level);
  return {
    player: {
      position: { ...spawnPoint },
      velocity: { x: 0, y: 0 },
      width: GAME_CONFIG.playerSize,
      height: GAME_CONFIG.playerSize,
      isGrounded: false,
      facingRight: true,
    },
    spawnPoint,
    platforms,
    hearts,
    enemies,
    particles: [],
    score: 0,
    totalHearts: hearts.length,
    collectedHearts: 0,
    gameWon: false,
    gameOver: false,
    gameStarted: false,
    level,
    levelComplete: false,
    screenShake: 0,
    sparkleTrails: [],
    boostEnergy: 100,
    boostMaxEnergy: 100,
    boostCooldown: false,
    playerHearts: 5,
    maxPlayerHearts: 5,
    invincibleTimer: 0,
    spawnImmune: true,
    background,
  };
};

const ValentineGame: React.FC<ValentineGameProps> = ({ girlfriendName }) => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(1));
  const keys = useKeyboard();
  const [mobileKeys, setMobileKeys] = useState({ left: false, right: false, up: false, boost: false });
  const combinedKeys = useMemo(() => ({
    left: keys.left || mobileKeys.left,
    right: keys.right || mobileKeys.right,
    up: keys.up || mobileKeys.up,
    boost: keys.boost || mobileKeys.boost,
  }), [
    keys.left, keys.right, keys.up, keys.boost,
    mobileKeys.left, mobileKeys.right, mobileKeys.up, mobileKeys.boost,
  ]);

  const gameLoop = useCallback((deltaTime: number) => {
    setGameState(prev => {
      if (!prev.gameStarted || prev.gameWon || prev.levelComplete || prev.gameOver) return prev;

      // Check if player has started moving — end spawn immunity
      const playerMoved = combinedKeys.left || combinedKeys.right || combinedKeys.up;
      const spawnImmune = prev.spawnImmune && !playerMoved;

      // Boost energy regenerates continuously and is consumed on boosted jump.
      let boostEnergy = Math.min(
        prev.boostMaxEnergy,
        prev.boostEnergy + GAME_CONFIG.boostRegenRate * deltaTime
      );

      // Update platforms (moving clouds)
      const cloudSpeedMultiplier = 1 + Math.max(0, prev.level - 1) * 0.2;
      const cloudRangeMultiplier = 1 + Math.max(0, prev.level - 1) * 0.15;

      const newPlatforms = prev.platforms.map(p => {
        if (p.moveSpeed && p.moveRange && p.originalX !== undefined) {
          const newX = p.originalX +
            Math.sin(Date.now() * 0.001 * p.moveSpeed * cloudSpeedMultiplier) *
            (p.moveRange * cloudRangeMultiplier);
          return { ...p, x: newX };
        }
        return p;
      });

      const {
        player: newPlayer,
        fellOff,
        boostUsed,
        jumped,
      } = updatePlayer(
        prev.player,
        combinedKeys,
        newPlatforms,
        deltaTime,
        boostEnergy,
        prev.boostMaxEnergy,
        prev.spawnPoint
      );

      if (boostUsed > 0) {
        boostEnergy = Math.max(0, boostEnergy - boostUsed);
      }

      const boostCooldown = boostEnergy <= 0.01;

      if (jumped) {
        if (boostUsed > 0) {
          playBoostJumpSound();
        } else {
          playJumpSound();
        }
      }

      // Landing sound
      if (newPlayer.isGrounded && !prev.player.isGrounded && prev.player.velocity.y > 100) {
        playLandSound();
      }

      const newEnemies = updateEnemies(prev.enemies, newPlatforms, deltaTime, newPlayer.position.x, newPlayer.position.y);

      // Check enemy collisions
      let playerHearts = prev.playerHearts;
      let invincibleTimer = Math.max(0, prev.invincibleTimer - deltaTime);
      let newParticles = [...prev.particles];
      let screenShake = Math.max(0, prev.screenShake - deltaTime * 10);

      if (fellOff && playerHearts > 0) {
        playerHearts = Math.max(0, playerHearts - 1);
        invincibleTimer = 1;
        screenShake = 6;
        playHitSound();
        newParticles = [
          ...newParticles,
          ...createDamageParticles(
            newPlayer.position.x + newPlayer.width / 2,
            newPlayer.position.y + newPlayer.height / 2
          ),
        ];
      }

      if (invincibleTimer <= 0 && !spawnImmune) {
        for (const enemy of newEnemies) {
          if (checkEnemyCollision(newPlayer, enemy)) {
            playerHearts = Math.max(0, playerHearts - 1);
            invincibleTimer = 1.5;
            screenShake = 5;
            playHitSound();
            newParticles = [...newParticles, ...createDamageParticles(
              newPlayer.position.x + newPlayer.width / 2,
              newPlayer.position.y + newPlayer.height / 2
            )];
            // Knock player back
            newPlayer.velocity.y = -300;
            newPlayer.velocity.x = newPlayer.position.x < enemy.x ? -200 : 200;
            break;
          }
        }
      }

      // Check heart collisions (collectible hearts)
      let newHearts = [...prev.hearts];
      let collectedHearts = prev.collectedHearts;

      newHearts = newHearts.map(heart => {
        if (!heart.collected && checkHeartCollision(newPlayer, heart)) {
          collectedHearts++;
          newParticles = [...newParticles, ...createHeartParticles(heart.x + heart.size / 2, heart.y + heart.size / 2)];
          screenShake = 3;
          playCollectSound();
          return { ...heart, collected: true, respawnTimer: undefined };
        }
        return heart;
      });

      // Respawn hearts that were lost (from enemy hits)
      // If player lost hearts, some collected hearts get "uncollected" after 5 seconds
      newHearts = newHearts.map(heart => {
        if (heart.collected && heart.respawnTimer !== undefined) {
          const newTimer = heart.respawnTimer - deltaTime;
          if (newTimer <= 0) {
            return { ...heart, collected: false, respawnTimer: undefined };
          }
          return { ...heart, respawnTimer: newTimer };
        }
        return heart;
      });

      // If player lost a heart from enemy, mark last collected heart for respawn
      if (playerHearts < prev.playerHearts) {
        const collectedHeartsArr = newHearts.filter(h => h.collected && h.respawnTimer === undefined);
        if (collectedHeartsArr.length > 0) {
          const lastCollected = collectedHeartsArr[collectedHeartsArr.length - 1];
          collectedHearts = Math.max(0, collectedHearts - 1);
          newHearts = newHearts.map(h => 
            h.id === lastCollected.id ? { ...h, respawnTimer: GAME_CONFIG.heartRespawnTime } : h
          );
        }
      }

      // Keep score synced with collectible hearts that are truly secured.
      collectedHearts = newHearts.filter(h => h.collected && h.respawnTimer === undefined).length;

      // Sparkle trail
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

      // Level complete when ALL hearts collected (none pending respawn)
      const allCollected = newHearts.every(h => h.collected);
      const levelComplete = allCollected && collectedHearts >= prev.totalHearts;
      const gameWon = levelComplete && prev.level >= TOTAL_LEVELS;
      const gameOver = playerHearts <= 0;

      if (levelComplete && !prev.levelComplete) {
        if (gameWon) {
          playWinSound();
        } else {
          playLevelCompleteSound();
        }
      }

      if (gameOver && !prev.gameOver) {
        playGameOverSound();
        stopLevelMusic();
      }

      return {
        ...prev,
        player: newPlayer,
        platforms: newPlatforms,
        hearts: newHearts,
        enemies: newEnemies,
        particles: newParticles,
        score: collectedHearts,
        collectedHearts,
        gameWon,
        gameOver,
        levelComplete: levelComplete && !gameWon,
        screenShake,
        sparkleTrails,
        boostEnergy,
        boostCooldown,
        playerHearts,
        invincibleTimer,
        spawnImmune,
      };
    });

    if (mobileKeys.up) {
      setMobileKeys(prev => ({ ...prev, up: false }));
    }
  }, [combinedKeys, mobileKeys.up]);

  useGameLoop(gameLoop, gameState.gameStarted && !gameState.gameWon && !gameState.levelComplete && !gameState.gameOver);

  const handleStart = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
    startLevelMusic(gameState.level);
  };

  const handleRestart = () => {
    if (gameState.gameOver) {
      const retryState = createInitialState(gameState.level);
      retryState.gameStarted = true;
      retryState.maxPlayerHearts = gameState.maxPlayerHearts;
      retryState.playerHearts = gameState.maxPlayerHearts;
      setGameState(retryState);
      startLevelMusic(gameState.level);
      return;
    }
    stopLevelMusic();
    setGameState(createInitialState(1));
  };

  const handleNextLevel = () => {
    const nextLevel = gameState.level + 1;
    const newState = createInitialState(nextLevel);
    const levelRewardHearts = 2;
    newState.gameStarted = true;
    newState.maxPlayerHearts = Math.min(15, gameState.maxPlayerHearts + levelRewardHearts);
    newState.playerHearts = Math.min(
      newState.maxPlayerHearts,
      gameState.playerHearts + levelRewardHearts
    );
    setGameState(newState);
    startLevelMusic(nextLevel);
  };

  // Cleanup music on unmount
  useEffect(() => {
    return () => stopLevelMusic();
  }, []);

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
    <div className="game-shell flex flex-col items-center justify-between md:justify-center min-h-[100dvh] bg-sky-gradient px-2 py-3 md:p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="atmo-blob atmo-blob-1" />
        <div className="atmo-blob atmo-blob-2" />
        <div className="atmo-blob atmo-blob-3" />
        {[...Array(12)].map((_, i) => (
          <span
            key={`spark-${i}`}
            className="twinkle-dot absolute rounded-full bg-white/50"
            style={{
              left: `${8 + i * 7.6}%`,
              top: `${12 + (i % 5) * 14}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
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

      <div
        className="relative w-full max-w-[800px] aspect-[4/3] rounded-2xl overflow-hidden mobile-stage stage-cinematic"
        onTouchStart={(e) => {
          // Tap-to-jump on the game canvas (mobile only, when game is active)
          if (!gameState.gameStarted || gameState.gameWon || gameState.gameOver || gameState.levelComplete) return;
          // Don't trigger jump if tapping UI buttons
          const target = e.target as HTMLElement;
          if (target.closest('button')) return;
          e.preventDefault();
          if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            navigator.vibrate(10);
          }
          setMobileKeys(prev => ({ ...prev, up: true }));
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <GameCanvas gameState={gameState} />
        </div>
        <GameUI
          score={gameState.collectedHearts}
          totalHearts={gameState.totalHearts}
          gameStarted={gameState.gameStarted}
          gameWon={gameState.gameWon}
          gameOver={gameState.gameOver}
          levelComplete={gameState.levelComplete}
          level={gameState.level}
          totalLevels={TOTAL_LEVELS}
          onStart={handleStart}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
          girlfriendName={girlfriendName}
          boostEnergy={gameState.boostEnergy}
          boostMaxEnergy={gameState.boostMaxEnergy}
          boostCooldown={gameState.boostCooldown}
          playerHearts={gameState.playerHearts}
          maxPlayerHearts={gameState.maxPlayerHearts}
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
        boostPercent={(gameState.boostEnergy / gameState.boostMaxEnergy) * 100}
        boostReady={gameState.boostEnergy > 0}
      />

      <p className="mt-4 text-sm text-foreground/60 text-center hidden md:block">
        Arrow Keys / WASD to move • Space / Up to jump • Hold Shift + Jump to use available boost energy 🚀 • Build momentum for higher jumps!
      </p>
    </div>
  );
};

export default ValentineGame;
