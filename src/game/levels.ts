import { Platform, Heart } from './types';

export const createLevel = (): { platforms: Platform[]; hearts: Heart[] } => {
  const platforms: Platform[] = [
    // Ground
    { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
    
    // Floating cloud platforms
    { x: 50, y: 450, width: 120, height: 30, type: 'cloud' },
    { x: 250, y: 380, width: 100, height: 30, type: 'cloud' },
    { x: 450, y: 320, width: 120, height: 30, type: 'cloud' },
    { x: 620, y: 400, width: 130, height: 30, type: 'cloud' },
    
    // Higher platforms
    { x: 100, y: 250, width: 100, height: 30, type: 'cloud' },
    { x: 300, y: 200, width: 150, height: 30, type: 'cloud' },
    { x: 550, y: 180, width: 120, height: 30, type: 'cloud' },
    
    // Top platforms
    { x: 200, y: 100, width: 100, height: 30, type: 'cloud' },
    { x: 400, y: 80, width: 140, height: 30, type: 'cloud' },
  ];

  const hearts: Heart[] = [
    { id: 1, x: 110, y: 420, collected: false, size: 25 },
    { id: 2, x: 300, y: 350, collected: false, size: 25 },
    { id: 3, x: 510, y: 290, collected: false, size: 25 },
    { id: 4, x: 685, y: 370, collected: false, size: 25 },
    { id: 5, x: 150, y: 220, collected: false, size: 25 },
    { id: 6, x: 375, y: 170, collected: false, size: 25 },
    { id: 7, x: 610, y: 150, collected: false, size: 25 },
    { id: 8, x: 250, y: 70, collected: false, size: 25 },
    { id: 9, x: 470, y: 50, collected: false, size: 30 }, // Special big heart
  ];

  return { platforms, hearts };
};
