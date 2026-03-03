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

export interface GameState {
    running: boolean
    paused: boolean
    player: Player
    enemies: Enemy[]
    signs: TrafficSign[]
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
    slowMoTimer: number
    playTime: number
    showRestScreen: boolean
}

export interface TriviaQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}
