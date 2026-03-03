import { gameState, getLanePositions } from "$lib/stores/game-state.svelte"

class SpawnManager {
  private spawnTimer = 0
  private triviaTimer = 0
  private lastTriviaTime = 0

  update(deltaTime: number, canvasWidth: number) {
    const dt = deltaTime / 16

    this.spawnTimer += dt
    this.triviaTimer += dt

    const spawnInterval = 20
    if (this.spawnTimer > spawnInterval) {
      this.spawnTimer = 0
      if (Math.random() < 0.85) {
        this.spawnEnemy(canvasWidth)
      }
    }
  }

  private spawnEnemy(canvasWidth: number) {
    if (gameState.enemies.length > 12) return

    const lane = Math.floor(Math.random() * 5)
    const lanePositions = getLanePositions(canvasWidth)

    const tooClose = gameState.enemies.some((e) => e.lane === lane && e.y < 150)
    if (tooClose && Math.random() < 0.9) return

    const colors = ["#e74c3c", "#3498db", "#9b59b6", "#2ecc71", "#f39c12", "#e67e22", "#1abc9c", "#d35400"]

    gameState.enemies.push({
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

  shouldShowTrivia(): boolean {
    if (this.triviaTimer - this.lastTriviaTime > 1200) {
      this.lastTriviaTime = this.triviaTimer
      return true
    }
    return false
  }
}

export const spawnManager = new SpawnManager()
