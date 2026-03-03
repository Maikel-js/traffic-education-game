import { STORAGE_KEYS } from '../constants';

interface HighScore {
  score: number
  name: string
  date: string
  hash?: string
}

class HighScoreManager {
  private readonly STORAGE_KEY = STORAGE_KEYS.HIGH_SCORES_LIST;
  private readonly MAX_SCORES = 20;
  private readonly SECRET_SALT = "traffic-edu-game-v1";

  /**
   * Generates a simple hash for data integrity
   */
  private generateHash(score: number, name: string): string {
    const data = `${score}${name}${this.SECRET_SALT}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  getTopScores(limit = 10): HighScore[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []

      const scores: HighScore[] = JSON.parse(stored)

      // Filter out tampered scores
      const validScores = scores.filter(s => {
        if (!s.hash) return false; // Old scores or tampered
        return s.hash === this.generateHash(s.score, s.name);
      });

      return validScores.slice(0, limit)
    } catch (e) {
      return []
    }
  }

  addScore(score: number, name: string): void {
    try {
      const scores = this.getAllScores()
      const newEntry: HighScore = {
        score,
        name: name || "Anónimo",
        date: new Date().toISOString(),
      };

      newEntry.hash = this.generateHash(newEntry.score, newEntry.name);

      scores.push(newEntry)
      scores.sort((a, b) => b.score - a.score)

      if (scores.length > this.MAX_SCORES) {
        scores.length = this.MAX_SCORES
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores))
    } catch (e) {
      console.error("Failed to save high score:", e)
    }
  }

  private getAllScores(): HighScore[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return [];

      const scores: HighScore[] = JSON.parse(stored);
      // Return even if hash is missing for internal cleanup, 
      // but getTopScores will filter them out for display
      return scores;
    } catch (e) {
      return []
    }
  }
}

export const highScoreManager = new HighScoreManager()
