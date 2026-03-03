<script lang="ts">
    import { gameState } from "$lib/stores/game-state.svelte";
    import type { ScoreEvent } from "$lib/types";
    import { fade, fly } from "svelte/transition";

    let scoreEvents = $derived(gameState.scoreEvents);
</script>

<div class="score-effects-container">
    {#each scoreEvents as event (event.id)}
        <div
            class="score-effect {event.type}"
            style="left: {event.x}px; top: {event.y}px;"
            in:fly={{ y: -50, duration: 800 }}
            out:fade={{ duration: 200 }}
        >
            <span class="points">+{event.points}</span>
            {#if event.type === "near-miss"}
                <span class="label">NEAR MISS!</span>
            {/if}
            {#if event.multiplier && event.multiplier > 1}
                <span class="multiplier">x{event.multiplier}</span>
            {/if}
        </div>
    {/each}
</div>

<style>
    .score-effects-container {
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 1200px;
        max-height: 800px;
        pointer-events: none;
        z-index: 40;
        overflow: hidden;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .score-effect {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        font-weight: 900;
        font-family: "Outfit", sans-serif;
    }

    .points {
        font-size: 28px;
        color: #ffca32;
    }

    .label {
        font-size: 14px;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.6);
        padding: 2px 8px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .multiplier {
        font-size: 18px;
        color: #ff5e5e;
    }

    .near-miss .points {
        color: #34e7e4;
    }
</style>
