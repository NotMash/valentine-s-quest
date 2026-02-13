import React from 'react';
import { Heart, Zap, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameUIProps {
  score: number;
  totalHearts: number;
  gameStarted: boolean;
  gameWon: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  level: number;
  totalLevels: number;
  onStart: () => void;
  onRestart: () => void;
  onNextLevel: () => void;
  girlfriendName?: string;
  boostEnergy: number;
  boostMaxEnergy: number;
  boostCooldown: boolean;
  playerHearts: number;
  maxPlayerHearts: number;
}

const GameUI: React.FC<GameUIProps> = ({
  score,
  totalHearts,
  gameStarted,
  gameWon,
  gameOver,
  levelComplete,
  level,
  totalLevels,
  onStart,
  onRestart,
  onNextLevel,
  girlfriendName = "My Love",
  boostEnergy,
  boostMaxEnergy,
  boostCooldown,
  playerHearts,
  maxPlayerHearts,
}) => {
  if (!gameStarted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-love-pink/20 to-love-coral/20 rounded-2xl backdrop-blur-sm">
        <div className="text-center p-6 animate-fade-in max-w-md">
          <div className="flex justify-center gap-2 mb-3">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="w-7 h-7 text-love-pink fill-love-pink animate-pulse-heart"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-love-pink mb-1">
            Love's Journey
          </h1>
          <p className="text-base text-foreground/70 mb-4">
            A Valentine's Adventure for {girlfriendName} 💕
          </p>
          
          {/* Controls section */}
          <div className="bg-white/70 rounded-xl p-4 mb-4 text-left shadow-sm">
            <h3 className="font-semibold text-foreground text-sm mb-2 text-center">🎮 Controls</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">←</span>
                  <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">→</span>
                </div>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">WASD</span>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">Space</span>
                <span>Jump</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">Shift</span>
                <span>Boost Jump 🚀</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/50 text-[10px] text-foreground/60 text-center">
              💡 Move fast to build momentum for higher jumps! • Avoid enemies! 👾
            </div>
          </div>

          <button
            onClick={onStart}
            className="px-8 py-3 bg-love-pink text-white rounded-full font-semibold text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                       hover:bg-love-coral"
          >
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-red-900/40 to-red-600/40 rounded-2xl backdrop-blur-sm">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="w-8 h-8 text-muted-foreground/30"
              />
            ))}
          </div>
          <h1 className="text-4xl font-bold text-red-400 mb-2">
            Game Over 💔
          </h1>
          <p className="text-lg text-foreground/70 mb-6">
            Don't give up! Shahina believes in you!
          </p>
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-love-pink text-white rounded-full font-semibold text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                       hover:bg-love-coral"
          >
            Try Again from Level 1
          </button>
        </div>
      </div>
    );
  }

  if (levelComplete) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-love-pink/20 to-love-coral/20 rounded-2xl backdrop-blur-sm">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="w-8 h-8 text-love-pink fill-love-pink animate-float"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-love-pink mb-2">
            Level {level} Complete! ✨
          </h1>
          <p className="text-lg text-foreground/70 mb-6">
            Amazing! Ready for the next adventure?
          </p>
          <button
            onClick={onNextLevel}
            className="px-8 py-4 bg-love-pink text-white rounded-full font-semibold text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                       hover:bg-love-coral"
          >
            Next Level →
          </button>
        </div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-love-pink/30 to-love-coral/30 rounded-2xl backdrop-blur-sm">
        <div className="text-center p-8 animate-scale-in">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="w-10 h-10 text-love-pink fill-love-pink animate-float"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <h1 className="text-4xl font-bold text-love-pink mb-4">
            You Did It! 🎉
          </h1>
          <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg max-w-md">
            <p className="text-xl text-foreground leading-relaxed">
              Dear {girlfriendName},
            </p>
            <p className="text-lg text-foreground/80 mt-3 leading-relaxed">
              Just like collecting all these hearts, you've captured mine completely. 
              Every moment with you is an adventure I treasure.
            </p>
            <p className="text-xl text-love-pink font-semibold mt-4">
              Happy Valentine's Day! 💖
            </p>
          </div>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-love-coral text-white rounded-full font-semibold
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // In-game HUD
  const boostPercent = (boostEnergy / boostMaxEnergy) * 100;

  return (
    <>
      {/* Top-left: Level + Hearts collected */}
      <div className="absolute top-4 left-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
        <span className="text-sm font-semibold text-foreground/60">Lv.{level}</span>
        <Heart className="w-5 h-5 text-love-pink fill-love-pink animate-pulse-heart" />
        <span className="font-semibold text-foreground text-sm">
          {score} / {totalHearts}
        </span>
      </div>

      {/* Top-right: Player health */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md">
        {[...Array(maxPlayerHearts)].map((_, i) => (
          <Heart
            key={i}
            className={`w-4 h-4 ${i < playerHearts ? 'text-love-pink fill-love-pink' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>

      {/* Bottom-left: Boost bar */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-md">
        <Zap className={`w-4 h-4 ${boostCooldown ? 'text-muted-foreground/40' : 'text-love-coral'}`} />
        <div className="w-20 h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              boostCooldown ? 'bg-muted-foreground/30' : 'bg-love-coral'
            }`}
            style={{ width: `${boostPercent}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default GameUI;
