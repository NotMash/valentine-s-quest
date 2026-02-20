import { Platform, Heart, Enemy, LevelBackground, Position } from './types';

export interface LevelData {
  platforms: Platform[];
  hearts: Heart[];
  enemies: Enemy[];
  spawnPoint: Position;
  name: string;
  background: LevelBackground;
}

export const TOTAL_LEVELS = 5;

export const createLevel = (level: number = 1): LevelData => {
  switch (level) {
    case 1: return createLevel1();
    case 2: return createLevel2();
    case 3: return createLevel3();
    case 4: return createLevel4();
    case 5: return createLevel5();
    default: return createLevel1();
  }
};

const createLevel1 = (): LevelData => ({
  name: "Garden of Hearts",
  background: { skyTop: '#b8e0ff', skyBottom: '#ffd6e7', name: 'garden' },
  spawnPoint: { x: 80, y: 510 },
  enemies: [],
  platforms: [
    { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
    { x: 50, y: 450, width: 130, height: 30, type: 'cloud' },
    { x: 250, y: 380, width: 120, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 30, originalX: 250 },
    { x: 450, y: 320, width: 130, height: 30, type: 'cloud' },
    { x: 620, y: 400, width: 140, height: 30, type: 'cloud', moveSpeed: 0.4, moveRange: 25, originalX: 620 },
    { x: 100, y: 250, width: 120, height: 30, type: 'cloud' },
    { x: 300, y: 200, width: 160, height: 30, type: 'cloud' },
    { x: 550, y: 180, width: 130, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 35, originalX: 550 },
    { x: 200, y: 100, width: 120, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 110, y: 415, collected: false, size: 25 },
    { id: 2, x: 300, y: 345, collected: false, size: 25 },
    { id: 3, x: 510, y: 285, collected: false, size: 25 },
    { id: 4, x: 685, y: 365, collected: false, size: 25 },
    { id: 5, x: 150, y: 215, collected: false, size: 25 },
    { id: 6, x: 375, y: 165, collected: false, size: 25 },
    { id: 7, x: 610, y: 145, collected: false, size: 25 },
    { id: 8, x: 250, y: 65, collected: false, size: 30 },
  ],
});

const createLevel2 = (): LevelData => ({
  name: "Skyward Serenade",
  background: { skyTop: '#ffecd2', skyBottom: '#fcb69f', name: 'sunset' },
  spawnPoint: { x: 80, y: 510 },
  enemies: [
    { id: 1, x: 55, y: 210, width: 30, height: 30, vx: 35, vy: 0, minX: 40, maxX: 130, type: 'patrol' },
    { id: 2, x: 620, y: 220, width: 30, height: 30, vx: -38, vy: 0, minX: 590, maxX: 710, type: 'patrol' },
    { id: 3, x: 600, y: 520, width: 30, height: 30, vx: -48, vy: 0, minX: 500, maxX: 780, type: 'chaser', chaseSpeed: 105 },
  ],
  platforms: [
    { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
    { x: 40, y: 240, width: 90, height: 24, type: 'cloud' },
    { x: 360, y: 500, width: 100, height: 24, type: 'cloud' },
    { x: 100, y: 470, width: 110, height: 30, type: 'cloud' },
    { x: 280, y: 400, width: 120, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 30, originalX: 280 },
    { x: 450, y: 340, width: 110, height: 30, type: 'cloud' },
    { x: 620, y: 370, width: 130, height: 30, type: 'cloud' },
    { x: 30, y: 320, width: 120, height: 30, type: 'cloud' },
    { x: 200, y: 260, width: 110, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 25, originalX: 200 },
    { x: 400, y: 200, width: 130, height: 30, type: 'cloud' },
    { x: 590, y: 250, width: 120, height: 24, type: 'cloud' },
    { x: 580, y: 160, width: 120, height: 30, type: 'cloud', moveSpeed: 0.4, moveRange: 35, originalX: 580 },
    { x: 350, y: 100, width: 140, height: 30, type: 'cloud' },
    { x: 100, y: 80, width: 130, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 140, y: 435, collected: false, size: 25 },
    { id: 2, x: 330, y: 365, collected: false, size: 25 },
    { id: 3, x: 500, y: 305, collected: false, size: 25 },
    { id: 4, x: 680, y: 335, collected: false, size: 25 },
    { id: 5, x: 80, y: 285, collected: false, size: 25 },
    { id: 6, x: 250, y: 225, collected: false, size: 25 },
    { id: 7, x: 455, y: 165, collected: false, size: 25 },
    { id: 8, x: 635, y: 125, collected: false, size: 25 },
    { id: 9, x: 410, y: 65, collected: false, size: 25 },
    { id: 10, x: 155, y: 45, collected: false, size: 30 },
  ],
});

const createLevel3 = (): LevelData => ({
  name: "Twilight Garden",
  background: { skyTop: '#a18cd1', skyBottom: '#fbc2eb', name: 'twilight' },
  spawnPoint: { x: 170, y: 420 },
  enemies: [
    { id: 1, x: 55, y: 230, width: 30, height: 30, vx: 34, vy: 0, minX: 35, maxX: 130, type: 'patrol' },
    { id: 2, x: 460, y: 400, width: 30, height: 30, vx: -36, vy: 0, minX: 430, maxX: 540, type: 'chaser', chaseSpeed: 110 },
    { id: 3, x: 670, y: 520, width: 30, height: 30, vx: -42, vy: 0, minX: 560, maxX: 780, type: 'patrol' },
  ],
  platforms: [
    { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
    { x: 35, y: 260, width: 95, height: 24, type: 'cloud' },
    { x: 150, y: 460, width: 110, height: 30, type: 'cloud' },
    { x: 420, y: 430, width: 120, height: 24, type: 'cloud' },
    { x: 550, y: 470, width: 110, height: 30, type: 'cloud' },
    { x: 350, y: 400, width: 120, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 30, originalX: 350 },
    { x: 50, y: 350, width: 100, height: 30, type: 'cloud' },
    { x: 680, y: 340, width: 100, height: 30, type: 'cloud' },
    { x: 640, y: 260, width: 100, height: 24, type: 'cloud' },
    { x: 250, y: 290, width: 120, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 35, originalX: 250 },
    { x: 500, y: 260, width: 110, height: 30, type: 'cloud' },
    { x: 100, y: 210, width: 110, height: 30, type: 'cloud' },
    { x: 380, y: 170, width: 130, height: 30, type: 'cloud', moveSpeed: 0.4, moveRange: 25, originalX: 380 },
    { x: 620, y: 140, width: 110, height: 30, type: 'cloud' },
    { x: 300, y: 70, width: 200, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 190, y: 425, collected: false, size: 25 },
    { id: 2, x: 595, y: 435, collected: false, size: 25 },
    { id: 3, x: 400, y: 365, collected: false, size: 25 },
    { id: 4, x: 90, y: 315, collected: false, size: 25 },
    { id: 5, x: 720, y: 305, collected: false, size: 25 },
    { id: 6, x: 300, y: 255, collected: false, size: 25 },
    { id: 7, x: 545, y: 225, collected: false, size: 25 },
    { id: 8, x: 145, y: 175, collected: false, size: 25 },
    { id: 9, x: 435, y: 135, collected: false, size: 25 },
    { id: 10, x: 665, y: 105, collected: false, size: 25 },
    { id: 11, x: 390, y: 35, collected: false, size: 30 },
  ],
});

const createLevel4 = (): LevelData => ({
  name: "Starlight Chase",
  background: { skyTop: '#0c1445', skyBottom: '#3a1c71', name: 'night' },
  spawnPoint: { x: 70, y: 510 },
  enemies: [
    { id: 1, x: 140, y: 220, width: 30, height: 30, vx: 34, vy: 0, minX: 130, maxX: 220, type: 'patrol' },
    { id: 2, x: 525, y: 340, width: 30, height: 30, vx: -38, vy: 0, minX: 500, maxX: 590, type: 'patrol' },
    { id: 3, x: 635, y: 115, width: 25, height: 25, vx: -32, vy: 0, minX: 610, maxX: 700, type: 'patrol' },
    { id: 4, x: 700, y: 520, width: 30, height: 30, vx: -48, vy: 0, minX: 540, maxX: 780, type: 'chaser', chaseSpeed: 115 },
  ],
  platforms: [
    { x: 0, y: 550, width: 350, height: 50, type: 'ground' },
    { x: 450, y: 550, width: 350, height: 50, type: 'ground' },
    { x: 130, y: 250, width: 90, height: 24, type: 'cloud' },
    { x: 100, y: 460, width: 100, height: 30, type: 'cloud', moveSpeed: 0.55, moveRange: 22, originalX: 100 },
    { x: 360, y: 330, width: 110, height: 24, type: 'cloud' },
    { x: 300, y: 420, width: 110, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 30, originalX: 300 },
    { x: 520, y: 450, width: 100, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 20, originalX: 520 },
    { x: 680, y: 380, width: 100, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 25, originalX: 680 },
    { x: 20, y: 340, width: 100, height: 30, type: 'cloud' },
    { x: 200, y: 290, width: 130, height: 30, type: 'cloud', moveSpeed: 0.65, moveRange: 24, originalX: 200 },
    { x: 450, y: 280, width: 100, height: 30, type: 'cloud', moveSpeed: 0.4, moveRange: 35, originalX: 450 },
    { x: 500, y: 370, width: 90, height: 24, type: 'cloud' },
    { x: 620, y: 220, width: 110, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 26, originalX: 620 },
    { x: 610, y: 140, width: 90, height: 24, type: 'cloud' },
    { x: 100, y: 190, width: 110, height: 30, type: 'cloud', moveSpeed: 0.7, moveRange: 30, originalX: 100 },
    { x: 350, y: 150, width: 120, height: 30, type: 'cloud', moveSpeed: 0.7, moveRange: 28, originalX: 350 },
    { x: 550, y: 90, width: 100, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 40, originalX: 550 },
    { x: 250, y: 60, width: 120, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 140, y: 425, collected: false, size: 25 },
    { id: 2, x: 345, y: 385, collected: false, size: 25 },
    { id: 3, x: 560, y: 415, collected: false, size: 25 },
    { id: 4, x: 720, y: 345, collected: false, size: 25 },
    { id: 5, x: 60, y: 305, collected: false, size: 25 },
    { id: 6, x: 255, y: 255, collected: false, size: 25 },
    { id: 7, x: 490, y: 245, collected: false, size: 25 },
    { id: 8, x: 665, y: 185, collected: false, size: 25 },
    { id: 9, x: 145, y: 155, collected: false, size: 25 },
    { id: 10, x: 400, y: 115, collected: false, size: 25 },
    { id: 11, x: 590, y: 55, collected: false, size: 25 },
    { id: 12, x: 300, y: 25, collected: false, size: 30 },
  ],
});

const createLevel5 = (): LevelData => ({
  name: "Love's Summit",
  background: { skyTop: '#ff9a9e', skyBottom: '#fecfef', name: 'love' },
  spawnPoint: { x: 270, y: 400 },
  enemies: [
    { id: 1, x: 245, y: 520, width: 30, height: 30, vx: 48, vy: 0, minX: 170, maxX: 350, type: 'chaser', chaseSpeed: 120 },
    { id: 2, x: 560, y: 520, width: 30, height: 30, vx: -42, vy: 0, minX: 500, maxX: 700, type: 'patrol' },
    { id: 3, x: 435, y: 295, width: 25, height: 25, vx: -34, vy: 0, minX: 410, maxX: 510, type: 'patrol' },
    { id: 4, x: 645, y: 145, width: 25, height: 25, vx: -30, vy: 0, minX: 620, maxX: 710, type: 'patrol' },
    { id: 5, x: 290, y: 305, width: 25, height: 25, vx: 32, vy: 0, minX: 260, maxX: 350, type: 'patrol' },
  ],
  platforms: [
    { x: 150, y: 550, width: 200, height: 50, type: 'ground' },
    { x: 500, y: 550, width: 200, height: 50, type: 'ground' },
    { x: 410, y: 320, width: 100, height: 24, type: 'cloud' },
    { x: 620, y: 170, width: 90, height: 24, type: 'cloud' },
    { x: 260, y: 330, width: 90, height: 24, type: 'cloud' },
    { x: 50, y: 470, width: 100, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 24, originalX: 50 },
    { x: 250, y: 440, width: 100, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 30, originalX: 250 },
    { x: 450, y: 460, width: 100, height: 30, type: 'cloud', moveSpeed: 0.65, moveRange: 24, originalX: 450 },
    { x: 650, y: 430, width: 100, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 25, originalX: 650 },
    { x: 100, y: 370, width: 100, height: 30, type: 'cloud', moveSpeed: 0.7, moveRange: 24, originalX: 100 },
    { x: 350, y: 380, width: 110, height: 30, type: 'cloud', moveSpeed: 0.4, moveRange: 35, originalX: 350 },
    { x: 560, y: 350, width: 100, height: 30, type: 'cloud', moveSpeed: 0.75, moveRange: 26, originalX: 560 },
    { x: 30, y: 290, width: 100, height: 30, type: 'cloud', moveSpeed: 0.72, moveRange: 25, originalX: 30 },
    { x: 220, y: 270, width: 110, height: 30, type: 'cloud', moveSpeed: 0.7, moveRange: 30, originalX: 220 },
    { x: 450, y: 250, width: 100, height: 30, type: 'cloud', moveSpeed: 0.75, moveRange: 27, originalX: 450 },
    { x: 650, y: 230, width: 100, height: 30, type: 'cloud', moveSpeed: 0.5, moveRange: 40, originalX: 650 },
    { x: 100, y: 180, width: 110, height: 30, type: 'cloud', moveSpeed: 0.78, moveRange: 28, originalX: 100 },
    { x: 350, y: 150, width: 120, height: 30, type: 'cloud', moveSpeed: 0.6, moveRange: 30, originalX: 350 },
    { x: 550, y: 110, width: 100, height: 30, type: 'cloud', moveSpeed: 0.82, moveRange: 30, originalX: 550 },
    { x: 300, y: 60, width: 200, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 90, y: 435, collected: false, size: 25 },
    { id: 2, x: 290, y: 405, collected: false, size: 25 },
    { id: 3, x: 490, y: 425, collected: false, size: 25 },
    { id: 4, x: 690, y: 395, collected: false, size: 25 },
    { id: 5, x: 140, y: 335, collected: false, size: 25 },
    { id: 6, x: 395, y: 345, collected: false, size: 25 },
    { id: 7, x: 600, y: 315, collected: false, size: 25 },
    { id: 8, x: 70, y: 255, collected: false, size: 25 },
    { id: 9, x: 265, y: 235, collected: false, size: 25 },
    { id: 10, x: 490, y: 215, collected: false, size: 25 },
    { id: 11, x: 690, y: 195, collected: false, size: 25 },
    { id: 12, x: 145, y: 145, collected: false, size: 25 },
    { id: 13, x: 400, y: 115, collected: false, size: 25 },
    { id: 14, x: 590, y: 75, collected: false, size: 25 },
    { id: 15, x: 390, y: 25, collected: false, size: 35 },
  ],
});
