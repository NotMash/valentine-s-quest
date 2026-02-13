import { Player, Platform, Heart, Enemy, GAME_CONFIG, Particle, Position } from './types';
import { KeyState } from '../hooks/useKeyboard';

export const updatePlayer = (
  player: Player,
  keys: KeyState,
  platforms: Platform[],
  deltaTime: number,
  boostEnergy: number,
  boostMaxEnergy: number,
  respawnPoint: Position
): { player: Player; fellOff: boolean; boostUsed: number; jumped: boolean } => {
  const newPlayer = { ...player };
  let fellOff = false;
  let boostUsed = 0;
  let jumped = false;
  
  // Horizontal movement
  if (keys.left) {
    newPlayer.velocity.x = -GAME_CONFIG.moveSpeed;
    newPlayer.facingRight = false;
  } else if (keys.right) {
    newPlayer.velocity.x = GAME_CONFIG.moveSpeed;
    newPlayer.facingRight = true;
  } else {
    newPlayer.velocity.x *= GAME_CONFIG.friction;
  }

  // Jump with momentum bonus — faster horizontal speed = higher jump
  if (keys.up && newPlayer.isGrounded) {
    jumped = true;
    const speedRatio = Math.abs(newPlayer.velocity.x) / GAME_CONFIG.moveSpeed;
    const momentumBonus = 1 + speedRatio * GAME_CONFIG.momentumBonus;
    const boostRatio = keys.boost ? Math.max(0, Math.min(1, boostEnergy / boostMaxEnergy)) : 0;
    const baseForce = GAME_CONFIG.jumpForce + (GAME_CONFIG.boostJumpForce - GAME_CONFIG.jumpForce) * boostRatio;
    if (boostRatio > 0) {
      boostUsed = Math.min(boostEnergy, GAME_CONFIG.boostCost * boostRatio);
    }
    newPlayer.velocity.y = -(baseForce * momentumBonus);
    newPlayer.isGrounded = false;
  }

  // Apply gravity
  newPlayer.velocity.y += GAME_CONFIG.gravity * deltaTime;

  // Update position
  newPlayer.position.x += newPlayer.velocity.x * deltaTime;
  newPlayer.position.y += newPlayer.velocity.y * deltaTime;

  // Boundary checks
  if (newPlayer.position.x < 0) {
    newPlayer.position.x = 0;
    newPlayer.velocity.x = 0;
  }
  if (newPlayer.position.x > GAME_CONFIG.width - newPlayer.width) {
    newPlayer.position.x = GAME_CONFIG.width - newPlayer.width;
    newPlayer.velocity.x = 0;
  }

  // Platform collision
  newPlayer.isGrounded = false;
  for (const platform of platforms) {
    if (checkPlatformCollision(newPlayer, platform)) {
      const playerBottom = player.position.y + player.height;
      const platformTop = platform.y;
      if (player.velocity.y >= 0 && playerBottom <= platformTop + 20) {
        newPlayer.position.y = platformTop - newPlayer.height;
        newPlayer.velocity.y = 0;
        newPlayer.isGrounded = true;
      }
    }
  }

  // Fall off screen - respawn
  if (newPlayer.position.y > GAME_CONFIG.height + 50) {
    newPlayer.position = { ...respawnPoint };
    newPlayer.velocity = { x: 0, y: 0 };
    fellOff = true;
  }

  return { player: newPlayer, fellOff, boostUsed, jumped };
};

const checkPlatformCollision = (player: Player, platform: Platform): boolean => {
  return (
    player.position.x < platform.x + platform.width &&
    player.position.x + player.width > platform.x &&
    player.position.y < platform.y + platform.height &&
    player.position.y + player.height > platform.y
  );
};

export const checkHeartCollision = (player: Player, heart: Heart): boolean => {
  if (heart.collected) return false;
  
  const playerCenterX = player.position.x + player.width / 2;
  const playerCenterY = player.position.y + player.height / 2;
  const heartCenterX = heart.x + heart.size / 2;
  const heartCenterY = heart.y + heart.size / 2;
  
  const distance = Math.sqrt(
    Math.pow(playerCenterX - heartCenterX, 2) +
    Math.pow(playerCenterY - heartCenterY, 2)
  );
  
  return distance < (player.width / 2 + heart.size / 2);
};

export const checkEnemyCollision = (player: Player, enemy: Enemy): boolean => {
  return (
    player.position.x < enemy.x + enemy.width &&
    player.position.x + player.width > enemy.x &&
    player.position.y < enemy.y + enemy.height &&
    player.position.y + player.height > enemy.y
  );
};

