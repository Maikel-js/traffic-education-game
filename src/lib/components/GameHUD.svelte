<script lang="ts">
	import { gameState } from "$lib/stores/game-state.svelte";
	import { soundManager } from "$lib/utils/sound-manager.svelte";
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import { MULTIPLAYER_CONSTANTS } from "$lib/constants";

	let paused = $derived(gameState.paused);
	let muted = $derived(soundManager.muted);
	let is2P = $derived(gameState.gameMode === '2p');
	let players = $derived(gameState.players);

	// Tweened scores for smooth numbers
	const tweenedScore1 = tweened(0, { duration: 400, easing: cubicOut });
	const tweenedScore2 = tweened(0, { duration: 400, easing: cubicOut });

	$effect(() => {
		tweenedScore1.set(players[0]?.score || 0);
	});

	$effect(() => {
		if (players.length > 1) {
			tweenedScore2.set(players[1]?.score || 0);
		}
	});

	function handlePause() {
		gameState.paused = !gameState.paused;
	}

	function toggleMute() {
		soundManager.toggleMute();
	}
</script>

<div class="hud-container" class:two-player={is2P}>
	{#if is2P}
		<!-- 2-Player HUD -->
		<div class="hud-left">
			<div class="player-hud p1-hud">
				<div class="player-label" style="color: {MULTIPLAYER_CONSTANTS.P1_COLOR}">J1</div>
				<div class="hud-stat">
					<span class="stat-icon">❤️</span>
					<span class="stat-value">{players[0]?.lives ?? 0}</span>
				</div>
				<div class="hud-stat">
					<span class="stat-icon">⭐</span>
					<span class="stat-value">{Math.floor($tweenedScore1)}</span>
				</div>
				{#if (players[0]?.combo ?? 0) > 1}
					<div class="hud-stat combo-stat" class:high-multiplier={(players[0]?.multiplier ?? 1) >= 3}>
						<span class="combo-label">COMBO</span>
						<span class="combo-value">x{players[0]?.combo}</span>
						<div class="multiplier-tag">x{players[0]?.multiplier}</div>
					</div>
				{/if}
			</div>
		</div>

		<div class="hud-center">
			<button onclick={handlePause} class="btn-hud" aria-label={paused ? "Continuar juego" : "Pausar juego"}>
				{paused ? "▶️" : "⏸️"}
			</button>
			<button onclick={toggleMute} class="btn-hud" aria-label={muted ? "Activar sonido" : "Desactivar sonido"}>
				{muted ? "🔇" : "🔊"}
			</button>
		</div>

		<div class="hud-right">
			<div class="player-hud p2-hud">
				<div class="player-label" style="color: {MULTIPLAYER_CONSTANTS.P2_COLOR}">J2</div>
				<div class="hud-stat">
					<span class="stat-icon">❤️</span>
					<span class="stat-value">{players[1]?.lives ?? 0}</span>
				</div>
				<div class="hud-stat">
					<span class="stat-icon">⭐</span>
					<span class="stat-value">{Math.floor($tweenedScore2)}</span>
				</div>
				{#if (players[1]?.combo ?? 0) > 1}
					<div class="hud-stat combo-stat" class:high-multiplier={(players[1]?.multiplier ?? 1) >= 3}>
						<span class="combo-label">COMBO</span>
						<span class="combo-value">x{players[1]?.combo}</span>
						<div class="multiplier-tag">x{players[1]?.multiplier}</div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- 1-Player HUD (original) -->
		<div class="hud-left">
			<div class="hud-stat">
				<span class="stat-icon">❤️</span>
				<span class="stat-value">{players[0]?.lives ?? 0}</span>
			</div>
			<div class="hud-stat">
				<span class="stat-icon">⭐</span>
				<span class="stat-value">{Math.floor($tweenedScore1)}</span>
			</div>
			{#if (players[0]?.combo ?? 0) > 1}
				<div
					class="hud-stat combo-stat"
					class:high-multiplier={(players[0]?.multiplier ?? 1) >= 3}
				>
					<span class="combo-label">COMBO</span>
					<span class="combo-value">x{players[0]?.combo}</span>
					<div class="multiplier-tag">x{players[0]?.multiplier}</div>
				</div>
			{/if}
			<div class="hud-stat record-stat">
				<span class="stat-icon">🏆</span>
				<span class="stat-value">{Math.floor(players[0]?.highScore || 0)}</span>
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
	{/if}
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

	.hud-right {
		display: flex;
		gap: 8px;
		pointer-events: all;
	}

	.hud-center {
		display: flex;
		gap: 8px;
		pointer-events: all;
	}

	.player-hud {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	.player-label {
		font-size: 14px;
		font-weight: 900;
		padding: 10px 8px;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
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

	.p2-hud .hud-stat {
		border-color: rgba(0, 212, 255, 0.3);
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
		position: relative;
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

		.two-player .hud-stat {
			padding: 6px 8px;
			min-width: 50px;
		}

		.two-player .stat-icon {
			font-size: 16px;
		}

		.two-player .stat-value {
			font-size: 14px;
		}
	}
</style>
