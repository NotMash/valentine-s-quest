export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Player {
  position: Position;
  velocity: Velocity;
  width: number;
  height: number;
  isGrounded: boolean;
  facingRight: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cloud' | 'ground';
}

export interface Heart {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  size: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface GameState {
  player: Player;
  platforms: Platform[];
  hearts: Heart[];
  particles: Particle[];
  score: number;
  totalHearts: number;
  gameWon: boolean;
  gameStarted: boolean;
  level: number;
  levelComplete: boolean;
  screenShake: number;
  sparkleTrails: Particle[];
}

export const GAME_CONFIG = {
  width: 800,
  height: 600,
  gravity: 1800,
  jumpForce: 600,
  boostJumpForce: 850,
  moveSpeed: 350,
  friction: 0.85,
  playerSize: 40,
};
