<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { gameState } from "$lib/stores/game-state.svelte";
    import { GAME_CONSTANTS, SAFETY_TIPS } from "$lib/constants";
    import { fade, scale, fly } from "svelte/transition";
    import { elasticOut, cubicOut } from "svelte/easing";

    let timeLeft = $state(GAME_CONSTANTS.BREAK_SCENE_DURATION);
    let timer: number;

    // Choose a random tip each time it opens
    const currentTip = $derived(
        SAFETY_TIPS[Math.floor(Date.now() / 1000) % SAFETY_TIPS.length],
    );

    function startTimer() {
        timer = window.setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1;
            } else {
                clearInterval(timer);
                resumeGame();
            }
        }, 1000);
    }

    function resumeGame() {
        gameState.playTime = 0;
        gameState.showRestScreen = false; // We reuse this flag for simplicity or rename it later
        gameState.paused = false;
    }

    onMount(() => {
        startTimer();
    });

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

{#if gameState.showRestScreen}
    <div class="education-overlay" transition:fade={{ duration: 400 }}>
        <!-- Background decorative elements -->
        <div class="decoration signs">
            <div class="floating-sign stop">🛑</div>
            <div class="floating-sign warning">⚠️</div>
            <div class="floating-sign speed">80</div>
            <div class="floating-sign bump">〰</div>
        </div>

        <div
            class="glass-container"
            in:scale={{ duration: 800, easing: elasticOut, start: 0.5 }}
        >
            <div class="header">
                <span class="badge">CONSEJO VIAL</span>
                <div class="icon-main">{currentTip.icon}</div>
                <h2>{currentTip.title}</h2>
            </div>

            <div class="divider"></div>

            <div
                class="message"
                in:fly={{ y: 20, delay: 400, duration: 600, easing: cubicOut }}
            >
                <p>{currentTip.text}</p>
            </div>

            <div class="footer">
                <div class="countdown">
                    <svg class="progress-ring" width="60" height="60">
                        <circle
                            class="progress-ring__circle-bg"
                            stroke="rgba(255,255,255,0.1)"
                            stroke-width="4"
                            fill="transparent"
                            r="26"
                            cx="30"
                            cy="30"
                        />
                        <circle
                            class="progress-ring__circle"
                            stroke="#00d2ff"
                            stroke-width="4"
                            stroke-dasharray={2 * Math.PI * 26}
                            stroke-dashoffset={2 *
                                Math.PI *
                                26 *
                                (1 -
                                    timeLeft /
                                        GAME_CONSTANTS.BREAK_SCENE_DURATION)}
                            fill="transparent"
                            r="26"
                            cx="30"
                            cy="30"
                        />
                    </svg>
                    <span class="timer-text">{timeLeft}</span>
                </div>
                <div class="resume-info">
                    <span>EL JUEGO SE REANUDA EN BREVE</span>
                    <div class="progress-bar-flat">
                        <div
                            class="fill"
                            style="width: {100 -
                                (timeLeft /
                                    GAME_CONSTANTS.BREAK_SCENE_DURATION) *
                                    100}%"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="marketing-footer">
            <p>Aprender salva vidas. <span>#ConduceSeguro</span></p>
        </div>
    </div>
{/if}

<style>
    .education-overlay {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            circle at center,
            rgba(15, 23, 42, 0.95) 0%,
            rgba(2, 6, 23, 1) 100%
        );
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        overflow: hidden;
        font-family: "Outfit", "Inter", sans-serif;
    }

    .glass-container {
        position: relative;
        width: 90%;
        max-width: 500px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 32px;
        padding: 40px;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 0 80px rgba(255, 255, 255, 0.02);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    .header {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .badge {
        background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
        padding: 4px 16px;
        border-radius: 100px;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 2px;
        color: white;
        box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
    }

    .icon-main {
        font-size: 4rem;
        margin: 10px 0;
        filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
        animation: float 3s ease-in-out infinite;
    }

    h2 {
        font-size: 2.2rem;
        font-weight: 900;
        margin: 0;
        background: linear-gradient(to bottom, #ffffff, #94a3b8);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.1;
    }

    .divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
    }

    .message {
        text-align: center;
        color: #e2e8f0;
        font-size: 1.3rem;
        line-height: 1.5;
        font-weight: 500;
    }

    .footer {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 10px;
    }

    .countdown {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
    }

    .timer-text {
        position: absolute;
        font-size: 1.2rem;
        font-weight: 800;
        color: #00d2ff;
    }

    .progress-ring__circle {
        transition: stroke-dashoffset 0.35s;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
    }

    .resume-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .resume-info span {
        font-size: 0.75rem;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 1.5px;
    }

    .progress-bar-flat {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        background: linear-gradient(90deg, #00d2ff, #3a7bd5);
        transition: width 1s linear;
    }

    .marketing-footer {
        margin-top: 40px;
        color: #475569;
        font-weight: 600;
    }

    .marketing-footer span {
        color: #3b82f6;
    }

    /* Decoración */
    .floating-sign {
        position: absolute;
        font-size: 3rem;
        opacity: 0.1;
        pointer-events: none;
        z-index: -1;
    }

    .stop {
        top: 15%;
        left: 10%;
        animation: float 6s infinite alternate;
    }
    .warning {
        top: 70%;
        left: 15%;
        animation: float 8s infinite alternate-reverse;
    }
    .speed {
        bottom: 20%;
        right: 10%;
        font-weight: bold;
        font-family: sans-serif;
        border: 4px solid currentColor;
        border-radius: 50%;
        padding: 10px;
        font-size: 2rem;
        animation: float 7s infinite alternate;
    }
    .bump {
        top: 25%;
        right: 15%;
        animation: float 5s infinite alternate-reverse;
    }

    @keyframes float {
        0% {
            transform: translateY(0) rotate(0);
        }
        100% {
            transform: translateY(-20px) rotate(10deg);
        }
    }
</style>
