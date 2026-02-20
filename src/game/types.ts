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
  moveSpeed?: number;
  moveRange?: number;
  originalX?: number;
}

export interface Heart {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  size: number;
  respawnTimer?: number;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  minX: number;
  maxX: number;
  type: 'patrol' | 'chaser' | 'jumper';
  chaseSpeed?: number;
  jumpTimer?: number;
  isGrounded?: boolean;
  jumpForce?: number;
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

export interface LevelBackground {
  skyTop: string;
  skyBottom: string;
  name: string;
}

export interface GameState {
  player: Player;
  spawnPoint: Position;
  platforms: Platform[];
  hearts: Heart[];
  enemies: Enemy[];
  particles: Particle[];
  score: number;
  totalHearts: number;
  collectedHearts: number;
  gameWon: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  level: number;
  levelComplete: boolean;
  screenShake: number;
  sparkleTrails: Particle[];
  boostEnergy: number;
  boostMaxEnergy: number;
  boostCooldown: boolean;
  playerHearts: number;
  maxPlayerHearts: number;
  invincibleTimer: number;
  spawnImmune: boolean;
  background: LevelBackground;
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
  momentumBonus: 0.15,
  boostCost: 40,
  boostRegenRate: 15,
  heartRespawnTime: 5,
};
