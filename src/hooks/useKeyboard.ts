import { useState, useEffect } from 'react';

export interface KeyState {
  left: boolean;
  right: boolean;
  up: boolean;
}

export const useKeyboard = () => {
  const [keys, setKeys] = useState<KeyState>({
    left: false,
    right: false,
    up: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          setKeys(prev => ({ ...prev, up: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          setKeys(prev => ({ ...prev, up: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};
