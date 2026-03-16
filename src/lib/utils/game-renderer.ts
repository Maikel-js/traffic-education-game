import { gameState, getLanePositions } from "$lib/stores/game-state.svelte"
import { SIGN_TYPES, BACKGROUND_CONSTANTS, MULTIPLAYER_CONSTANTS } from "../constants"
import type { PlayerState } from "../types"

/**
 * Background scene manager — cycles animated backgrounds every 5 seconds.
 */
class BackgroundManager {
  private currentScene = 0
  private nextScene = 1
  private transitionAlpha = 0
  private isTransitioning = false
  private timer = 0
  private stars: { x: number; y: number; speed: number; size: number }[] = []

  constructor() {
    // Pre-generate starfield data
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random(),
        speed: 0.2 + Math.random() * 0.8,
        size: 0.5 + Math.random() * 2,
      })
    }
  }

  update(deltaTime: number) {
    this.timer += deltaTime

    if (this.isTransitioning) {
      this.transitionAlpha += deltaTime / BACKGROUND_CONSTANTS.TRANSITION_DURATION
      if (this.transitionAlpha >= 1) {
        this.transitionAlpha = 0
        this.isTransitioning = false
        this.currentScene = this.nextScene
        this.timer = 0
      }
    } else if (this.timer >= BACKGROUND_CONSTANTS.CYCLE_INTERVAL) {
      this.isTransitioning = true
      this.transitionAlpha = 0
      this.nextScene = (this.currentScene + 1) % BACKGROUND_CONSTANTS.SCENE_COUNT
    }

    // Animate stars
    for (const star of this.stars) {
      star.y += star.speed * deltaTime * 0.0003
      if (star.y > 1) star.y = 0
    }
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Draw current scene
    this.renderScene(ctx, this.currentScene, width, height, 1)

    // Draw transitioning scene on top with alpha
    if (this.isTransitioning) {
      this.renderScene(ctx, this.nextScene, width, height, this.transitionAlpha)
    }
  }

  private renderScene(ctx: CanvasRenderingContext2D, scene: number, w: number, h: number, alpha: number) {
    ctx.save()
    ctx.globalAlpha = alpha

    switch (scene) {
      case 0: this.drawStarfield(ctx, w, h); break
      case 1: this.drawCityNight(ctx, w, h); break
      case 2: this.drawSunset(ctx, w, h); break
      case 3: this.drawAurora(ctx, w, h); break
    }

    ctx.restore()
  }

  /** Scene 0: Parallax starfield */
  private drawStarfield(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, "hsl(240, 30%, 5%)")
    g.addColorStop(1, "hsl(260, 40%, 10%)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "#fff"
    for (const star of this.stars) {
      ctx.globalAlpha = 0.3 + star.speed * 0.5
      ctx.beginPath()
      ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  /** Scene 1: City night with skyline */
  private drawCityNight(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, "hsl(220, 60%, 8%)")
    g.addColorStop(0.5, "hsl(230, 50%, 12%)")
    g.addColorStop(1, "hsl(210, 70%, 6%)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Skyline silhouettes
    ctx.fillStyle = "rgba(20, 25, 40, 0.9)"
    const time = Date.now() * 0.001
    for (let i = 0; i < 12; i++) {
      const bx = (i / 12) * w - 10
      const bw = w / 12 + 20
      const bh = 30 + (i % 4) * 25 + Math.sin(i * 1.7) * 15
      ctx.fillRect(bx, h * 0.12 - bh, bw, bh)

      // Animated windows
      ctx.fillStyle = `rgba(255, 200, 50, ${0.15 + Math.sin(time + i * 0.5) * 0.1})`
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(bx + 8 + j * 12, h * 0.12 - bh + 8, 6, 4)
      }
      ctx.fillStyle = "rgba(20, 25, 40, 0.9)"
    }
  }

  /** Scene 2: Sunset gradient */
  private drawSunset(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, "hsl(280, 50%, 15%)")
    g.addColorStop(0.3, "hsl(340, 60%, 20%)")
    g.addColorStop(0.5, "hsl(20, 80%, 25%)")
    g.addColorStop(0.7, "hsl(40, 70%, 18%)")
    g.addColorStop(1, "hsl(210, 60%, 8%)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Sun glow
    const sunX = w * 0.5
    const sunY = h * 0.08
    const sunR = 25
    const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.3, sunX, sunY, sunR * 3)
    glow.addColorStop(0, "rgba(255, 150, 50, 0.5)")
    glow.addColorStop(0.5, "rgba(255, 100, 50, 0.15)")
    glow.addColorStop(1, "rgba(255, 50, 50, 0)")
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
  }

  /** Scene 3: Aurora effect */
  private drawAurora(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, "hsl(200, 40%, 6%)")
    g.addColorStop(1, "hsl(210, 50%, 10%)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // Animated aurora bands
    const time = Date.now() * 0.0005
    ctx.globalAlpha = 0.15
    for (let band = 0; band < 3; band++) {
      const hueShift = band * 40
      ctx.fillStyle = `hsl(${140 + hueShift + Math.sin(time + band) * 20}, 60%, 40%)`
      ctx.beginPath()
      ctx.moveTo(0, h * 0.05)
      for (let x = 0; x <= w; x += 20) {
        const y = h * (0.03 + band * 0.025) +
          Math.sin(x * 0.01 + time * 2 + band) * 12 +
          Math.sin(x * 0.005 + time) * 8
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h * 0.15)
      ctx.lineTo(0, h * 0.15)
      ctx.closePath()
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Stars behind aurora
    ctx.fillStyle = "#fff"
    for (let i = 0; i < 20; i++) {
      ctx.globalAlpha = 0.2 + Math.sin(time * 3 + i) * 0.15
      ctx.beginPath()
      ctx.arc(this.stars[i].x * w, this.stars[i].y * h * 0.3, 1, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}

const bgManager = new BackgroundManager()

/**
 * Main render entry point. Handles both 1P and 2P modes.
 */
export function renderGame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, deltaTime = 16) {
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Update and render animated background
  bgManager.update(deltaTime)
  bgManager.render(ctx, width, height)

  if (gameState.gameMode === '2p' && gameState.players.length === 2) {
    // Split-screen rendering
    const halfWidth = Math.floor(width / 2)

    // Player 1 — left half
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, halfWidth, height)
    ctx.clip()
    renderPlayerView(ctx, gameState.players[0], halfWidth, height, 0)
    ctx.restore()

    // Divider line
    ctx.strokeStyle = "rgba(255, 200, 50, 0.6)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(halfWidth, 0)
    ctx.lineTo(halfWidth, height)
    ctx.stroke()

    // Player labels
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = MULTIPLAYER_CONSTANTS.P1_COLOR
    ctx.fillText("JUGADOR 1", halfWidth * 0.5, height - 10)
    ctx.fillStyle = MULTIPLAYER_CONSTANTS.P2_COLOR
    ctx.fillText("JUGADOR 2", halfWidth + halfWidth * 0.5, height - 10)

    // Player 2 — right half
    ctx.save()
    ctx.beginPath()
    ctx.rect(halfWidth, 0, halfWidth, height)
    ctx.clip()
    ctx.translate(halfWidth, 0)
    renderPlayerView(ctx, gameState.players[1], halfWidth, height, 0)
    ctx.restore()
  } else {
    // Single-player rendering
    renderPlayerView(ctx, gameState.players[0], width, height, 0)
  }
}

/**
 * Renders a single player's road, enemies, signs, and bus.
 */
function renderPlayerView(
  ctx: CanvasRenderingContext2D,
  ps: PlayerState,
  width: number,
  height: number,
  offsetX: number
) {
  drawBuildings(ctx, width, height)

  // Draw road
  const roadWidth = Math.min(width * 0.7, 450)
  const roadLeft = (width - roadWidth) / 2
  const roadTop = height * 0.15
  const roadHeight = height * 0.7

  ctx.fillStyle = "#2a2a2a"
  ctx.fillRect(roadLeft, roadTop, roadWidth, roadHeight)

  // Draw lane lines (Batched)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
  ctx.lineWidth = 4
  ctx.setLineDash([30, 20])
  ctx.beginPath()
  for (let i = 1; i < 5; i++) {
    const x = roadLeft + (roadWidth / 5) * i
    ctx.moveTo(x, roadTop)
    ctx.lineTo(x, roadTop + roadHeight)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Draw road edges
  ctx.strokeStyle = "hsl(48, 100%, 60%)"
  ctx.lineWidth = 6
  ctx.strokeRect(roadLeft, roadTop, roadWidth, roadHeight)

  const lanePositions = getLanePositions(width)

  // Draw signs
  for (const sign of ps.signs) {
    drawSign(ctx, sign)
  }

  // Draw enemies
  for (const enemy of ps.enemies) {
    const x = lanePositions[enemy.lane] - enemy.width / 2
    drawCar(ctx, x, enemy.y, enemy.width, enemy.height, enemy.color)
  }

  // Draw player bus using smooth interpolated position
  const targetX = lanePositions[ps.player.lane] - ps.player.width / 2
  const smoothX = ps.displayX !== 0 ? ps.displayX : targetX
  const playerY = height * 0.75 - ps.player.height / 2

  // Color the bus differently per player in 2P mode
  const busColor = gameState.gameMode === '2p' && ps.id === 2 ? '#00D4FF' : '#FFD700'
  drawBus(ctx, smoothX, playerY, ps.player.width, ps.player.height, busColor)

  // Invincibility shield effect
  if (ps.invincible) {
    ctx.save()
    ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.3
    ctx.strokeStyle = "#FFD700"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.strokeRect(smoothX - 5, playerY - 5, ps.player.width + 10, ps.player.height + 10)
    ctx.setLineDash([])
    ctx.restore()
  }

  // Slow-mo overlay
  if (ps.slowMoTimer > 0) {
    ctx.save()
    ctx.fillStyle = "rgba(52, 152, 219, 0.15)"
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = "rgba(52, 152, 219, 0.5)"
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, width - 8, height - 8)
    ctx.restore()
  }
}

function drawBuildings(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const buildingCount = 8
  const baseSpacing = width / buildingCount
  const offset = (gameState.roadOffset * 0.2) % baseSpacing
  const roadTop = height * 0.12

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
  for (let i = 0; i < buildingCount; i++) {
    const x = i * baseSpacing + offset
    const buildingHeight = 30 + (i % 3) * 20
    const y = roadTop - buildingHeight
    const buildingWidth = 40

    ctx.fillRect(x, y, buildingWidth, buildingHeight)
    
    // Tiny performance gain: only draw windows if they are big enough or visible
    ctx.save()
    ctx.fillStyle = "rgba(255, 200, 50, 0.1)"
    ctx.fillRect(x + 10, y + 10, 20, 10)
    ctx.restore()
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

function drawBus(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, mainColor = '#FFD700') {
  ctx.save()

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
  ctx.fillRect(x + 8, y + height + 2, width - 16, 8)

  ctx.fillStyle = mainColor
  roundRect(ctx, x, y, width, height, 10)
  ctx.fill()

  ctx.strokeStyle = "#333"
  ctx.lineWidth = 2
  roundRect(ctx, x, y, width, height, 10)
  ctx.stroke()

  // Top accent
  const accentColor = mainColor === '#FFD700' ? '#FFA500' : '#0097B2'
  ctx.fillStyle = accentColor
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

  // Label
  ctx.fillStyle = "#333"
  ctx.font = "bold 11px Arial"
  ctx.textAlign = "center"
  const label = gameState.gameMode === '2p' ? (mainColor === '#FFD700' ? 'P1' : 'P2') : 'ESCUELA'
  ctx.fillText(label, x + width / 2, y + height * 0.55)

  // Wheels
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
  ctx.beginPath(); ctx.arc(x + 15, y + height * 0.25, 8, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + width - 15, y + height * 0.25, 8, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 15, y + height * 0.85, 8, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + width - 15, y + height * 0.85, 8, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = "#1a1a1a"
  ctx.beginPath(); ctx.arc(x + 15, y + height * 0.25, 6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + width - 15, y + height * 0.25, 6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 15, y + height * 0.85, 6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + width - 15, y + height * 0.85, 6, 0, Math.PI * 2); ctx.fill()

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

function drawSign(ctx: CanvasRenderingContext2D, sign: any) {
  const signData = SIGN_TYPES[sign.type as keyof typeof SIGN_TYPES];
  if (!signData) return;

  ctx.save();

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(sign.x + sign.width / 2 + 2, sign.y + sign.height + 30, 15, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Post
  ctx.fillStyle = "#95a5a6";
  ctx.fillRect(sign.x + sign.width / 2 - 2, sign.y + sign.height / 2, 4, 30);

  // Plate
  ctx.fillStyle = signData.color;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  if (sign.type === 'stop') {
    const r = sign.width / 2;
    const cx = sign.x + r;
    const cy = sign.y + r;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (sign.type === 'yield') {
    ctx.beginPath();
    ctx.moveTo(sign.x, sign.y);
    ctx.lineTo(sign.x + sign.width, sign.y);
    ctx.lineTo(sign.x + sign.width / 2, sign.y + sign.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(sign.x + sign.width / 2, sign.y + sign.height / 2, sign.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Symbol
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(signData.symbol, sign.x + sign.width / 2, sign.y + sign.height / 2);

  ctx.restore();
}
