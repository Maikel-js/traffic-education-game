import { gameState, getLanePositions } from "$lib/stores/game-state.svelte"

export function renderGame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Draw sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
  skyGradient.addColorStop(0, "hsl(210, 70%, 20%)")
  skyGradient.addColorStop(1, "hsl(210, 80%, 10%)")
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height)

  drawBuildings(ctx, width, height)

  // Draw road
  const roadWidth = Math.min(width * 0.7, 450)
  const roadLeft = (width - roadWidth) / 2
  const roadTop = height * 0.15
  const roadHeight = height * 0.7

  ctx.fillStyle = "#2a2a2a"
  ctx.fillRect(roadLeft, roadTop, roadWidth, roadHeight)

  // Draw lane lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
  ctx.lineWidth = 4
  ctx.setLineDash([30, 20])

  for (let i = 1; i < 5; i++) {
    const x = roadLeft + (roadWidth / 5) * i
    ctx.beginPath()
    ctx.moveTo(x, roadTop)
    ctx.lineTo(x, roadTop + roadHeight)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Draw road edges
  ctx.strokeStyle = "hsl(48, 100%, 60%)"
  ctx.lineWidth = 6
  ctx.strokeRect(roadLeft, roadTop, roadWidth, roadHeight)

  const lanePositions = getLanePositions(width)

  for (const enemy of gameState.enemies) {
    const x = lanePositions[enemy.lane] - enemy.width / 2
    drawCar(ctx, x, enemy.y, enemy.width, enemy.height, enemy.color)
  }

  const playerX = lanePositions[gameState.player.lane] - gameState.player.width / 2
  const playerY = height * 0.75 - gameState.player.height / 2

  drawBus(ctx, playerX, playerY, gameState.player.width, gameState.player.height)

  if (gameState.invincible) {
    ctx.save()
    ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.3
    ctx.strokeStyle = "#FFD700"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.strokeRect(playerX - 5, playerY - 5, gameState.player.width + 10, gameState.player.height + 10)
    ctx.setLineDash([])
    ctx.restore()
  }
}

function drawBuildings(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)"

  const buildingCount = 8
  const baseSpacing = width / buildingCount
  const offset = (gameState.roadOffset * 0.2) % baseSpacing

  for (let i = 0; i < buildingCount; i++) {
    const x = i * baseSpacing + offset
    const buildingHeight = 30 + (i % 3) * 20
    const y = height * 0.12 - buildingHeight
    const buildingWidth = 40

    ctx.fillRect(x, y, buildingWidth, buildingHeight)

    // Simplified windows to save fillRect calls
    ctx.fillStyle = "rgba(255, 200, 50, 0.1)"
    ctx.fillRect(x + 10, y + 10, 20, 10)
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
  }
}

function drawCar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  ctx.save()

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
  ctx.fillRect(x + 8, y + height - 6, width - 16, 8)

  ctx.fillStyle = color
  roundRect(ctx, x, y, width, height, 8)
  ctx.fill()

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
  roundRect(ctx, x + 8, y + 8, width - 16, height * 0.25, 4)
  ctx.fill()

  ctx.fillStyle = "rgba(100, 150, 200, 0.8)"
  roundRect(ctx, x + 10, y + height * 0.35, width - 20, height * 0.2, 4)
  ctx.fill()

  ctx.fillStyle = "#333"
  ctx.fillRect(x - 3, y + height * 0.4, 6, 12)
  ctx.fillRect(x + width - 3, y + height * 0.4, 6, 12)

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x + 10, y + height * 0.38)
  ctx.lineTo(x + width - 10, y + height * 0.38)
  ctx.stroke()

  ctx.restore()
}

function drawBus(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.save()

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
  ctx.fillRect(x + 8, y + height + 2, width - 16, 8)

  ctx.fillStyle = "#FFD700"
  roundRect(ctx, x, y, width, height, 10)
  ctx.fill()

  ctx.strokeStyle = "#333"
  ctx.lineWidth = 2
  roundRect(ctx, x, y, width, height, 10)
  ctx.stroke()

  ctx.fillStyle = "#FFA500"
  roundRect(ctx, x + 5, y + 5, width - 10, height * 0.2, 6)
  ctx.fill()

  ctx.fillStyle = "rgba(100, 150, 200, 0.7)"
  roundRect(ctx, x + 12, y + height * 0.25, width - 24, height * 0.15, 5)
  ctx.fill()

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
  ctx.fillRect(x + 14, y + height * 0.27, width * 0.3, height * 0.08)

  ctx.fillStyle = "rgba(100, 150, 200, 0.6)"
  const windowCount = 4
  const windowSpacing = (height * 0.45) / windowCount

  for (let i = 0; i < windowCount; i++) {
    const windowY = y + height * 0.42 + i * windowSpacing
    ctx.fillRect(x + 6, windowY, 8, windowSpacing * 0.7)
    ctx.fillRect(x + width - 14, windowY, 8, windowSpacing * 0.7)
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
  ctx.fillRect(x + width / 2 - 1, y + height * 0.4, 2, height * 0.5)

  ctx.fillStyle = "#333"
  roundRect(ctx, x - 4, y + height * 0.3, 8, 14, 2)
  ctx.fill()
  roundRect(ctx, x + width - 4, y + height * 0.3, 8, 14, 2)
  ctx.fill()

  ctx.fillStyle = "#666"
  roundRect(ctx, x + width * 0.2, y + 2, width * 0.6, 5, 2)
  ctx.fill()

  ctx.fillStyle = "rgba(255, 255, 200, 0.9)"
  ctx.beginPath()
  ctx.arc(x + width * 0.3, y + 12, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width * 0.7, y + 12, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#e74c3c"
  ctx.fillRect(x + 8, y + height - 8, 10, 5)
  ctx.fillRect(x + width - 18, y + height - 8, 10, 5)

  ctx.fillStyle = "#333"
  ctx.font = "bold 11px Arial"
  ctx.textAlign = "center"
  ctx.fillText("ESCUELA", x + width / 2, y + height * 0.55)

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
  ctx.beginPath()
  ctx.arc(x + 15, y + height * 0.25, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width - 15, y + height * 0.25, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + 15, y + height * 0.85, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width - 15, y + height * 0.85, 8, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#1a1a1a"
  ctx.beginPath()
  ctx.arc(x + 15, y + height * 0.25, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width - 15, y + height * 0.25, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + 15, y + height * 0.85, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width - 15, y + height * 0.85, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}
