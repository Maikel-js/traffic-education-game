<script lang="ts">
	import { onMount } from "svelte";

	let fps = $state(0);
	let lastTime = 0;
	let frames = 0;

	function update(time: number) {
		frames++;
		if (time > lastTime + 1000) {
			fps = Math.round((frames * 1000) / (time - lastTime));
			lastTime = time;
			frames = 0;
		}
		requestAnimationFrame(update);
	}

	onMount(() => {
		lastTime = performance.now();
		const frameId = requestAnimationFrame(update);
		return () => cancelAnimationFrame(frameId);
	});
</script>

<div class="fps-counter" class:low-fps={fps < 30}>
	FPS: {fps}
</div>

<style>
	.fps-counter {
		position: fixed;
		bottom: 10px;
		right: 10px;
		background: rgba(0, 0, 0, 0.6);
		color: #2ed573;
		padding: 4px 8px;
		border-radius: 4px;
		font-family: monospace;
		font-size: 12px;
		font-weight: bold;
		pointer-events: none;
		z-index: 1000;
        border: 1px solid rgba(46, 213, 115, 0.3);
	}

	.low-fps {
		color: #ff4757;
        border-color: rgba(255, 71, 87, 0.3);
	}
</style>
