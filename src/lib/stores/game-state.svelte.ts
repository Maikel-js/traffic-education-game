import { browser } from '$app/environment';
import type { Enemy, Player, PlayerState, ScoreEvent, GameState, GameMode } from '../types';
import { GAME_CONSTANTS, STORAGE_KEYS, MULTIPLAYER_CONSTANTS, SIGN_TYPES, POWERUP_CONSTANTS } from '../constants';

// Load high score from localStorage
const savedHighScore = browser ? parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || "0") : 0;

/**
 * Creates a fresh PlayerState for the given player id.
 * @param id - Player identifier (1 or 2)
 * @param startLane - Starting lane (default 2 for center)
 */
function createPlayerState(id: 1 | 2, startLane = 2): PlayerState {
    return {
        id,
        player: {
            lane: startLane,
            x: 0,
            y: 0,
            width: 70,
            height: 110,
        },
        enemies: [],
        signs: [],
        lives: GAME_CONSTANTS.INITIAL_LIVES,
        score: 0,
        highScore: id === 1 ? savedHighScore : 0,
        combo: 0,
        maxCombo: 0,
        multiplier: 1,
        scoreEvents: [],
        invincible: false,
        invincibleTimer: 0,
        slowMoTimer: 0,
        displayX: 0,
    };
}

export const gameState = $state<GameState>({
    running: false,
    paused: false,
    gameMode: '1p',
    players: [createPlayerState(1)],
    roadOffset: 0,
    speed: GAME_CONSTANTS.INITIAL_SPEED,
    playTime: 0,
    showRestScreen: false,
    winner: null,

    // Legacy single-player aliases — point to players[0]
    get player() { return this.players[0].player; },
    set player(v) { this.players[0].player = v; },
    get enemies() { return this.players[0].enemies; },
    set enemies(v) { this.players[0].enemies = v; },
    get signs() { return this.players[0].signs; },
    set signs(v) { this.players[0].signs = v; },
    get lives() { return this.players[0].lives; },
    set lives(v) { this.players[0].lives = v; },
    get score() { return this.players[0].score; },
    set score(v) { this.players[0].score = v; },
    get highScore() { return this.players[0].highScore; },
    set highScore(v) { this.players[0].highScore = v; },
    get combo() { return this.players[0].combo; },
    set combo(v) { this.players[0].combo = v; },
    get multiplier() { return this.players[0].multiplier; },
    set multiplier(v) { this.players[0].multiplier = v; },
    get scoreEvents() { return this.players[0].scoreEvents; },
    set scoreEvents(v) { this.players[0].scoreEvents = v; },
    get invincible() { return this.players[0].invincible; },
    set invincible(v) { this.players[0].invincible = v; },
    get invincibleTimer() { return this.players[0].invincibleTimer; },
    set invincibleTimer(v) { this.players[0].invincibleTimer = v; },
    get slowMoTimer() { return this.players[0].slowMoTimer; },
    set slowMoTimer(v) { this.players[0].slowMoTimer = v; },
});

/**
 * Reset game to initial state.
 * @param mode - '1p' for single player, '2p' for local multiplayer
 */
export function resetGame(mode: GameMode = '1p') {
    gameState.running = false;
    gameState.paused = false;
    gameState.gameMode = mode;
    gameState.speed = GAME_CONSTANTS.INITIAL_SPEED;
    gameState.roadOffset = 0;
    gameState.playTime = 0;
    gameState.showRestScreen = false;
    gameState.winner = null;

    if (mode === '2p') {
        gameState.players = [createPlayerState(1, 2), createPlayerState(2, 2)];
    } else {
        gameState.players = [createPlayerState(1, 2)];
    }
}

export function togglePause(force?: boolean) {
    gameState.paused = typeof force === "boolean" ? force : !gameState.paused;
}

function checkCollision(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number,
): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

/**
 * Main game update — runs per-frame.
 * Updates all players independently.
 */
