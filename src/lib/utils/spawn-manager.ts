import { gameState, getLanePositions } from "$lib/stores/game-state.svelte"
import { GAME_CONSTANTS, POWERUP_CONSTANTS, SIGN_TYPES } from "../constants"
import type { PlayerState, TrafficSignType } from "../types"

/**
 * Spawn manager — handles independent enemy/sign spawning per player.
 * In 2P mode, each player gets their own enemies and signs.
 */
class SpawnManager {
  /** Per-player spawn timers [playerIndex] */
  private spawnTimers: number[] = [0]
  private signTimers: number[] = [0]
  private triviaTimer = 0
  private lastTriviaTime = 0

  /**
   * Reset timers for a fresh game.
   * @param playerCount - 1 or 2
   */
  reset(playerCount: number) {
    this.spawnTimers = Array(playerCount).fill(0)
    this.signTimers = Array(playerCount).fill(0)
    this.triviaTimer = 0
    this.lastTriviaTime = 0
  }

  /**
   * Update spawning for all active players.
   */
  update(deltaTime: number, canvasWidth: number) {
    const dt = deltaTime / 16
    this.triviaTimer += dt

    const playerCount = gameState.players.length
    const perPlayerWidth = gameState.gameMode === '2p'
      ? canvasWidth / 2
      : canvasWidth

    for (let i = 0; i < playerCount; i++) {
      this.updateForPlayer(dt, perPlayerWidth, gameState.players[i], i)
    }
  }

  private updateForPlayer(dt: number, canvasWidth: number, ps: PlayerState, index: number) {
    // Ensure timer arrays are big enough
    while (this.spawnTimers.length <= index) this.spawnTimers.push(0)
    while (this.signTimers.length <= index) this.signTimers.push(0)

    // Skip if player is dead
    if (ps.lives <= 0) return

    this.spawnTimers[index] += dt
    this.signTimers[index] += dt

    const spawnInterval = 20
    if (this.spawnTimers[index] > spawnInterval) {
      this.spawnTimers[index] = 0
      if (Math.random() < 0.85) {
        this.spawnEnemy(canvasWidth, ps)
      }
    }

    const signInterval = 100
    if (this.signTimers[index] > signInterval) {
      this.signTimers[index] = 0
      if (Math.random() < POWERUP_CONSTANTS.SPAWN_CHANCE) {
        this.spawnSign(canvasWidth, ps)
      }
    }
  }

  private spawnSign(canvasWidth: number, ps: PlayerState) {
    if (ps.signs.length > 5) return

    const lane = Math.floor(Math.random() * 5)
    const lanePositions = getLanePositions(canvasWidth)

    const signTypes = Object.keys(SIGN_TYPES) as TrafficSignType[]
    const type = signTypes[Math.floor(Math.random() * signTypes.length)]

    ps.signs.push({
      id: crypto.randomUUID(),
      type,
      lane,
      x: lanePositions[lane] - 25,
      y: -100,
      width: 50,
      height: 50,
    })
  }

  private spawnEnemy(canvasWidth: number, ps: PlayerState) {
    if (ps.enemies.length > 12) return

    const lane = Math.floor(Math.random() * 5)
    const lanePositions = getLanePositions(canvasWidth)

    const tooClose = ps.enemies.some((e) => e.lane === lane && e.y < 150)
    if (tooClose && Math.random() < 0.9) return

    const colors = ["#e74c3c", "#3498db", "#9b59b6", "#2ecc71", "#f39c12", "#e67e22", "#1abc9c", "#d35400"]

    ps.enemies.push({
      id: crypto.randomUUID(),
      x: lanePositions[lane] - 35,
      y: -150 - Math.random() * 200,
      lane,
      width: 50 + Math.random() * 40,
      height: 80 + Math.random() * 60,
      speed: 0.7 + Math.random() * 1.8,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  /**
   * Check if it's time to show a trivia question.
   * Intervals depend on game mode (longer in 2P).
   */
  shouldShowTrivia(): boolean {
    const interval = gameState.gameMode === '2p'
      ? GAME_CONSTANTS.TRIVIA_INTERVAL_2P
      : GAME_CONSTANTS.TRIVIA_INTERVAL_1P

    if (this.triviaTimer - this.lastTriviaTime > interval) {
      this.lastTriviaTime = this.triviaTimer
      return true
    }
    return false
  }
}

export const spawnManager = new SpawnManager()
