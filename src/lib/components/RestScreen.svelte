<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { gameState } from "$lib/stores/game-state.svelte";
    import { fade, scale } from "svelte/transition";

    let timeLeft = $state(15);
    let timer: number;
    let breathingPhase = $state("in"); // "in" or "out"

    function startTimer() {
        timer = window.setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1;
            } else {
                clearInterval(timer);
                finishRest();
            }
        }, 1000);
    }

    function finishRest() {
        gameState.playTime = 0;
        gameState.showRestScreen = false;
        gameState.paused = false;
    }

    onMount(() => {
        startTimer();

        // Breathing animation cycle
        const breathingInterval = setInterval(() => {
            breathingPhase = breathingPhase === "in" ? "out" : "in";
        }, 4000);

        return () => {
            clearInterval(timer);
            clearInterval(breathingInterval);
        };
    });
</script>

<div class="rest-overlay" transition:fade={{ duration: 500 }}>
    <div class="particles">
        {#each Array(20) as _, i}
            <div
                class="particle"
                style="--delay: {i * 0.5}s; --left: {Math.random() *
                    100}%; --size: {Math.random() * 10 + 5}px"
            ></div>
        {/each}
    </div>
    <div class="content" in:scale={{ duration: 600, delay: 200, start: 0.8 }}>
        <h1>Momento de Descanso</h1>
        <p>
            Has completado 1 minuto de juego. Tómate un respiro para cuidar tu
            vista y postura.
        </p>

        <div class="breathing-container">
            <div class="breathing-circle {breathingPhase}"></div>
            <div class="breathing-text">
                {#if breathingPhase === "in"}
                    Inhala profunda y suavemente...
                {:else}
                    Exhala lentamente...
                {/if}
            </div>
        </div>

        <div class="timer-container">
            <div class="timer-ring">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" class="bg"></circle>
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        class="progress"
                        style="stroke-dashoffset: {283 - (timeLeft / 15) * 283}"
                    ></circle>
                </svg>
                <span class="time">{timeLeft}s</span>
            </div>
            <p>El juego continuará pronto</p>
        </div>
    </div>
</div>

<style>
    .rest-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10, 20, 30, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        color: white;
        text-align: center;
        font-family: "Inter", sans-serif;
    }

    .content {
        max-width: 500px;
        padding: 2rem;
    }

    h1 {
        font-size: 3.2rem;
        margin-bottom: 1rem;
        background: linear-gradient(
            135deg,
            #60efff 0%,
            #00ff87 50%,
            #60efff 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 900;
        animation: shine 3s linear infinite;
        text-transform: uppercase;
        letter-spacing: -1px;
    }

    @keyframes shine {
        to {
            background-position: 200% center;
        }
    }

    p {
        font-size: 1.1rem;
        color: #a0aec0;
        margin-bottom: 2.5rem;
        line-height: 1.6;
    }

    .breathing-container {
        position: relative;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 3rem;
    }

    .breathing-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(0, 255, 135, 0.4) 0%,
            rgba(96, 239, 255, 0.2) 100%
        );
        box-shadow:
            0 0 50px rgba(0, 255, 135, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
        transition:
            transform 4s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 4s ease-in-out,
            box-shadow 4s ease-in-out;
        border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .breathing-circle.in {
        transform: scale(1.8);
        opacity: 0.8;
    }

    .breathing-circle.out {
        transform: scale(1);
        opacity: 0.4;
    }

    .breathing-text {
        position: absolute;
        bottom: -20px;
        width: 100%;
        font-size: 1.2rem;
        font-weight: 500;
        color: #60efff;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .timer-ring {
        position: relative;
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        position: absolute;
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    circle {
        fill: none;
        stroke-width: 8;
        stroke-linecap: round;
    }

    circle.bg {
        stroke: rgba(255, 255, 255, 0.1);
    }

    circle.progress {
        stroke: #60efff;
        stroke-dasharray: 283;
        transition:
            stroke-dashoffset 1s linear,
            stroke 0.3s ease;
    }

    .time {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .timer-container p {
        margin-bottom: 0;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #60efff;
        opacity: 0.8;
    }

    .particles {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        top: -20px;
        left: var(--left);
        width: var(--size);
        height: var(--size);
        background: radial-gradient(circle, #60efff 0%, transparent 70%);
        border-radius: 50%;
        opacity: 0.3;
        animation: fall 10s linear infinite;
        animation-delay: var(--delay);
    }

    @keyframes fall {
        to {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
        }
    }
</style>
