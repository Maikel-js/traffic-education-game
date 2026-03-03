<script lang="ts">
	import { gameState } from "$lib/stores/game-state.svelte";
	import { handleInput } from "$lib/utils/input-handler";
	import { onMount } from "svelte";

	let showControls = $state(false);

	let running = $derived(gameState.running);
	let gameOver = $derived(gameState.lives <= 0);

	function checkMobile() {
		showControls = window.innerWidth < 768;
	}

	function handleLeft(e: Event) {
		e.preventDefault();
		handleInput.moveLane(-1);
	}

	function handleRight(e: Event) {
		e.preventDefault();
		handleInput.moveLane(1);
	}

	onMount(() => {
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	});
</script>

{#if showControls && running && !gameOver}
	<div class="mobile-controls">
		<button
			ontouchstart={handleLeft}
			onclick={handleLeft}
			class="control-btn"
		>
			◀
		</button>
		<button
			ontouchstart={handleRight}
			onclick={handleRight}
			class="control-btn"
		>
			▶
		</button>
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

	.control-btn:active {
		transform: scale(0.9);
		background: rgba(255, 200, 50, 0.3);
	}
</style>
