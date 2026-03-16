import { gameState } from "$lib/stores/game-state.svelte"
import { soundManager } from "./sound-manager.svelte"
import { MULTIPLAYER_CONSTANTS } from "../constants"

/**
 * Input handler supporting both 1P and 2P modes.
 * 1P: Arrow keys + WASD both control player 0.
 * 2P: A/D = player 0, Arrow keys = player 1.
 */
class InputHandler {
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null

  init() {
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (!gameState.running || gameState.paused) return

      const is2P = gameState.gameMode === '2p'

      // Player 1 controls (always: A/D; in 1P mode also arrows)
      if (e.key === MULTIPLAYER_CONSTANTS.P1_KEYS.left || e.key === MULTIPLAYER_CONSTANTS.P1_KEYS.left.toUpperCase()) {
        this.moveLane(0, -1)
      } else if (e.key === MULTIPLAYER_CONSTANTS.P1_KEYS.right || e.key === MULTIPLAYER_CONSTANTS.P1_KEYS.right.toUpperCase()) {
        this.moveLane(0, 1)
      }

      // Arrow keys
      if (e.key === 'ArrowLeft') {
        this.moveLane(is2P ? 1 : 0, -1)
      } else if (e.key === 'ArrowRight') {
        this.moveLane(is2P ? 1 : 0, 1)
      }

      // Horn (spacebar)
      if (e.key === " ") {
        e.preventDefault()
        soundManager.playBeep()
      }
    }

    window.addEventListener("keydown", this.keydownHandler)
  }

  /**
   * Move a player's lane in the given direction.
   * @param playerIndex - 0 for P1, 1 for P2
   * @param direction - -1 for left, 1 for right
   */
  moveLane(playerIndex: number, direction: number) {
    const ps = gameState.players[playerIndex]
    if (!ps) return

    const newLane = ps.player.lane + direction
    if (newLane >= 0 && newLane <= 4) {
      ps.player.lane = newLane
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
