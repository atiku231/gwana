/**
 * StudyDB - IndexedDB wrapper for study analytics and flashcard data
 */

const DB_NAME = 'KwararruStudyDB';
const DB_VERSION = 1;

export interface StudySession {
  id?: number;
  subject: string;
  duration: number; // minutes
  timestamp: Date;
}

export interface QuizResult {
  id?: number;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
}

export interface FlashcardWithSRS {
  id?: number;
  front: string;
  back: string;
  interval: number; // days
  repetitions: number;
  easeFactor: number;
  dueDate: Date;
}

export interface FlashcardDeck {
  id?: number;
  name: string;
  subject: string;
  cards: FlashcardWithSRS[];
  createdAt: Date;
  lastReviewedAt?: Date;
}

class StudyDB {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Study sessions store
        if (!db.objectStoreNames.contains('studySessions')) {
          const sessionsStore = db.createObjectStore('studySessions', { keyPath: 'id', autoIncrement: true });
          sessionsStore.createIndex('subject', 'subject', { unique: false });
          sessionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Quiz results store
        if (!db.objectStoreNames.contains('quizResults')) {
          const quizStore = db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true });
          quizStore.createIndex('subject', 'subject', { unique: false });
          quizStore.createIndex('completedAt', 'completedAt', { unique: false });
        }

        // Flashcard decks store
        if (!db.objectStoreNames.contains('flashcardDecks')) {
          const decksStore = db.createObjectStore('flashcardDecks', { keyPath: 'id', autoIncrement: true });
          decksStore.createIndex('subject', 'subject', { unique: false });
          decksStore.createIndex('name', 'name', { unique: false });
        }
      };
    });
  }

  // Study Sessions
  async addStudySession(session: StudySession): Promise<number> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('studySessions', 'readwrite');
      const store = tx.objectStore('studySessions');
      const request = store.add(session);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getStudySessions(limit = 100): Promise<StudySession[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('studySessions', 'readonly');
      const store = tx.objectStore('studySessions');
      const request = store.getAll();
      request.onsuccess = () => {
        const sessions = request.result.slice(-limit).reverse();
        resolve(sessions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getStudySessionsBySubject(subject: string): Promise<StudySession[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('studySessions', 'readonly');
      const store = tx.objectStore('studySessions');
      const index = store.index('subject');
      const request = index.getAll(subject);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Quiz Results
  async addQuizResult(result: QuizResult): Promise<number> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('quizResults', 'readwrite');
      const store = tx.objectStore('quizResults');
      const request = store.add(result);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getQuizResults(limit = 20): Promise<QuizResult[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('quizResults', 'readonly');
      const store = tx.objectStore('quizResults');
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result.slice(-limit).reverse();
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getQuizResultsBySubject(subject: string): Promise<QuizResult[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('quizResults', 'readonly');
      const store = tx.objectStore('quizResults');
      const index = store.index('subject');
      const request = index.getAll(subject);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Flashcard Decks
  async addFlashcardDeck(deck: FlashcardDeck): Promise<number> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('flashcardDecks', 'readwrite');
      const store = tx.objectStore('flashcardDecks');
      const request = store.add(deck);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getFlashcardDecks(): Promise<FlashcardDeck[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('flashcardDecks', 'readonly');
      const store = tx.objectStore('flashcardDecks');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateFlashcardDeck(deck: FlashcardDeck): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('flashcardDecks', 'readwrite');
      const store = tx.objectStore('flashcardDecks');
      const request = store.put(deck);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFlashcardDeck(id: number): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('flashcardDecks', 'readwrite');
      const store = tx.objectStore('flashcardDecks');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Analytics
  async getWeakTopics(): Promise<{ subject: string; averageScore: number }[]> {
    const results = await this.getQuizResults(100);
    const subjectScores = new Map<string, number[]>();

    results.forEach(result => {
      if (!subjectScores.has(result.subject)) {
        subjectScores.set(result.subject, []);
      }
      subjectScores.get(result.subject)!.push(result.score);
    });

    const weakTopics = Array.from(subjectScores.entries())
      .map(([subject, scores]) => ({
        subject,
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .filter(topic => topic.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore);

    return weakTopics;
  }

  async getTotalStudyTime(): Promise<number> {
    const sessions = await this.getStudySessions();
    return sessions.reduce((total, session) => total + session.duration, 0);
  }
}

// SRS Algorithm (Spaced Repetition System)
export class SRSAlgorithm {
  static calculateNextReview(card: FlashcardWithSRS, quality: number): FlashcardWithSRS {
    // quality: 0-5 (0=complete blackout, 5=perfect response)
    let { interval, repetitions, easeFactor } = card;

    if (quality < 3) {
      // Failed - reset repetitions
      repetitions = 0;
      interval = 1;
    } else {
      // Success
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    return {
      ...card,
      interval,
      repetitions,
      easeFactor,
      dueDate
    };
  }

  static getDueCards(deck: FlashcardDeck): FlashcardWithSRS[] {
    const now = new Date();
    return deck.cards.filter(card => new Date(card.dueDate) <= now);
  }
}

export const studyDB = new StudyDB();
