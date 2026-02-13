import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Zap } from 'lucide-react';

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
  jump: boolean;
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
  const boostLabel = `${Math.round(boostPercent)}%`;
  const jumpReleaseTimeoutRef = useRef<number | undefined>(undefined);
  const [pressed, setPressed] = useState<PressedState>({
    left: false,
    right: false,
    boost: false,
    jump: false,
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
    if (e.pointerType === 'touch') {
      vibrate(duration);
    }
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
    if (!boostReady) {
      return;
    }
    setPressedState('boost', true);
    onBoostStart();
  }, [boostReady, maybeHaptic, onBoostStart, setPressedState]);

  const handleBoostEnd = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setPressedState('boost', false);
    onBoostEnd();
  }, [onBoostEnd, setPressedState]);

  const handleJumpStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    maybeHaptic(e, 12);
    setPressedState('jump', true);
    onJump();
    if (jumpReleaseTimeoutRef.current !== undefined) {
      window.clearTimeout(jumpReleaseTimeoutRef.current);
    }
    jumpReleaseTimeoutRef.current = window.setTimeout(() => {
      setPressedState('jump', false);
    }, 120);
  }, [maybeHaptic, onJump, setPressedState]);

  const handleJumpEnd = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setPressedState('jump', false);
  }, [setPressedState]);

  useEffect(() => {
    return () => {
      if (jumpReleaseTimeoutRef.current !== undefined) {
        window.clearTimeout(jumpReleaseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-[800px] px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mobile-controls-panel rounded-3xl bg-white/70 backdrop-blur-md border border-white/70 shadow-xl px-3 py-3">
        <div className="mobile-controls-row flex items-end justify-between gap-2">
          {/* Left/Right controls */}
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Move left"
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={handleLeftStart}
              onPointerUp={handleLeftEnd}
              onPointerCancel={handleLeftEnd}
              onPointerLeave={handleLeftEnd}
              className={`mobile-control-btn mobile-control-dir w-14 h-14 bg-white/90 rounded-2xl shadow-md
                         flex items-center justify-center active:scale-95 transition-transform
                         border-2 border-love-pink/35 ${
                           pressed.left ? 'mobile-control-active shadow-[0_0_18px_hsl(var(--love-pink)/0.35)]' : ''
                         }`}
            >
              <ArrowLeft className="w-7 h-7 text-love-pink" />
            </button>
            <button
              type="button"
              aria-label="Move right"
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={handleRightStart}
              onPointerUp={handleRightEnd}
              onPointerCancel={handleRightEnd}
              onPointerLeave={handleRightEnd}
              className={`mobile-control-btn mobile-control-dir w-14 h-14 bg-white/90 rounded-2xl shadow-md
                         flex items-center justify-center active:scale-95 transition-transform
                         border-2 border-love-pink/35 ${
                           pressed.right ? 'mobile-control-active shadow-[0_0_18px_hsl(var(--love-pink)/0.35)]' : ''
                         }`}
            >
              <ArrowRight className="w-7 h-7 text-love-pink" />
            </button>
          </div>

          {/* Boost + Jump */}
          <div className="flex items-end gap-2">
            <div className="flex flex-col items-center gap-1">
              <span className="mobile-boost-label text-[10px] font-semibold text-foreground/65 leading-none">BOOST {boostLabel}</span>
              <button
                type="button"
                aria-label="Hold boost"
                onContextMenu={(e) => e.preventDefault()}
                onPointerDown={handleBoostStart}
                onPointerUp={handleBoostEnd}
                onPointerCancel={handleBoostEnd}
                onPointerLeave={handleBoostEnd}
                className={`mobile-control-btn mobile-control-boost w-14 h-14 backdrop-blur-sm rounded-full shadow-md
                           flex items-center justify-center active:scale-95 transition-all
                           border-2 ${boostReady
                             ? 'bg-love-coral/95 border-white/70'
                             : 'bg-muted-foreground/40 border-white/50'
                           } ${pressed.boost ? 'mobile-control-active shadow-[0_0_20px_hsl(var(--love-coral)/0.45)]' : ''}`}
              >
                <Zap className="w-6 h-6 text-white" />
              </button>
            </div>

            <button
              type="button"
              aria-label="Jump"
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={handleJumpStart}
              onPointerUp={handleJumpEnd}
              onPointerCancel={handleJumpEnd}
              onPointerLeave={handleJumpEnd}
              className={`mobile-control-btn mobile-control-jump w-20 h-20 bg-love-pink/95 backdrop-blur-sm rounded-full shadow-lg
                         flex items-center justify-center active:scale-95 transition-transform
                         border-4 border-white/60 ${
                           pressed.jump ? 'mobile-control-active shadow-[0_0_24px_hsl(var(--love-pink)/0.5)]' : ''
                         }`}
            >
              <ArrowUp className="w-10 h-10 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
