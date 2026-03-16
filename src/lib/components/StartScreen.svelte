<script lang="ts">
	let { onStart } = $props<{ onStart: (mode: '1p' | '2p') => void }>();

	let selectedMode = $state<'1p' | '2p' | null>(null);

	function handleStart(mode: '1p' | '2p') {
		selectedMode = mode;
		onStart(mode);
	}
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
			<div class="feature">✓ Modo 2 jugadores local</div>
		</div>

		<div class="mode-buttons">
			<button onclick={() => handleStart('1p')} class="btn-start btn-1p">
				🎮 1 Jugador
			</button>
			<button onclick={() => handleStart('2p')} class="btn-start btn-2p">
				👥 2 Jugadores
			</button>
		</div>

		<div class="instructions">
			<h3>Controles:</h3>
			<div class="controls-grid">
				<div class="control-section">
					<div class="control-title">1 Jugador</div>
					<div class="control">← → ó A/D Cambiar carril</div>
					<div class="control">P / Esc Pausar</div>
					<div class="control">Espacio Bocina</div>
				</div>
				<div class="control-section">
					<div class="control-title">2 Jugadores</div>
					<div class="control player1-control">J1: A / D Cambiar carril</div>
					<div class="control player2-control">J2: ← / → Cambiar carril</div>
				</div>
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

	.mode-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
		margin-bottom: 24px;
	}

	.btn-start {
		color: hsl(210, 80%, 10%);
		border: none;
		padding: 18px 36px;
		border-radius: 12px;
		font-size: 22px;
		font-weight: 800;
		cursor: pointer;
		transition: all 0.3s;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.btn-1p {
		background: linear-gradient(135deg, hsl(48, 100%, 50%), hsl(48, 100%, 40%));
		box-shadow: 0 8px 24px rgba(255, 200, 50, 0.4);
	}

	.btn-2p {
		background: linear-gradient(135deg, hsl(190, 100%, 45%), hsl(190, 80%, 35%));
		box-shadow: 0 8px 24px rgba(0, 180, 220, 0.4);
	}

	.btn-start:hover {
		transform: scale(1.05) translateY(-2px);
	}

	.btn-1p:hover {
		box-shadow: 0 12px 32px rgba(255, 200, 50, 0.6);
	}

	.btn-2p:hover {
		box-shadow: 0 12px 32px rgba(0, 180, 220, 0.6);
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
		gap: 24px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.control-section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.control-title {
		font-size: 13px;
		font-weight: 800;
		color: hsl(48, 100%, 60%);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.control {
		background: rgba(0, 0, 0, 0.4);
		padding: 8px 16px;
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.9);
		font-size: 14px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.player1-control {
		border-color: rgba(255, 200, 50, 0.4);
		color: hsl(48, 100%, 75%);
	}

	.player2-control {
		border-color: rgba(0, 212, 255, 0.4);
		color: hsl(190, 100%, 75%);
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
			padding: 14px 24px;
			font-size: 18px;
		}

		.mode-buttons {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
