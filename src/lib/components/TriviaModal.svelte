<script lang="ts">
	import type { TriviaQuestion } from "$lib/types";
	import { addScore, removeLife } from "$lib/stores/game-state.svelte";
	import { soundManager } from "$lib/utils/sound-manager.svelte";

	let { trivia, onAnswer } = $props<{
		trivia: TriviaQuestion;
		onAnswer: () => void;
	}>();

	let answered = $state(false);
	let selectedIndex = $state(-1);

	function handleAnswer(index: number) {
		selectedIndex = index;
		answered = true;

		if (index === trivia.correctIndex) {
			addScore(300);
			soundManager.playCorrectAnswer();
		} else {
			removeLife();
			soundManager.playWrongAnswer();
		}

		// Auto-close after 4 seconds to allow reading the explanation
		setTimeout(() => {
			onAnswer();
		}, 4000);
	}
</script>

<div class="modal-overlay">
	<div class="modal-content">
		<div class="modal-header">
			<div class="trivia-icon">🚦</div>
			<h3>Pregunta de Educación Vial</h3>
		</div>

		<div class="question">
			{trivia.question}
		</div>

		<div class="options">
			{#each trivia.options as option, i}
				<button
					onclick={() => handleAnswer(i)}
					class="option-btn"
					class:correct={answered && i === trivia.correctIndex}
					class:incorrect={answered &&
						i === selectedIndex &&
						i !== trivia.correctIndex}
					disabled={answered}
				>
					<span class="option-letter"
						>{String.fromCharCode(65 + i)}</span
					>
					<span class="option-text">{option}</span>
					{#if answered && i === trivia.correctIndex}
						<span class="result-icon">✓</span>
					{:else if answered && i === selectedIndex && i !== trivia.correctIndex}
						<span class="result-icon">✗</span>
					{/if}
				</button>
			{/each}
		</div>

		{#if !answered}
			<div class="trivia-tip">
				💡 Selecciona la respuesta correcta para ganar 300 puntos
			</div>
		{:else if selectedIndex === trivia.correctIndex}
			<div class="feedback correct-feedback">
				<p>🎉 ¡Correcto! +300 puntos</p>
				{#if trivia.explanation}
					<p class="explanation-text">{trivia.explanation}</p>
				{/if}
			</div>
		{:else}
			<div class="feedback incorrect-feedback">
				<p>
					❌ Incorrecto. -1 vida. La respuesta correcta es: {trivia
						.options[trivia.correctIndex]}
				</p>
				{#if trivia.explanation}
					<p class="explanation-text">{trivia.explanation}</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 300;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		background: linear-gradient(
			135deg,
			hsl(210, 70%, 12%) 0%,
			hsl(210, 60%, 8%) 100%
		);
		border: 3px solid hsl(48, 100%, 60%);
		border-radius: 20px;
		padding: 32px;
		max-width: 600px;
		width: 90%;
		animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.modal-header {
		text-align: center;
		margin-bottom: 24px;
	}

	.trivia-icon {
		font-size: 56px;
		margin-bottom: 12px;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	h3 {
		font-size: 24px;
		font-weight: 800;
		color: hsl(48, 100%, 60%);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.question {
		background: rgba(255, 200, 50, 0.1);
		border: 2px solid rgba(255, 200, 50, 0.3);
		border-radius: 12px;
		padding: 20px;
		font-size: 20px;
		font-weight: 700;
		color: white;
		text-align: center;
		margin-bottom: 24px;
		line-height: 1.5;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.option-btn {
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 16px 20px;
		display: flex;
		align-items: center;
		gap: 16px;
		cursor: pointer;
		transition: all 0.3s;
		text-align: left;
		position: relative;
	}

	.option-btn:not(:disabled):hover {
		background: rgba(255, 200, 50, 0.2);
		border-color: hsl(48, 100%, 60%);
		transform: translateX(8px);
	}

	.option-btn:disabled {
		cursor: default;
	}

	.option-btn.correct {
		background: rgba(0, 200, 100, 0.2);
		border-color: rgb(0, 200, 100);
		animation: correctPulse 0.5s ease-out;
	}

	.option-btn.incorrect {
		background: rgba(200, 0, 0, 0.2);
		border-color: rgb(200, 0, 0);
		animation: shake 0.5s ease-out;
	}

	@keyframes correctPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-8px);
		}
		75% {
			transform: translateX(8px);
		}
	}

	.option-letter {
		background: hsl(48, 100%, 60%);
		color: hsl(210, 80%, 10%);
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 18px;
		flex-shrink: 0;
	}

	.option-text {
		color: white;
		font-size: 16px;
		font-weight: 600;
		flex: 1;
	}

	.result-icon {
		font-size: 24px;
		font-weight: 800;
	}

	.trivia-tip {
		text-align: center;
		padding: 12px;
		background: rgba(100, 150, 255, 0.1);
		border: 2px solid rgba(100, 150, 255, 0.3);
		border-radius: 8px;
		color: rgb(150, 200, 255);
		font-weight: 600;
	}

	.feedback {
		text-align: center;
		padding: 16px;
		border-radius: 8px;
		font-weight: 700;
		font-size: 16px;
		animation: slideUp 0.4s ease-out;
	}

	.explanation-text {
		margin-top: 12px;
		font-weight: 400;
		font-size: 14px;
		font-style: italic;
		line-height: 1.4;
		opacity: 0.9;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.correct-feedback {
		background: rgba(0, 200, 100, 0.2);
		border: 2px solid rgba(0, 200, 100, 0.5);
		color: rgb(100, 255, 180);
	}

	.incorrect-feedback {
		background: rgba(200, 0, 0, 0.2);
		border: 2px solid rgba(200, 0, 0, 0.5);
		color: rgb(255, 150, 150);
	}

	@media (max-width: 768px) {
		.modal-content {
			padding: 24px;
		}

		h3 {
			font-size: 20px;
		}

		.question {
			font-size: 18px;
			padding: 16px;
		}

		.option-btn {
			padding: 12px 16px;
		}

		.option-text {
			font-size: 14px;
		}

		.feedback {
			font-size: 14px;
		}
	}
</style>
