<script lang="ts">
	let { onStart } = $props<{ onStart: () => void }>();
</script>

<div class="screen-overlay">
	<div class="content">
		<div class="logo">
			<div class="bus-icon">🚌</div>
			<h1>Conduce Seguro RD</h1>
		</div>
		
		<p class="subtitle">Aprende educación vial mientras conduces</p>
		
		<div class="features">
			<div class="feature">✓ 50+ preguntas de educación vial</div>
			<div class="feature">✓ 5 carriles de acción</div>
			<div class="feature">✓ Aprende las leyes de tránsito</div>
		</div>

		<button onclick={onStart} class="btn-start">
			Comenzar a Jugar
		</button>

		<div class="instructions">
			<h3>Controles:</h3>
			<div class="controls-grid">
				<div class="control">← → Cambiar carril</div>
				<div class="control">P Pausar</div>
				<div class="control">Espacio Bocina</div>
			</div>
		</div>

		<div class="edu-badge">
			🎓 Juego Educativo Oficial
		</div>
	</div>
</div>

<style>
	.screen-overlay {
		position: fixed;
		inset: 0;
		background: linear-gradient(135deg, hsl(210, 80%, 15%) 0%, hsl(210, 70%, 8%) 50%, hsl(48, 80%, 20%) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		animation: fadeIn 0.4s ease-out;
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
		max-width: 600px;
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

	.logo {
		margin-bottom: 24px;
	}

	.bus-icon {
		font-size: 80px;
		margin-bottom: 16px;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	h1 {
		font-size: 48px;
		font-weight: 900;
		color: hsl(48, 100%, 60%);
		margin: 0;
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	}

	.subtitle {
		font-size: 20px;
		color: rgba(255, 255, 255, 0.9);
		margin: 16px 0 32px;
	}

	.features {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 32px;
	}

	.feature {
		background: rgba(255, 200, 50, 0.1);
		padding: 12px 24px;
		border-radius: 8px;
		color: hsl(48, 100%, 80%);
		font-weight: 600;
		border: 1px solid rgba(255, 200, 50, 0.3);
	}

	.btn-start {
		background: linear-gradient(135deg, hsl(48, 100%, 50%), hsl(48, 100%, 40%));
		color: hsl(210, 80%, 10%);
		border: none;
		padding: 18px 48px;
		border-radius: 12px;
		font-size: 24px;
		font-weight: 800;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 8px 24px rgba(255, 200, 50, 0.4);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.btn-start:hover {
		transform: scale(1.05) translateY(-2px);
		box-shadow: 0 12px 32px rgba(255, 200, 50, 0.6);
	}

	.instructions {
		margin-top: 40px;
		padding-top: 32px;
		border-top: 2px solid rgba(255, 255, 255, 0.1);
	}

	.instructions h3 {
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 16px;
		font-size: 16px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.controls-grid {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.control {
		background: rgba(0, 0, 0, 0.4);
		padding: 8px 16px;
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.9);
		font-size: 14px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.edu-badge {
		margin-top: 32px;
		padding: 12px 24px;
		background: rgba(0, 200, 100, 0.2);
		border: 2px solid rgba(0, 200, 100, 0.5);
		border-radius: 24px;
		color: rgb(100, 255, 180);
		font-weight: 700;
		display: inline-block;
	}

	@media (max-width: 768px) {
		.content {
			padding: 20px;
		}

		h1 {
			font-size: 36px;
		}

		.btn-start {
			padding: 14px 32px;
			font-size: 20px;
		}
	}
</style>
