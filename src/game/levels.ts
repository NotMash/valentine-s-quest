import { Platform, Heart } from './types';

export interface LevelData {
  platforms: Platform[];
  hearts: Heart[];
  name: string;
}

export const TOTAL_LEVELS = 3;

export const createLevel = (level: number = 1): LevelData => {
  switch (level) {
    case 1:
      return createLevel1();
    case 2:
      return createLevel2();
    case 3:
      return createLevel3();
    default:
      return createLevel1();
  }
};

const createLevel1 = (): LevelData => ({
  name: "Garden of Hearts",
  platforms: [
    { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
    { x: 50, y: 450, width: 130, height: 30, type: 'cloud' },
    { x: 250, y: 380, width: 120, height: 30, type: 'cloud' },
    { x: 450, y: 320, width: 130, height: 30, type: 'cloud' },
    { x: 620, y: 400, width: 140, height: 30, type: 'cloud' },
    { x: 100, y: 250, width: 120, height: 30, type: 'cloud' },
    { x: 300, y: 200, width: 160, height: 30, type: 'cloud' },
    { x: 550, y: 180, width: 130, height: 30, type: 'cloud' },
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
  platforms: [
    { x: 0, y: 550, width: 200, height: 50, type: 'ground' },
    { x: 600, y: 550, width: 200, height: 50, type: 'ground' },
    { x: 100, y: 470, width: 110, height: 30, type: 'cloud' },
    { x: 280, y: 500, width: 120, height: 30, type: 'cloud' },
    { x: 450, y: 440, width: 110, height: 30, type: 'cloud' },
    { x: 620, y: 370, width: 130, height: 30, type: 'cloud' },
    { x: 30, y: 350, width: 120, height: 30, type: 'cloud' },
    { x: 200, y: 300, width: 110, height: 30, type: 'cloud' },
    { x: 400, y: 260, width: 130, height: 30, type: 'cloud' },
    { x: 580, y: 200, width: 120, height: 30, type: 'cloud' },
    { x: 350, y: 140, width: 140, height: 30, type: 'cloud' },
    { x: 100, y: 100, width: 130, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 140, y: 435, collected: false, size: 25 },
    { id: 2, x: 330, y: 465, collected: false, size: 25 },
    { id: 3, x: 500, y: 405, collected: false, size: 25 },
    { id: 4, x: 680, y: 335, collected: false, size: 25 },
    { id: 5, x: 80, y: 315, collected: false, size: 25 },
    { id: 6, x: 250, y: 265, collected: false, size: 25 },
    { id: 7, x: 455, y: 225, collected: false, size: 25 },
    { id: 8, x: 635, y: 165, collected: false, size: 25 },
    { id: 9, x: 410, y: 105, collected: false, size: 25 },
    { id: 10, x: 155, y: 65, collected: false, size: 30 },
  ],
});

const createLevel3 = (): LevelData => ({
  name: "Love's Summit",
  platforms: [
    { x: 350, y: 550, width: 120, height: 50, type: 'ground' },
    { x: 150, y: 490, width: 110, height: 30, type: 'cloud' },
    { x: 550, y: 480, width: 110, height: 30, type: 'cloud' },
    { x: 50, y: 420, width: 100, height: 30, type: 'cloud' },
    { x: 680, y: 410, width: 100, height: 30, type: 'cloud' },
    { x: 300, y: 380, width: 120, height: 30, type: 'cloud' },
    { x: 500, y: 330, width: 110, height: 30, type: 'cloud' },
    { x: 100, y: 300, width: 110, height: 30, type: 'cloud' },
    { x: 350, y: 250, width: 130, height: 30, type: 'cloud' },
    { x: 600, y: 220, width: 110, height: 30, type: 'cloud' },
    { x: 200, y: 180, width: 110, height: 30, type: 'cloud' },
    { x: 450, y: 140, width: 120, height: 30, type: 'cloud' },
    { x: 300, y: 70, width: 200, height: 30, type: 'cloud' },
  ],
  hearts: [
    { id: 1, x: 190, y: 455, collected: false, size: 25 },
    { id: 2, x: 595, y: 445, collected: false, size: 25 },
    { id: 3, x: 90, y: 385, collected: false, size: 25 },
    { id: 4, x: 720, y: 375, collected: false, size: 25 },
    { id: 5, x: 350, y: 345, collected: false, size: 25 },
    { id: 6, x: 545, y: 295, collected: false, size: 25 },
    { id: 7, x: 145, y: 265, collected: false, size: 25 },
    { id: 8, x: 405, y: 215, collected: false, size: 25 },
    { id: 9, x: 645, y: 185, collected: false, size: 25 },
    { id: 10, x: 240, y: 145, collected: false, size: 25 },
    { id: 11, x: 500, y: 105, collected: false, size: 25 },
    { id: 12, x: 390, y: 35, collected: false, size: 35 },
  ],
});