export function updateGame(deltaTime: number, canvasWidth: number, canvasHeight: number) {
    if (!gameState.running || gameState.paused) return;

    // Determine effective canvas width per player
    const playerCanvasWidth = gameState.gameMode === '2p'
        ? canvasWidth / 2
        : canvasWidth;

    // Apply slow-mo (use P1's timer for global effect in 1P)
    const dt = deltaTime / GAME_CONSTANTS.TIME_STEP;

    // Update timers
    gameState.playTime += deltaTime / 1000;

    // Check for rest screen
    if (gameState.playTime >= GAME_CONSTANTS.BREAK_SCENE_INTERVAL) {
        gameState.showRestScreen = true;
        gameState.paused = true;
    }

    gameState.roadOffset = (gameState.roadOffset + gameState.speed * dt * GAME_CONSTANTS.ROAD_SCROLL_SPEED_MULTIPLIER) % 100;

    // Update each player independently
    for (const ps of gameState.players) {
        const timeScale = ps.slowMoTimer > 0 ? 0.5 : 1.0;
        const playerDt = dt * timeScale;

        if (ps.slowMoTimer > 0) {
            ps.slowMoTimer -= deltaTime;
            if (ps.slowMoTimer < 0) ps.slowMoTimer = 0;
        }

        const { positions: lanePositions, laneWidth } = getLanePositions(playerCanvasWidth);
        const baseLaneWidth = 90; // Approx lane width in 1P mode
        const scale = laneWidth / baseLaneWidth;

        // Scale player dimensions based on lane width
        ps.player.width = 70 * scale;
        ps.player.height = 110 * scale;

        const playerX = lanePositions[ps.player.lane] - ps.player.width / 2;
        const playerY = canvasHeight * 0.75 - ps.player.height / 2;

        handleInvincibility(deltaTime, ps);
        handleEncounters(playerDt, playerX, playerY, lanePositions, ps, scale);
        handleSigns(playerDt, playerX, playerY, lanePositions, ps);
        updateScoreForPlayer(playerDt, ps);

        // Smooth lane interpolation
        const targetX = playerX;
        if (ps.displayX === 0) ps.displayX = targetX; // Initialize
        ps.displayX += (targetX - ps.displayX) * MULTIPLAYER_CONSTANTS.LANE_LERP_SPEED;

        // Sync player position
        ps.player.x = playerX;
        ps.player.y = playerY;
    }

    updateDifficulty();
    checkGameOver();
}

function handleInvincibility(deltaTime: number, ps: PlayerState) {
    if (ps.invincible) {
        ps.invincibleTimer -= deltaTime;
        if (ps.invincibleTimer <= 0) {
            ps.invincible = false;
            ps.invincibleTimer = 0;
        }
    }
}

function handleSigns(dt: number, playerX: number, playerY: number, lanePositions: number[], ps: PlayerState) {
    ps.signs = ps.signs
        .map((sign) => {
            const newY = sign.y + gameState.speed * dt * GAME_CONSTANTS.ROAD_SCROLL_SPEED_MULTIPLIER;
            const signX = lanePositions[sign.lane] - sign.width / 2;

            // Collision check with player
            if (checkCollision(
                playerX, playerY, ps.player.width, ps.player.height,
                signX, sign.y, sign.width, sign.height
            )) {
                applySignEffect(sign, ps);
                return null; // Remove sign
            }

            return { ...sign, y: newY };
        })
        .filter((sign): sign is NonNullable<typeof sign> => sign !== null && sign.y < 850);
}

function applySignEffect(sign: any, ps: PlayerState) {
    const signData = SIGN_TYPES[sign.type as keyof typeof SIGN_TYPES];
    addScoreEventForPlayer(signData.points, 'power-up', sign.x, sign.y, ps, signData.description, signData.color);
    ps.score += signData.points;

    switch (sign.type) {
        case 'stop':
            ps.slowMoTimer = POWERUP_CONSTANTS.SLOW_MO_DURATION;
            break;
        case 'green-light':
            ps.multiplier = Math.min(GAME_CONSTANTS.MAX_MULTIPLIER, ps.multiplier + 2);
            ps.combo += 10;
            ps.maxCombo = Math.max(ps.maxCombo, ps.combo);
            break;
        case 'yield':
            ps.lives = Math.min(POWERUP_CONSTANTS.MAX_LIVES, ps.lives + 1);
            break;
        case 'work-ahead':
            ps.invincible = true;
            ps.invincibleTimer = POWERUP_CONSTANTS.SHIELD_DURATION;
            break;
        case 'bump':
            ps.enemies = [];
            break;
    }
}

function handleEncounters(dt: number, playerX: number, playerY: number, lanePositions: number[], ps: PlayerState, scale: number) {
    ps.enemies = ps.enemies
        .map((enemy) => {
            const newY = enemy.y + (gameState.speed + enemy.speed) * dt * GAME_CONSTANTS.ENEMY_SPEED_MULTIPLIER;
            const enemyX = lanePositions[enemy.lane] - enemy.width / 2;

            // Collision check
            if (!ps.invincible && checkCollision(
                playerX, playerY, ps.player.width, ps.player.height,
                enemyX, enemy.y, enemy.width, enemy.height
            )) {
                triggerCollision(ps);
            }

            // Near Miss Logic
            if (!enemy.passed && enemy.y < playerY && newY >= playerY) {
                const distanceX = Math.abs(playerX - enemyX);
                // Scale near-miss threshold
                if (distanceX < 100 * scale) {
                    processNearMiss(playerX, playerY, ps);
                }
                return { ...enemy, y: newY, passed: true };
            }

            return { ...enemy, y: newY };
        })
        .filter((enemy) => enemy.y < 850);
}

function triggerCollision(ps: PlayerState) {
    ps.lives -= 1;
    ps.invincible = true;
    ps.invincibleTimer = GAME_CONSTANTS.INVINCIBILITY_DURATION;
    ps.combo = 0;
    ps.multiplier = 1;

    if (browser) {
        import("$lib/utils/sound-manager.svelte").then(({ soundManager }) => {
            soundManager.playCrash();
        });
    }
}

