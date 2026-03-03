import { browser } from '$app/environment';
import type { Enemy, Player, ScoreEvent, GameState } from '../types';
import { GAME_CONSTANTS, STORAGE_KEYS } from '../constants';

// Load high score from localStorage
const savedHighScore = browser ? parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || "0") : 0;

export const gameState = $state<GameState>({
    running: false,
    paused: false,
    speed: GAME_CONSTANTS.INITIAL_SPEED,
    player: {
        lane: 2,
        x: 0,
        y: 0,
        width: 70,
        height: 110,
    },
    enemies: [],
    roadOffset: 0,
    lives: GAME_CONSTANTS.INITIAL_LIVES,
    score: 0,
    highScore: savedHighScore,
    combo: 0,
    multiplier: 1,
    scoreEvents: [],
    invincible: false,
    invincibleTimer: 0,
    playTime: 0,
    showRestScreen: false,
});

export function resetGame() {
    gameState.running = false;
    gameState.paused = false;
    gameState.speed = GAME_CONSTANTS.INITIAL_SPEED;
    gameState.player = {
        lane: 2,
        x: 0,
        y: 0,
        width: 70,
        height: 110,
    };
    gameState.enemies = [];
    gameState.roadOffset = 0;
    gameState.lives = GAME_CONSTANTS.INITIAL_LIVES;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.multiplier = 1;
    gameState.scoreEvents = [];
    gameState.invincible = false;
    gameState.invincibleTimer = 0;
    gameState.playTime = 0;
    gameState.showRestScreen = false;
}

export function togglePause(force?: boolean) {
    gameState.paused = typeof force === "boolean" ? force : !gameState.paused;
}

function checkCollision(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

export function updateGame(deltaTime: number, canvasWidth: number, canvasHeight: number) {
    if (!gameState.running || gameState.paused) return

    const dt = deltaTime / GAME_CONSTANTS.TIME_STEP

    // Update play time
    gameState.playTime += deltaTime / 1000

    // Check for rest screen
    if (gameState.playTime >= GAME_CONSTANTS.REST_SCREEN_TRIGGER_TIME) {
        gameState.showRestScreen = true
        gameState.paused = true
    }

    const lanePositions = getLanePositions(canvasWidth)
    const playerX = lanePositions[gameState.player.lane] - gameState.player.width / 2
    const playerY = canvasHeight * 0.75 - gameState.player.height / 2

    gameState.roadOffset = (gameState.roadOffset + gameState.speed * dt * GAME_CONSTANTS.ROAD_SCROLL_SPEED_MULTIPLIER) % 100

    handleInvincibility(deltaTime);
    handleEncounters(dt, playerX, playerY, lanePositions);
    updateScore(dt);
    updateDifficulty();

    // Sync player position
    gameState.player.x = playerX
    gameState.player.y = playerY

    checkGameOver();
}

function handleInvincibility(deltaTime: number) {
    if (gameState.invincible) {
        gameState.invincibleTimer -= deltaTime
        if (gameState.invincibleTimer <= 0) {
            gameState.invincible = false
            gameState.invincibleTimer = 0
        }
    }
}

function handleEncounters(dt: number, playerX: number, playerY: number, lanePositions: number[]) {
    // Check collisions and near misses
    gameState.enemies = gameState.enemies
        .map((enemy) => {
            const newY = enemy.y + (gameState.speed + enemy.speed) * dt * GAME_CONSTANTS.ENEMY_SPEED_MULTIPLIER
            const enemyX = lanePositions[enemy.lane] - enemy.width / 2

            // Collision check
            if (!gameState.invincible && checkCollision(
                playerX, playerY, gameState.player.width, gameState.player.height,
                enemyX, enemy.y, enemy.width, enemy.height
            )) {
                triggerCollision();
            }

            // Near Miss Logic
            if (!enemy.passed && enemy.y < playerY && newY >= playerY) {
                const distanceX = Math.abs(playerX - enemyX)
                if (distanceX < 100) {
                    processNearMiss(playerX, playerY);
                }
                return { ...enemy, y: newY, passed: true }
            }

            return { ...enemy, y: newY }
        })
        .filter((enemy) => enemy.y < 850)
}

function triggerCollision() {
    gameState.lives -= 1
    gameState.invincible = true
    gameState.invincibleTimer = GAME_CONSTANTS.INVINCIBILITY_DURATION
    gameState.combo = 0
    gameState.multiplier = 1

    if (browser) {
        import("$lib/utils/sound-manager.svelte").then(({ soundManager }) => {
            soundManager.playCrash()
        })
    }
}

function processNearMiss(x: number, y: number) {
    gameState.combo += 1
    gameState.multiplier = Math.min(GAME_CONSTANTS.MAX_MULTIPLIER, 1 + Math.floor(gameState.combo / GAME_CONSTANTS.COMBO_MULTIPLIER_STEP))
    const points = GAME_CONSTANTS.SCORE_PER_NEAR_MISS * gameState.multiplier
    addScoreEvent(points, 'near-miss', x, y)
    gameState.score += points
}

function updateScore(dt: number) {
    gameState.score += Math.floor(gameState.speed * dt * GAME_CONSTANTS.SCORE_TIME_FACTOR * gameState.multiplier)
}

function updateDifficulty() {
    const difficultyLevel = Math.floor(gameState.score / GAME_CONSTANTS.DIFFICULTY_SCORE_STEP)
    const targetSpeed = GAME_CONSTANTS.INITIAL_SPEED + (difficultyLevel * GAME_CONSTANTS.DIFFICULTY_SPEED_INCREMENT)
    if (gameState.speed < targetSpeed && gameState.speed < GAME_CONSTANTS.MAX_SPEED) {
        gameState.speed = Math.min(GAME_CONSTANTS.MAX_SPEED, targetSpeed)
    }
}

function checkGameOver() {
    if (gameState.lives <= 0) {
        gameState.running = false
        gameState.lives = 0
        gameState.combo = 0
        gameState.multiplier = 1

        if (gameState.score > gameState.highScore) {
            gameState.highScore = Math.floor(gameState.score)
            if (browser) {
                localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, gameState.highScore.toString())
            }
        }
    }
}

export function addScoreEvent(points: number, type: 'points' | 'combo' | 'near-miss', x: number, y: number) {
    const id = Date.now()
    gameState.scoreEvents.push({ id, points, type, x, y, multiplier: gameState.multiplier })

    setTimeout(() => {
        gameState.scoreEvents = gameState.scoreEvents.filter(e => e.id !== id)
    }, 1000)
}

export function getLanePositions(canvasWidth: number): number[] {
    const roadWidth = Math.min(canvasWidth * GAME_CONSTANTS.CANVAS_WIDTH_RATIO, GAME_CONSTANTS.CANVAS_TARGET_WIDTH)
    const roadLeft = (canvasWidth - roadWidth) / 2
    const laneWidth = roadWidth / GAME_CONSTANTS.LANE_COUNT

    const positions: number[] = []
    for (let i = 0; i < GAME_CONSTANTS.LANE_COUNT; i++) {
        positions.push(roadLeft + laneWidth * i + laneWidth / 2)
    }

    return positions
}

export function addScore(points: number) {
    gameState.score += points
}

export function removeLife() {
    gameState.lives = Math.max(0, gameState.lives - 1)
    if (gameState.lives <= 0) {
        gameState.lives = 0
        gameState.running = false
    } else {
        gameState.invincible = true
        gameState.invincibleTimer = GAME_CONSTANTS.RESPAWN_INVINCIBILITY_DURATION
    }
}
