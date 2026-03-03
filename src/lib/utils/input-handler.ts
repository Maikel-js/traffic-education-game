import { gameState } from "$lib/stores/game-state.svelte"
import { soundManager } from "./sound-manager.svelte"

class InputHandler {
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null

  init() {
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (!gameState.running || gameState.paused) return

      if (e.key === "ArrowLeft") {
        this.moveLane(-1)
      } else if (e.key === "ArrowRight") {
        this.moveLane(1)
      } else if (e.key === " ") {
        e.preventDefault()
        soundManager.playBeep()
      }
    }

    window.addEventListener("keydown", this.keydownHandler)
  }

  moveLane(direction: number) {
    const newLane = gameState.player.lane + direction
    if (newLane >= 0 && newLane <= 4) {
      gameState.player.lane = newLane
      soundManager.playBeep()
    }
  }

  cleanup() {
    if (this.keydownHandler) {
      window.removeEventListener("keydown", this.keydownHandler)
    }
  }
}

export const handleInput = new InputHandler()
