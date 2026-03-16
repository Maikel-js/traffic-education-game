<script lang="ts">
	import { gameState } from "$lib/stores/game-state.svelte";
	import { handleInput } from "$lib/utils/input-handler";
	import { onMount } from "svelte";

	let showControls = $state(false);

	let running = $derived(gameState.running);
	let gameOver = $derived(gameState.players.some(p => p.lives <= 0));
	let is2P = $derived(gameState.gameMode === '2p');

	function checkMobile() {
		showControls = window.innerWidth < 768;
	}

	function handleLeft(e: Event, playerIndex = 0) {
		e.preventDefault();
		handleInput.moveLane(playerIndex, -1);
	}

	function handleRight(e: Event, playerIndex = 0) {
		e.preventDefault();
		handleInput.moveLane(playerIndex, 1);
	}

	onMount(() => {
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	});
</script>

{#if showControls && running && !gameOver}
	<div class="mobile-controls" class:two-player={is2P}>
		{#if is2P}
			<!-- 2P mobile controls -->
			<div class="player-controls">
				<span class="player-mobile-label p1-label">J1</span>
				<button ontouchstart={(e) => handleLeft(e, 0)} onclick={(e) => handleLeft(e, 0)} class="control-btn p1-btn">◀</button>
				<button ontouchstart={(e) => handleRight(e, 0)} onclick={(e) => handleRight(e, 0)} class="control-btn p1-btn">▶</button>
			</div>
			<div class="player-controls">
				<span class="player-mobile-label p2-label">J2</span>
				<button ontouchstart={(e) => handleLeft(e, 1)} onclick={(e) => handleLeft(e, 1)} class="control-btn p2-btn">◀</button>
				<button ontouchstart={(e) => handleRight(e, 1)} onclick={(e) => handleRight(e, 1)} class="control-btn p2-btn">▶</button>
			</div>
		{:else}
			<button ontouchstart={(e) => handleLeft(e)} onclick={(e) => handleLeft(e)} class="control-btn">◀</button>
			<button ontouchstart={(e) => handleRight(e)} onclick={(e) => handleRight(e)} class="control-btn">▶</button>
		{/if}
	</div>
{/if}

<style>
	.mobile-controls {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 16px;
		z-index: 60;
	}

	.mobile-controls.two-player {
		gap: 0;
		left: 0;
		right: 0;
		transform: none;
		justify-content: space-between;
		padding: 0 20px;
		width: 100%;
	}

	.player-controls {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.player-mobile-label {
		font-size: 14px;
		font-weight: 900;
		padding: 4px 8px;
		border-radius: 6px;
	}

	.p1-label {
		color: #FFD700;
	}

	.p2-label {
		color: #00D4FF;
	}

	.control-btn {
		width: 80px;
		height: 80px;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		border: 3px solid rgba(255, 200, 50, 0.5);
		border-radius: 50%;
		color: hsl(48, 100%, 60%);
		font-size: 32px;
		font-weight: 800;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		-webkit-tap-highlight-color: transparent;
		user-select: none;
	}

	.p1-btn {
		border-color: rgba(255, 215, 0, 0.5);
		color: #FFD700;
	}

	.p2-btn {
		border-color: rgba(0, 212, 255, 0.5);
		color: #00D4FF;
	}

	.control-btn:active {
		transform: scale(0.9);
		background: rgba(255, 200, 50, 0.3);
	}
</style>
