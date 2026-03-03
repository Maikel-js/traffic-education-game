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
    type: 'points' | 'combo' | 'near-miss'
    x: number
    y: number
    multiplier?: number
}

export interface GameState {
    running: boolean
    paused: boolean
    player: Player
    enemies: Enemy[]
    roadOffset: number
    speed: number
    lives: number
    score: number
    highScore: number
    combo: number
    multiplier: number
    scoreEvents: ScoreEvent[]
    invincible: boolean
    invincibleTimer: number
    playTime: number
    showRestScreen: boolean
}

export interface TriviaQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}
