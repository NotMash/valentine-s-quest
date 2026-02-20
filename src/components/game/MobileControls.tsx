import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface MobileControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJump: () => void;
  onBoostStart: () => void;
  onBoostEnd: () => void;
  boostPercent: number;
  boostReady: boolean;
}

type PressedState = {
  left: boolean;
  right: boolean;
  boost: boolean;
};

const MobileControls: React.FC<MobileControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
  onBoostStart,
  onBoostEnd,
  boostPercent,
  boostReady,
}) => {
  const [pressed, setPressed] = useState<PressedState>({
    left: false,
    right: false,
    boost: false,
  });

  const vibrate = useCallback((duration: number) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(duration);
    }
  }, []);

  const setPressedState = useCallback((key: keyof PressedState, value: boolean) => {
    setPressed(prev => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }, []);

  const maybeHaptic = useCallback((e: React.PointerEvent, duration: number = 8) => {
    if (e.pointerType === 'touch') vibrate(duration);
  }, [vibrate]);

  const handleLeftStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    maybeHaptic(e);
    setPressedState('left', true);
    onLeftStart();
  }, [maybeHaptic, onLeftStart, setPressedState]);

  const handleLeftEnd = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setPressedState('left', false);
    onLeftEnd();
  }, [onLeftEnd, setPressedState]);

  const handleRightStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    maybeHaptic(e);
    setPressedState('right', true);
    onRightStart();
  }, [maybeHaptic, onRightStart, setPressedState]);

  const handleRightEnd = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setPressedState('right', false);
    onRightEnd();
  }, [onRightEnd, setPressedState]);

  const handleBoostStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    maybeHaptic(e, boostReady ? 10 : 6);
    if (!boostReady) return;
    setPressedState('boost', true);
    onBoostStart();
  }, [boostReady, maybeHaptic, onBoostStart, setPressedState]);

  const handleBoostEnd = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setPressedState('boost', false);
    onBoostEnd();
  }, [onBoostEnd, setPressedState]);

  return (
    <div className="w-full max-w-[800px] px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mobile-controls-panel rounded-3xl bg-white/70 backdrop-blur-md border border-white/70 shadow-xl px-3 py-3">
        <div className="mobile-controls-row flex items-center justify-between gap-2">
          {/* Left: D-pad */}
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label="Move left"
              onContextMenu={e => e.preventDefault()}
              onPointerDown={handleLeftStart}
              onPointerUp={handleLeftEnd}
              onPointerCancel={handleLeftEnd}
              onPointerLeave={handleLeftEnd}
              className={`mobile-control-btn mobile-control-dir w-16 h-16 bg-white/90 rounded-2xl shadow-md
                         flex items-center justify-center transition-transform
                         border-2 border-love-pink/35 ${
                           pressed.left ? 'mobile-control-active shadow-[0_0_18px_hsl(var(--love-pink)/0.35)]' : ''
                         }`}
            >
              <ArrowLeft className="w-8 h-8 text-love-pink" />
            </button>
            <button
              type="button"
              aria-label="Move right"
              onContextMenu={e => e.preventDefault()}
              onPointerDown={handleRightStart}
              onPointerUp={handleRightEnd}
              onPointerCancel={handleRightEnd}
              onPointerLeave={handleRightEnd}
              className={`mobile-control-btn mobile-control-dir w-16 h-16 bg-white/90 rounded-2xl shadow-md
                         flex items-center justify-center transition-transform
                         border-2 border-love-pink/35 ${
                           pressed.right ? 'mobile-control-active shadow-[0_0_18px_hsl(var(--love-pink)/0.35)]' : ''
                         }`}
            >
              <ArrowRight className="w-8 h-8 text-love-pink" />
            </button>
          </div>

          {/* Center: Tap hint */}
          <div className="flex flex-col items-center gap-0.5 opacity-60">
            <span className="text-[10px] font-semibold text-foreground/50 leading-tight">TAP SCREEN</span>
            <span className="text-[10px] text-foreground/40 leading-tight">TO JUMP</span>
          </div>

          {/* Right: Boost */}
          <div className="flex flex-col items-center gap-1">
            <span className="mobile-boost-label text-[10px] font-semibold text-foreground/65 leading-none">
              BOOST {Math.round(boostPercent)}%
            </span>
            <button
              type="button"
              aria-label="Hold boost then tap to boost jump"
              onContextMenu={e => e.preventDefault()}
              onPointerDown={handleBoostStart}
              onPointerUp={handleBoostEnd}
              onPointerCancel={handleBoostEnd}
              onPointerLeave={handleBoostEnd}
              className={`mobile-control-btn mobile-control-boost w-16 h-16 backdrop-blur-sm rounded-full shadow-md
                         flex items-center justify-center transition-all
                         border-2 ${boostReady
                           ? 'bg-love-coral/95 border-white/70'
                           : 'bg-muted-foreground/40 border-white/50'
                         } ${pressed.boost ? 'mobile-control-active shadow-[0_0_20px_hsl(var(--love-coral)/0.45)]' : ''}`}
            >
              <Zap className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