export const updateEnemies = (
  enemies: Enemy[],
  platforms: Platform[],
  deltaTime: number,
  playerX?: number,
  playerY?: number
): Enemy[] => {
  return enemies.map(enemy => {
    let newX = enemy.x;
    let newY = enemy.y;
    let newVx = enemy.vx;
    let newVy = enemy.vy || 0;
    let newJumpTimer = enemy.jumpTimer ?? 0;
    let isGrounded = enemy.isGrounded ?? false;

    const dx = playerX !== undefined ? playerX - enemy.x : 0;
    const dy = playerY !== undefined ? playerY - enemy.y : 0;

    if (enemy.type === 'chaser' && playerX !== undefined) {
      const chaseSpeed = enemy.chaseSpeed || 100;
      if (Math.abs(dx) < 420) {
        newVx = dx > 0 ? chaseSpeed : -chaseSpeed;
      }
    }

    if (enemy.type === 'jumper') {
      newJumpTimer -= deltaTime;
      if (isGrounded && newJumpTimer <= 0) {
        newVy = -(enemy.jumpForce ?? 380);
        isGrounded = false;
        newJumpTimer = 1.4 + Math.random() * 1.2;
      }
    } else if (enemy.type === 'chaser' && isGrounded && playerY !== undefined && Math.abs(dx) < 180 && dy < -35) {
      // Chasers can climb to nearby higher platforms when the player is above.
      newVy = -(enemy.jumpForce ?? 430);
      isGrounded = false;
    }

    // Turn around before running off ledges.
    if (isGrounded) {
      const feetY = enemy.y + enemy.height;
      const lookAheadX = newVx > 0 ? enemy.x + enemy.width + 10 : enemy.x - 10;
      const hasGroundAhead = enemyGroundAhead(lookAheadX, feetY, enemy, platforms);
      if (!hasGroundAhead) {
        newVx = -newVx;
      }
    }

    const prevY = newY;
    const gravity = enemy.type === 'jumper' ? 900 : 1200;
    newVy += gravity * deltaTime;

    newX += newVx * deltaTime;
    newY += newVy * deltaTime;
    isGrounded = false;

    // Horizontal boundary patrol fallback.
    if (newX <= enemy.minX || newX + enemy.width >= enemy.maxX) {
      newVx = -newVx;
      newX = Math.max(enemy.minX, Math.min(newX, enemy.maxX - enemy.width));
    }

    // Collision with world platforms (land from above).
    for (const platform of platforms) {
      const intersects =
        newX < platform.x + platform.width &&
        newX + enemy.width > platform.x &&
        newY < platform.y + platform.height &&
        newY + enemy.height > platform.y;

      if (!intersects) continue;

      const prevBottom = prevY + enemy.height;
      const newBottom = newY + enemy.height;
      const landing = newVy >= 0 && prevBottom <= platform.y + 6 && newBottom >= platform.y;

      if (landing) {
        newY = platform.y - enemy.height;
        newVy = 0;
        isGrounded = true;
      }
    }

    // Failsafe: respawn to baseline if enemy falls far off map.
    if (newY > GAME_CONFIG.height + 80) {
      newY = 520;
      newVy = 0;
      isGrounded = true;
    }

    return {
      ...enemy,
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy,
      jumpTimer: newJumpTimer,
      isGrounded,
    };
  });
};

const enemyGroundAhead = (x: number, feetY: number, enemy: Enemy, platforms: Platform[]): boolean => {
  return platforms.some(platform => {
    if (x < platform.x || x > platform.x + platform.width) return false;
    if (platform.x > enemy.maxX || platform.x + platform.width < enemy.minX) return false;
    return Math.abs(platform.y - feetY) <= 14;
  });
};

export const createHeartParticles = (x: number, y: number): Particle[] => {
  const particles: Particle[] = [];
  const colors = ['#ff6b9d', '#ff8fab', '#ffc2d1', '#ff85a1'];
  
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i;
    particles.push({
      id: Date.now() + i,
      x,
      y,
      vx: Math.cos(angle) * 100,
      vy: Math.sin(angle) * 100 - 50,
      life: 1,
      maxLife: 1,
      size: 8 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  
  return particles;
};

export const createDamageParticles = (x: number, y: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i;
    particles.push({
      id: Date.now() + i + 100,
      x, y,
      vx: Math.cos(angle) * 120,
      vy: Math.sin(angle) * 120 - 60,
      life: 0.8,
      maxLife: 0.8,
      size: 6 + Math.random() * 4,
      color: ['#ff4444', '#ff6666', '#ff8888'][Math.floor(Math.random() * 3)],
    });
  }
  return particles;
};

export const updateParticles = (particles: Particle[], deltaTime: number): Particle[] => {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx * deltaTime,
      y: p.y + p.vy * deltaTime,
      vy: p.vy + 200 * deltaTime,
      life: p.life - deltaTime * 2,
    }))
    .filter(p => p.life > 0);
};
