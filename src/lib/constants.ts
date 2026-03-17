export const GAME_CONSTANTS = {
    LANE_COUNT: 5,
    INITIAL_SPEED: 1.8,
    MAX_SPEED: 4.5,
    INITIAL_LIVES: 3,
    INVINCIBILITY_DURATION: 2000,
    RESPAWN_INVINCIBILITY_DURATION: 1500,
    SCORE_PER_NEAR_MISS: 100,
    COMBO_MULTIPLIER_STEP: 5,
    MAX_MULTIPLIER: 5,
    BREAK_SCENE_INTERVAL: 120, // 2 minutes in seconds
    BREAK_SCENE_DURATION: 10,  // 10 seconds
    DIFFICULTY_SPEED_INCREMENT: 0.1,
    DIFFICULTY_SCORE_STEP: 500,
    CANVAS_TARGET_WIDTH: 450,
    CANVAS_WIDTH_RATIO: 0.7,
    ROAD_SCROLL_SPEED_MULTIPLIER: 3,
    ENEMY_SPEED_MULTIPLIER: 1.5,
    TIME_STEP: 16, // ms
    SCORE_TIME_FACTOR: 0.5,
    TRIVIA_INTERVAL_1P: 1200, // ~20s at 60fps
    TRIVIA_INTERVAL_2P: 300,  // ~5s at 60fps
} as const;

export const POWERUP_CONSTANTS = {
    SLOW_MO_DURATION: 5000,
    SHIELD_DURATION: 3000,
    SPAWN_CHANCE: 0.15,
    MIN_LIVES: 1,
    MAX_LIVES: 5,
} as const;

export const SIGN_TYPES = {
    'stop': {
        color: '#ff4757',
        symbol: 'STOP',
        points: 200,
        description: 'Cámara lenta',
    },
    'green-light': {
        color: '#2ed573',
        symbol: 'GO',
        points: 1000,
        description: 'Súper Puntos',
    },
    'yield': {
        color: '#ffa502',
        symbol: '▼',
        points: 300,
        description: 'Vida Extra',
    },
    'work-ahead': {
        color: '#ff7f50',
        symbol: '🛠️',
        points: 400,
        description: 'Escudo protector',
    },
    'bump': {
        color: '#747d8c',
        symbol: '〰',
        points: 500,
        description: 'Limpiar carretera',
    },
} as const;

export const STORAGE_KEYS = {
    HIGH_SCORE: "traffic_game_highscore",
    HIGH_SCORES_LIST: "conduce-seguro-highscores"
} as const;

export const SAFETY_TIPS = [
    {
        title: "Distancia de Seguridad",
        text: "Mantén siempre una distancia prudente. ¡Te da tiempo a reaccionar!",
        icon: "🚗 ↔️ 🚗"
    },
    {
        title: "Cinturón de Seguridad",
        text: "El cinturón salva vidas. Abróchalo antes de arrancar.",
        icon: "🛡️"
    },
    {
        title: "Señales de Tránsito",
        text: "Respetar las señales no es opcional, es vital para todos.",
        icon: "🛑"
    },
    {
        title: "Cero Distracciones",
        text: "El celular puede esperar. Tu vida y la de los demás, no.",
        icon: "📱 🚫"
    },
    {
        title: "Límites de Velocidad",
        text: "Correr no te hace llegar antes, te pone en peligro.",
        icon: "⚡ 🚫"
    },
    {
        title: "Paso de Peatones",
        text: "Recuerda: el peatón siempre tiene la prioridad.",
        icon: "🚶"
    }
] as const;

/** 2-Player specific constants */
export const MULTIPLAYER_CONSTANTS = {
    /** Player 1 keyboard bindings */
    P1_KEYS: { left: 'a', right: 'd' },
    /** Player 2 keyboard bindings */
    P2_KEYS: { left: 'ArrowLeft', right: 'ArrowRight' },
    /** Lerp factor for smooth lane transitions (0-1, higher = faster snap) */
    LANE_LERP_SPEED: 0.15,
    /** Player colors for HUD differentiation */
    P1_COLOR: '#FFD700',
    P2_COLOR: '#00D4FF',
} as const;

/** Animated background system constants */
export const BACKGROUND_CONSTANTS = {
    /** Milliseconds between background scene changes */
    CYCLE_INTERVAL: 5000,
    /** Milliseconds for crossfade transition between scenes */
    TRANSITION_DURATION: 1500,
    /** Number of distinct background scenes */
    SCENE_COUNT: 4,
} as const;
