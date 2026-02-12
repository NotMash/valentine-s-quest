import { Player, Platform, Heart, GAME_CONFIG, Particle } from './types';
import { KeyState } from '../hooks/useKeyboard';

export const updatePlayer = (
  player: Player,
  keys: KeyState,
  platforms: Platform[],
  deltaTime: number
): Player => {
  let newPlayer = { ...player };
  
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

  // Jump (boost with shift held)
  if (keys.up && newPlayer.isGrounded) {
    const force = keys.boost ? GAME_CONFIG.boostJumpForce : GAME_CONFIG.jumpForce;
    newPlayer.velocity.y = -force;
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
      // Only collide from above — use generous threshold
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
    newPlayer.position = { x: 100, y: 400 };
    newPlayer.velocity = { x: 0, y: 0 };
  }

  return newPlayer;
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
