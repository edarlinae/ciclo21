import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JournalEntry } from '../../models/journal-entry';
import { Emotion } from '../../models/emotion';

export interface ChallengeStatus {
  currentDay: number;
  isCompleted: boolean;
  streakBroken: boolean;
  startDate: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private entriesSubject = new BehaviorSubject<JournalEntry[]>([]);
  public entries$ = this.entriesSubject.asObservable();
  private readonly storageKey = 'ciclo21-entries';
  private readonly startDateKey = 'ciclo21-startDate';

  private readonly emotions: Emotion[] = [
    { id: 'felicidad', name: 'Felicidad', color: '#F9E79F', icon: '😄' },
    { id: 'calma', name: 'Calma', color: '#A3E4D7', icon: '😌' },
    { id: 'tristeza', name: 'Tristeza', color: '#A9CCE3', icon: '😢' },
    { id: 'ansiedad', name: 'Ansiedad', color: '#F5CBA7', icon: '😥' },
    { id: 'miedo', name: 'Miedo', color: '#D7BDE2', icon: '😨' },
    { id: 'ira', name: 'Ira', color: '#E6B0AA', icon: '😠' }
  ];

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedEntries = localStorage.getItem(this.storageKey);
      if (savedEntries) {
        this.entriesSubject.next(JSON.parse(savedEntries));
      }
    }
  }

  getEmotions(): Emotion[] { return this.emotions; }
  getEmotionById(id: string): Emotion | undefined { return this.emotions.find(e => e.id === id); }
  getEntryForDate(date: string): JournalEntry | undefined { return this.entriesSubject.getValue().find(e => e.date === date); }

  getChallengeDay(entryDateStr: string): number | null {
    const startDateStr = localStorage.getItem(this.startDateKey);
    if (!startDateStr) {
      return null;
    }

    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);

    const entryDate = new Date(entryDateStr);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffTime = entryDate.getTime() - startDate.getTime();
    if (diffTime < 0) {
      return null;
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const dayNumber = diffDays + 1;

    // --- LÓGICA CORREGIDA ---
    // Si el día está fuera del rango 1-21, no lo consideramos parte del ciclo.
    return (dayNumber > 0 && dayNumber <= 21) ? dayNumber : null;
  }

  public getChallengeStatus(): ChallengeStatus {
    const startDateStr = localStorage.getItem(this.startDateKey);
    if (!startDateStr) {
      return { currentDay: 0, isCompleted: false, streakBroken: false, startDate: null };
    }

    const entries = this.entriesSubject.getValue().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const relevantEntries = entries.filter(e => new Date(e.date) >= new Date(startDateStr));

    if (relevantEntries.length === 0) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const startDate = new Date(startDateStr);
      startDate.setHours(0,0,0,0);
      const isBroken = today.getTime() > startDate.getTime();
      return { currentDay: 0, isCompleted: false, streakBroken: isBroken, startDate: startDateStr };
    }

    let consecutiveDays = 0;
    let streakBroken = false;

    if (this.formatDate(new Date(startDateStr)) !== relevantEntries[0]?.date) {
        streakBroken = true;
    } else {
        consecutiveDays = 1;
        for (let i = 1; i < relevantEntries.length; i++) {
            const prevDate = new Date(relevantEntries[i-1].date);
            const currentDate = new Date(relevantEntries[i].date);
            const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

            if (diffDays === 1) {
                consecutiveDays++;
            } else {
                streakBroken = true;
                break;
            }
        }
    }
    
    const lastEntryDate = new Date(relevantEntries[relevantEntries.length - 1].date);
    const today = new Date();
    today.setHours(0,0,0,0);
    const daysSinceLastEntry = (today.getTime() - lastEntryDate.getTime()) / (1000 * 3600 * 24);

    if (daysSinceLastEntry > 1) {
      streakBroken = true;
    }

    const currentDay = consecutiveDays;

    return {
      currentDay: Math.min(currentDay, 21),
      isCompleted: consecutiveDays >= 21 && !streakBroken,
      streakBroken: streakBroken,
      startDate: startDateStr
    };
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public resetChallenge(): void {
    if (confirm('¿Estás seguro de que quieres reiniciar tu ciclo? Tu progreso actual se perderá.')) {
        localStorage.removeItem(this.startDateKey);
        this.entriesSubject.next(this.entriesSubject.getValue());
    }
  }

  saveEntry(entry: JournalEntry) {
    const status = this.getChallengeStatus();
    
    if (status.streakBroken) {
        localStorage.setItem(this.startDateKey, entry.date);
    } else if (!localStorage.getItem(this.startDateKey)) {
        localStorage.setItem(this.startDateKey, entry.date);
    }
    
    const currentEntries = this.entriesSubject.getValue();
    const existingEntryIndex = currentEntries.findIndex(e => e.date === entry.date);

    if (existingEntryIndex > -1) {
      currentEntries[existingEntryIndex] = entry;
    } else {
      currentEntries.push(entry);
    }

    this.entriesSubject.next([...currentEntries]);
    this.saveToLocalStorage(currentEntries);
  }

  deleteEntry(dateToDelete: string): void {
    const currentEntries = this.entriesSubject.getValue();
    const updatedEntries = currentEntries.filter(entry => entry.date !== dateToDelete);

    this.entriesSubject.next(updatedEntries);
    this.saveToLocalStorage(updatedEntries);
  }

  private saveToLocalStorage(entries: JournalEntry[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }
  }
}