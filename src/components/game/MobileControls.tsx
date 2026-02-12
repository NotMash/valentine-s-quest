import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Zap } from 'lucide-react';

interface MobileControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJump: () => void;
  onBoostStart: () => void;
  onBoostEnd: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
  onBoostStart,
  onBoostEnd,
}) => {
  return (
    <div className="flex justify-between items-end w-full max-w-[800px] mt-4 px-4 md:hidden">
      {/* Left/Right controls */}
      <div className="flex gap-2">
        <button
          onTouchStart={onLeftStart}
          onTouchEnd={onLeftEnd}
          onMouseDown={onLeftStart}
          onMouseUp={onLeftEnd}
          onMouseLeave={onLeftEnd}
          className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg 
                     flex items-center justify-center active:scale-95 transition-transform
                     border-2 border-love-pink/30"
        >
          <ArrowLeft className="w-8 h-8 text-love-pink" />
        </button>
        <button
          onTouchStart={onRightStart}
          onTouchEnd={onRightEnd}
          onMouseDown={onRightStart}
          onMouseUp={onRightEnd}
          onMouseLeave={onRightEnd}
          className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg 
                     flex items-center justify-center active:scale-95 transition-transform
                     border-2 border-love-pink/30"
        >
          <ArrowRight className="w-8 h-8 text-love-pink" />
        </button>
      </div>

      {/* Boost + Jump */}
      <div className="flex gap-2 items-center">
        <button
          onTouchStart={onBoostStart}
          onTouchEnd={onBoostEnd}
          onMouseDown={onBoostStart}
          onMouseUp={onBoostEnd}
          onMouseLeave={onBoostEnd}
          className="w-14 h-14 bg-love-coral/90 backdrop-blur-sm rounded-full shadow-lg 
                     flex items-center justify-center active:scale-95 transition-transform
                     border-3 border-white/50"
        >
          <Zap className="w-7 h-7 text-white" />
        </button>
        <button
          onTouchStart={onJump}
          onMouseDown={onJump}
          className="w-20 h-20 bg-love-pink/90 backdrop-blur-sm rounded-full shadow-lg 
                     flex items-center justify-center active:scale-95 transition-transform
                     border-4 border-white/50"
        >
          <ArrowUp className="w-10 h-10 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