function processNearMiss(x: number, y: number, ps: PlayerState) {
    ps.combo += 1;
    ps.maxCombo = Math.max(ps.maxCombo, ps.combo);
    ps.multiplier = Math.min(GAME_CONSTANTS.MAX_MULTIPLIER, 1 + Math.floor(ps.combo / GAME_CONSTANTS.COMBO_MULTIPLIER_STEP));
    const points = GAME_CONSTANTS.SCORE_PER_NEAR_MISS * ps.multiplier;
    addScoreEventForPlayer(points, 'near-miss', x, y, ps);
    ps.score += points;
}

function updateScoreForPlayer(dt: number, ps: PlayerState) {
    ps.score += Math.floor(gameState.speed * dt * GAME_CONSTANTS.SCORE_TIME_FACTOR * ps.multiplier);
}

function updateDifficulty() {
    // Use highest player score for difficulty
    const maxScore = Math.max(...gameState.players.map(p => p.score));
    const difficultyLevel = Math.floor(maxScore / GAME_CONSTANTS.DIFFICULTY_SCORE_STEP);
    const targetSpeed = GAME_CONSTANTS.INITIAL_SPEED + (difficultyLevel * GAME_CONSTANTS.DIFFICULTY_SPEED_INCREMENT);
    if (gameState.speed < targetSpeed && gameState.speed < GAME_CONSTANTS.MAX_SPEED) {
        gameState.speed = Math.min(GAME_CONSTANTS.MAX_SPEED, targetSpeed);
    }
}

function checkGameOver() {
    if (gameState.gameMode === '2p') {
        // In 2P: game ends when one player loses all lives
        const deadPlayers = gameState.players.filter(p => p.lives <= 0);
        if (deadPlayers.length > 0) {
            const alivePlayer = gameState.players.find(p => p.lives > 0);
            if (alivePlayer) {
                gameState.winner = alivePlayer.id;
            } else {
                // Both dead simultaneously — higher score wins
                gameState.winner = gameState.players[0].score >= gameState.players[1].score ? 1 : 2;
            }
            gameState.running = false;

            // Reset dead player stats
            for (const p of deadPlayers) {
                p.lives = 0;
                p.combo = 0;
                p.multiplier = 1;
            }

            // Save high scores
            for (const p of gameState.players) {
                if (p.score > p.highScore) {
                    p.highScore = Math.floor(p.score);
                    if (browser && p.id === 1) {
                        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, p.highScore.toString());
                    }
                }
            }
        }
    } else {
        // 1P: original behavior
        const ps = gameState.players[0];
        if (ps.lives <= 0) {
            gameState.running = false;
            ps.lives = 0;
            ps.combo = 0;
            ps.multiplier = 1;

            if (ps.score > ps.highScore) {
                ps.highScore = Math.floor(ps.score);
                if (browser) {
                    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, ps.highScore.toString());
                }
            }
        }
    }
}

/**
 * Add a floating score event for a specific player.
 */
export function addScoreEventForPlayer(
    points: number,
    type: 'points' | 'combo' | 'near-miss' | 'power-up',
    x: number,
    y: number,
    ps: PlayerState,
    label?: string,
    color?: string
) {
    const id = Date.now() + Math.random();
    ps.scoreEvents.push({ id, points, type, x, y, multiplier: ps.multiplier, label, color });

    setTimeout(() => {
        ps.scoreEvents = ps.scoreEvents.filter(e => e.id !== id);
    }, 1000);
}

/**
 * Legacy addScoreEvent — delegates to player 0.
 */
export function addScoreEvent(
    points: number,
    type: 'points' | 'combo' | 'near-miss' | 'power-up',
    x: number,
    y: number,
    label?: string,
    color?: string
) {
    addScoreEventForPlayer(points, type, x, y, gameState.players[0], label, color);
}

export function getLanePositions(canvasWidth: number): { positions: number[], laneWidth: number } {
    const roadWidth = Math.min(canvasWidth * GAME_CONSTANTS.CANVAS_WIDTH_RATIO, GAME_CONSTANTS.CANVAS_TARGET_WIDTH);
    const roadLeft = (canvasWidth - roadWidth) / 2;
    const laneWidth = roadWidth / GAME_CONSTANTS.LANE_COUNT;

    const positions: number[] = [];
    for (let i = 0; i < GAME_CONSTANTS.LANE_COUNT; i++) {
        positions.push(roadLeft + laneWidth * i + laneWidth / 2);
    }

    return { positions, laneWidth };
}

/**
 * Add score for a specific player.
 */
export function addScore(points: number, playerIndex = 0) {
    gameState.players[playerIndex].score += points;
}

/**
 * Remove a life from a specific player.
 */
export function removeLife(playerIndex = 0) {
    const ps = gameState.players[playerIndex];
    ps.lives = Math.max(0, ps.lives - 1);
    if (ps.lives <= 0) {
        ps.lives = 0;
        // Don't immediately stop running — let checkGameOver handle it
    } else {
        ps.invincible = true;
        ps.invincibleTimer = GAME_CONSTANTS.RESPAWN_INVINCIBILITY_DURATION;
    }
}
