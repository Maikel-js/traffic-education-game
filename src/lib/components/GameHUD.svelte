<script lang="ts">
	import { gameState } from "$lib/stores/game-state.svelte";
	import { soundManager } from "$lib/utils/sound-manager.svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

	let paused = $derived(gameState.paused);
	let muted = $derived(soundManager.muted);
	let lives = $derived(gameState.lives);
	let scoreValue = $derived(gameState.score);
	let highScore = $derived(gameState.highScore);
	let combo = $derived(gameState.combo);
	let multiplier = $derived(gameState.multiplier);

	// Tweened score for smooth numbers
	const tweenedScore = tweened(0, {
		duration: 400,
		easing: cubicOut,
	});

	$effect(() => {
		tweenedScore.set(scoreValue);
	});

	function handlePause() {
		gameState.paused = !gameState.paused;
	}

	function toggleMute() {
		soundManager.toggleMute();
	}
</script>

<div class="hud-container">
	<div class="hud-left">
		<div class="hud-stat">
			<span class="stat-icon">❤️</span>
			<span class="stat-value">{lives}</span>
		</div>
		<div class="hud-stat">
			<span class="stat-icon">⭐</span>
			<!-- Using tweened score for smooth effects -->
			<span class="stat-value">{Math.floor($tweenedScore)}</span>
		</div>
		{#if combo > 1}
			<div
				class="hud-stat combo-stat"
				class:high-multiplier={multiplier >= 3}
			>
				<span class="combo-label">COMBO</span>
				<span class="combo-value">x{combo}</span>
				<div class="multiplier-tag">x{multiplier}</div>
			</div>
		{/if}
		<div class="hud-stat record-stat">
			<span class="stat-icon">🏆</span>
			<span class="stat-value">{Math.floor(highScore || 0)}</span>
		</div>
	</div>

	<div class="hud-right">
		<button
			onclick={handlePause}
			class="btn-hud"
			aria-label={paused ? "Continuar juego" : "Pausar juego"}
		>
			{paused ? "▶️" : "⏸️"}
		</button>
		<button
			onclick={toggleMute}
			class="btn-hud"
			aria-label={muted ? "Activar sonido" : "Desactivar sonido"}
		>
			{muted ? "🔇" : "🔊"}
		</button>
	</div>
</div>

<style>
	.hud-container {
		position: fixed;
		top: 20px;
		left: 20px;
		right: 20px;
		z-index: 50;
		pointer-events: none;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.hud-left {
		display: flex;
		gap: 12px;
		pointer-events: all;
	}

	.hud-stat {
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(255, 200, 50, 0.3);
		padding: 10px 16px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 80px;
	}

	.stat-icon {
		font-size: 24px;
	}

	.stat-value {
		color: white;
		font-size: 20px;
		font-weight: 800;
		font-family: monospace;
	}

	.record-stat {
		border-color: hsl(48, 100%, 60%);
	}

	.combo-stat {
		border-color: #34e7e4;
		flex-direction: column;
		padding: 4px 12px;
		min-width: 60px;
		animation: pulse 1s infinite alternate;
	}

	.high-multiplier {
		border-color: #ff5e5e;
		box-shadow: 0 0 15px rgba(255, 94, 94, 0.4);
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.05);
		}
	}

	.combo-label {
		font-size: 10px;
		color: #34e7e4;
		font-weight: 800;
	}

	.combo-value {
		font-size: 18px;
		color: white;
		font-weight: 900;
	}

	.multiplier-tag {
		background: #ff5e5e;
		color: white;
		font-size: 10px;
		padding: 1px 4px;
		border-radius: 4px;
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.hud-right {
		display: flex;
		gap: 8px;
		pointer-events: all;
	}

	.btn-hud {
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(255, 200, 50, 0.3);
		color: white;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		cursor: pointer;
		font-size: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.btn-hud:hover {
		background: rgba(255, 200, 50, 0.2);
		border-color: hsl(48, 100%, 60%);
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.hud-container {
			top: 10px;
			left: 10px;
			right: 10px;
		}

		.hud-left {
			gap: 8px;
		}

		.hud-stat {
			padding: 8px 12px;
			min-width: 70px;
		}

		.stat-icon {
			font-size: 20px;
		}

		.stat-value {
			font-size: 16px;
		}

		.btn-hud {
			width: 40px;
			height: 40px;
			font-size: 16px;
		}
	}
</style>
