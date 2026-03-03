import { browser } from '$app/environment';

class SoundManager {
    muted = $state(false);
    private audioContext: AudioContext | null = null;
    private bgMusicGain: GainNode | null = null;
    private isMusicPlaying = false;

    private getAudioContext() {
        if (!browser) return null;
        if (!this.audioContext) {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                    this.audioContext = new AudioContextClass();
                }
            } catch (e) {
                console.error("Failed to create AudioContext:", e);
            }
        }
        return this.audioContext;
    }

    /**
     * Resumes the AudioContext. Must be called from a user gesture (like a button click).
     */
    async unblockAudio() {
        if (!browser) return;
        const ctx = this.getAudioContext();
        if (ctx && ctx.state === "suspended") {
            try {
                await ctx.resume();
                console.log("AudioContext unblocked and resumed");
            } catch (e) {
                console.error("Failed to resume AudioContext:", e);
            }
        }
    }

    private generateTone(frequency: number, duration: number, volume = 0.3) {
        if (!browser || this.muted) return;

        try {
            const audioContext = this.getAudioContext();
            if (!audioContext) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Silent fail if audio context not available
        }
    }

    private playKick(time: number) {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.bgMusicGain!);
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    private playHiHat(time: number) {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 5000;
        const gain = ctx.createGain();
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgMusicGain!);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        source.start(time);
        source.stop(time + 0.05);
    }

    startBackgroundMusic() {
        if (!browser || this.isMusicPlaying || this.muted) return;

        try {
            const audioContext = this.getAudioContext();
            if (!audioContext) return;

            this.bgMusicGain = audioContext.createGain();
            this.bgMusicGain.gain.setValueAtTime(0.15, audioContext.currentTime);
            this.bgMusicGain.connect(audioContext.destination);

            this.isMusicPlaying = true;
            this.playSequencer(0);
        } catch (e) {
            console.error("Failed to start background music:", e);
        }
    }

    private playSequencer(step: number) {
        if (!browser || !this.isMusicPlaying || this.muted) return;

        const ctx = this.getAudioContext();
        if (!ctx) return;

        const tempo = 130;
        const stepTime = 60 / tempo / 4; // 16th notes
        const time = ctx.currentTime + 0.1;

        // Rhythm patterns (16 steps)
        const kickPattern = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
        const hatPattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1];
        const bassPattern = [130, 0, 130, 0, 146, 0, 146, 0, 164, 0, 164, 0, 146, 0, 146, 130];
        const melPattern = [523, 0, 0, 587, 0, 659, 0, 0, 698, 0, 783, 0, 0, 659, 0, 0];

        for (let i = 0; i < 16; i++) {
            const t = time + i * stepTime;

            if (kickPattern[i]) this.playKick(t);
            if (hatPattern[i]) this.playHiHat(t);

            if (bassPattern[i]) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(this.bgMusicGain!);
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(bassPattern[i], t);
                gain.gain.setValueAtTime(0.04, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + stepTime * 0.8);
                osc.start(t);
                osc.stop(t + stepTime * 0.8);
            }

            if (melPattern[i]) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(this.bgMusicGain!);
                osc.type = "sine";
                osc.frequency.setValueAtTime(melPattern[i], t);
                gain.gain.setValueAtTime(0.03, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + stepTime * 1.2);
                osc.start(t);
                osc.stop(t + stepTime * 1.2);
            }
        }

        setTimeout(() => {
            if (this.isMusicPlaying) this.playSequencer(0);
        }, stepTime * 16 * 1000 - 50);
    }

    stopBackgroundMusic() {
        this.isMusicPlaying = false;

        if (browser && this.bgMusicGain && this.audioContext) {
            this.bgMusicGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        }
    }

    playBeep() {
        this.generateTone(880, 0.08, 0.2);
    }

    playPowerup() {
        this.generateTone(1200, 0.15, 0.25);
        if (browser) {
            setTimeout(() => this.generateTone(1600, 0.1, 0.2), 50);
        }
    }

    playCrash() {
        this.generateTone(150, 0.3, 0.4);
    }

    playCorrectAnswer() {
        this.generateTone(800, 0.1, 0.2);
        if (browser) {
            setTimeout(() => this.generateTone(1000, 0.1, 0.2), 80);
            setTimeout(() => this.generateTone(1200, 0.15, 0.25), 160);
        }
    }

    playWrongAnswer() {
        this.generateTone(200, 0.2, 0.3);
        if (browser) {
            setTimeout(() => this.generateTone(150, 0.3, 0.35), 100);
        }
    }

    toggleMute() {
        this.muted = !this.muted;

        if (this.muted) {
            this.stopBackgroundMusic();
        } else if (!this.isMusicPlaying) {
            this.startBackgroundMusic();
        }
    }
}

export const soundManager = new SoundManager();
