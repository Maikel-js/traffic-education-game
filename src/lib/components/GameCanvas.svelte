<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { gameState, updateGame } from "$lib/stores/game-state.svelte";
	import { renderGame } from "$lib/utils/game-renderer";
	import { handleInput } from "$lib/utils/input-handler";
	import { spawnManager } from "$lib/utils/spawn-manager";
	import { triviaQuestions } from "$lib/data/trivia-questions";

	let { onShowTrivia, onGameOver } = $props<{
		onShowTrivia: (trivia: any) => void;
		onGameOver?: () => void;
	}>();
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;
	let lastTime = 0;
	let previousLives = 3;

	function resize() {
		if (!canvas) return;
		const container = canvas.parentElement;
		if (container) {
			canvas.width = Math.min(container.clientWidth, 1200);
			canvas.height = Math.min(container.clientHeight, 800);
		}
	}

	function gameLoop(timestamp: number) {
		if (gameState.lives <= 0 && previousLives > 0) {
			previousLives = 0;
			if (onGameOver) {
				onGameOver();
			}
			// Cancel animation and stop loop
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			return;
		}

		if (!gameState.running || gameState.paused) {
			animationId = requestAnimationFrame(gameLoop);
			return;
		}

		const deltaTime = Math.min(timestamp - lastTime, 100);
		lastTime = timestamp;

		if (canvas && gameState.running && !gameState.paused) {
			updateGame(deltaTime, canvas.width, canvas.height);
		}

		previousLives = gameState.lives;

		if (canvas) {
			spawnManager.update(deltaTime, canvas.width);
		}

		// Check if we should show trivia
		if (spawnManager.shouldShowTrivia()) {
			const trivia =
				triviaQuestions[
					Math.floor(Math.random() * triviaQuestions.length)
				];
			onShowTrivia(trivia);
		}

		// Render
		if (ctx && canvas) {
			renderGame(ctx, canvas);
		}

		animationId = requestAnimationFrame(gameLoop);
	}

	onMount(() => {
		ctx = canvas.getContext("2d")!;
		resize();
		window.addEventListener("resize", resize);

		// Setup input handlers
		handleInput.init();

		lastTime = performance.now();
		previousLives = gameState.lives;
		animationId = requestAnimationFrame(gameLoop);
	});

	onDestroy(() => {
		window.removeEventListener("resize", resize);
		handleInput.cleanup();
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});
</script>

<canvas bind:this={canvas} class="game-canvas"></canvas>

<style>
	.game-canvas {
		display: block;
		max-width: 1200px;
		max-height: 800px;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
	}
</style>
