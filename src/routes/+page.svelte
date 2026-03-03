<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import GameCanvas from "$lib/components/GameCanvas.svelte";
	import GameHUD from "$lib/components/GameHUD.svelte";
	import StartScreen from "$lib/components/StartScreen.svelte";
	import PauseScreen from "$lib/components/PauseScreen.svelte";
	import GameOverScreen from "$lib/components/GameOverScreen.svelte";
	import TriviaModal from "$lib/components/TriviaModal.svelte";
	import MobileControls from "$lib/components/MobileControls.svelte";
	import EducationBreak from "$lib/components/EducationBreak.svelte";
	import ScoreEffects from "$lib/components/ScoreEffects.svelte";
	import {
		gameState,
		resetGame,
		togglePause,
	} from "$lib/stores/game-state.svelte";
	import { soundManager } from "$lib/utils/sound-manager.svelte";

	let gameStarted = $state(false);
	let showTrivia = $state(false);
	let currentTrivia = $state<any>(null);

	let gameRunning = $derived(gameState.running);
	let paused = $derived(gameState.paused);
	let lives = $derived(gameState.lives);

	let showGameOver = $derived(gameStarted && lives <= 0);

	async function handleStartGame() {
		await soundManager.unblockAudio();
		resetGame();
		gameStarted = true;
		gameState.running = true;
	}

	function handleRestart() {
		resetGame();
		gameStarted = true;
		gameState.running = true;
	}

	function handleShowTrivia(trivia: any) {
		showTrivia = true;
		currentTrivia = trivia;
		gameState.paused = true;
	}

	function handleTriviaAnswer() {
		showTrivia = false;
		currentTrivia = null;
		gameState.paused = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!gameStarted || !gameState.running) return;

		if (e.key === "p" || e.key === "P" || e.key === "Escape") {
			gameState.paused = !gameState.paused;
		}
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	onDestroy(() => {
		window.removeEventListener("keydown", handleKeyDown);
	});
</script>

<div class="game-container">
	{#if !gameStarted}
		<StartScreen onStart={handleStartGame} />
	{:else}
		<GameCanvas onShowTrivia={handleShowTrivia} />
		<GameHUD />
		<ScoreEffects />
		<MobileControls />

		<!-- Game over screen now shows when lives reach 0 -->
		{#if showGameOver}
			<GameOverScreen onRestart={handleRestart} />
		{:else if paused}
			<PauseScreen
				onResume={() => (gameState.paused = false)}
				onRestart={handleRestart}
			/>
		{/if}

		{#if gameState.showRestScreen}
			<EducationBreak />
		{/if}

		{#if showTrivia && currentTrivia}
			<TriviaModal trivia={currentTrivia} onAnswer={handleTriviaAnswer} />
		{/if}
	{/if}
</div>

<style>
	.game-container {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			180deg,
			hsl(210, 80%, 15%) 0%,
			hsl(210, 70%, 8%) 100%
		);
	}
</style>
