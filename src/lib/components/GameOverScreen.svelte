<script lang="ts">
	import { gameState } from "$lib/stores/game-state.svelte";

	let { onRestart } = $props<{ onRestart: () => void }>();

	let score = $derived(gameState.score);
	let highScore = $derived(gameState.highScore);
	let isNewRecord = $derived(score >= highScore && score > 0);

	function handleShare() {
		const text = `¡Obtuve ${Math.floor(score)} puntos en el Juego de Educación Vial! 🚌🇩🇴`;
		if (navigator.share) {
			navigator.share({ title: "Juego de Educación Vial", text });
		} else {
			navigator.clipboard.writeText(text);
			alert("¡Puntaje copiado al portapapeles!");
		}
	}
</script>

<div class="screen-overlay">
	<div class="content">
		<div class="game-over-icon">💥</div>
		<h2>¡Juego Terminado!</h2>

		<div class="final-stats">
			{#if isNewRecord}
				<div class="new-record-badge">🏆 ¡NUEVO RÉCORD! 🏆</div>
			{/if}
			<div class="stat-group">
				<div class="stat-item">
					<div class="stat-label">Puntos Finales</div>
					<div class="stat-value">{Math.floor(score)}</div>
				</div>
				<div class="stat-item">
					<div class="stat-label">Mejor Récord</div>
					<div class="stat-value secondary">
						{Math.floor(highScore)}
					</div>
				</div>
			</div>
		</div>

		<div class="button-group">
			<button onclick={onRestart} class="btn-primary">
				Jugar de Nuevo
			</button>
			<button onclick={handleShare} class="btn-secondary">
				Compartir 📱
			</button>
		</div>
	</div>
</div>

<style>
	.screen-overlay {
		position: fixed;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(0, 0, 0, 0.95) 0%,
			rgba(20, 20, 50, 0.95) 100%
		);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		animation: fadeIn 0.4s ease-out;
		overflow-y: auto;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.content {
		text-align: center;
		max-width: 500px;
		padding: 40px;
		animation: slideUp 0.6s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.game-over-icon {
		font-size: 72px;
		margin-bottom: 16px;
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-10px) rotate(-5deg);
		}
		75% {
			transform: translateX(10px) rotate(5deg);
		}
	}

	h2 {
		font-size: 42px;
		font-weight: 900;
		color: hsl(0, 80%, 60%);
		margin: 0 0 32px;
	}

	.final-stats {
		background: rgba(255, 200, 50, 0.1);
		border: 2px solid rgba(255, 200, 50, 0.3);
		border-radius: 16px;
		padding: 24px;
		margin-bottom: 24px;
	}

	.stat-group {
		display: flex;
		justify-content: space-around;
		gap: 20px;
	}

	.stat-item {
		flex: 1;
	}

	.stat-value {
		font-size: 36px;
		font-weight: 900;
		color: hsl(48, 100%, 60%);
	}

	.stat-value.secondary {
		color: rgba(255, 255, 255, 0.8);
		font-size: 28px;
	}

	.new-record-badge {
		background: hsl(48, 100%, 50%);
		color: hsl(210, 80%, 10%);
		padding: 8px 16px;
		border-radius: 20px;
		font-weight: 900;
		font-size: 14px;
		margin-bottom: 16px;
		display: inline-block;
		animation: pulse 1s infinite;
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

	.stat-label {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 8px;
	}

	.button-group {
		display: flex;
		gap: 16px;
		justify-content: center;
		margin-bottom: 32px;
	}

	button {
		padding: 14px 32px;
		border-radius: 10px;
		font-size: 18px;
		font-weight: 700;
		cursor: pointer;
		border: none;
		transition: all 0.3s;
	}

	.btn-primary {
		background: linear-gradient(
			135deg,
			hsl(48, 100%, 50%),
			hsl(48, 100%, 40%)
		);
		color: hsl(210, 80%, 10%);
		box-shadow: 0 4px 16px rgba(255, 200, 50, 0.4);
	}

	.btn-primary:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(255, 200, 50, 0.6);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.content {
			padding: 20px;
		}

		h2 {
			font-size: 32px;
		}

		.stat-value {
			font-size: 30px;
		}
	}
</style>
