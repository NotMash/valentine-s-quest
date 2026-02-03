import React from 'react';
import { Heart } from 'lucide-react';

interface GameUIProps {
  score: number;
  totalHearts: number;
  gameStarted: boolean;
  gameWon: boolean;
  onStart: () => void;
  onRestart: () => void;
  girlfriendName?: string;
}

const GameUI: React.FC<GameUIProps> = ({
  score,
  totalHearts,
  gameStarted,
  gameWon,
  onStart,
  onRestart,
  girlfriendName = "My Love",
}) => {
  if (!gameStarted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-love-pink/20 to-love-coral/20 rounded-2xl backdrop-blur-sm">
        <div className="text-center p-8 animate-fade-in">
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="w-8 h-8 text-love-pink fill-love-pink animate-pulse-heart"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <h1 className="text-4xl font-bold text-love-pink mb-2">
            Love's Journey
          </h1>
          <p className="text-lg text-foreground/70 mb-6">
            A Valentine's Adventure for {girlfriendName} 💕
          </p>
          <button
            onClick={onStart}
            className="px-8 py-4 bg-love-pink text-white rounded-full font-semibold text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                       hover:bg-love-coral"
          >
            Start Playing
          </button>
          <p className="mt-6 text-sm text-muted-foreground">
            Use Arrow Keys or WASD to move • Space to jump
          </p>
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

  return (
    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
      <Heart className="w-6 h-6 text-love-pink fill-love-pink animate-pulse-heart" />
      <span className="font-semibold text-foreground">
        {score} / {totalHearts}
      </span>
    </div>
  );
};

export default GameUI;
