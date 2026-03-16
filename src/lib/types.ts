export interface Enemy {
    id: string
    x: number
    y: number
    lane: number
    width: number
    height: number
    speed: number
    color: string
    passed?: boolean
}

export interface Player {
    lane: number
    x: number
    y: number
    width: number
    height: number
}

export interface ScoreEvent {
    id: number
    points: number
    type: 'points' | 'combo' | 'near-miss' | 'power-up'
    label?: string
    color?: string
    x: number
    y: number
    multiplier?: number
}

export type TrafficSignType = 'stop' | 'green-light' | 'yield' | 'work-ahead' | 'bump';

export interface TrafficSign {
    id: string
    type: TrafficSignType
    x: number
    y: number
    lane: number
    width: number
    height: number
}

/** Game mode: single player or local 2-player */
export type GameMode = '1p' | '2p';

/**
 * Per-player state — encapsulates all data unique to each player.
 * In 1P mode only players[0] is used; in 2P mode both are active.
 */
export interface PlayerState {
    id: 1 | 2
    player: Player
    enemies: Enemy[]
    signs: TrafficSign[]
    lives: number
    score: number
    highScore: number
    combo: number
    maxCombo: number
    multiplier: number
    scoreEvents: ScoreEvent[]
    invincible: boolean
    invincibleTimer: number
    slowMoTimer: number
    /** Smoothly interpolated X position for rendering */
    displayX: number
}

export interface GameState {
    running: boolean
    paused: boolean
    gameMode: GameMode
    players: PlayerState[]
    roadOffset: number
    speed: number
    playTime: number
    showRestScreen: boolean
    /** In 2P mode, the winning player id (1 or 2). null while game is active. */
    winner: number | null

    // Legacy single-player aliases (kept for backward compatibility)
    player: Player
    enemies: Enemy[]
    signs: TrafficSign[]
    lives: number
    score: number
    highScore: number
    combo: number
    multiplier: number
    scoreEvents: ScoreEvent[]
    invincible: boolean
    invincibleTimer: number
    slowMoTimer: number
}

export interface TriviaQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}
