<script lang="ts">
	let { onResume, onRestart } = $props<{
		onResume: () => void;
		onRestart: () => void;
	}>();
</script>

<div class="screen-overlay">
	<div class="content">
		<h2>⏸️ Juego Pausado</h2>
		<p>Tómate un descanso</p>

		<div class="button-group">
			<button onclick={onResume} class="btn-primary">
				Continuar
			</button>
			<button onclick={onRestart} class="btn-secondary">
				Reiniciar
			</button>
		</div>
	</div>
</div>

<style>
	.screen-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		animation: fadeIn 0.2s ease-out;
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
		padding: 40px;
		animation: scaleIn 0.3s ease-out;
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	h2 {
		font-size: 42px;
		font-weight: 800;
		color: hsl(48, 100%, 60%);
		margin: 0 0 16px;
	}

	p {
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 32px;
	}

	.button-group {
		display: flex;
		gap: 16px;
		justify-content: center;
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
		background: linear-gradient(135deg, hsl(48, 100%, 50%), hsl(48, 100%, 40%));
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
</style>
