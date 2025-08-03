import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JournalEntry } from '../../models/journal-entry';
import { Emotion } from '../../models/emotion';

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

  getEmotions(): Emotion[] {
    return this.emotions;
  }

  getEmotionById(id: string): Emotion | undefined {
    return this.emotions.find(e => e.id === id);
  }

  getEntryForDate(date: string): JournalEntry | undefined {
    return this.entriesSubject.getValue().find(e => e.date === date);
  }

  getChallengeDay(entryDateStr: string): number | null {
    const startDateStr = localStorage.getItem(this.startDateKey);
    if (!startDateStr) {
      return null; // El reto no ha comenzado
    }

    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);

    const entryDate = new Date(entryDateStr);
    entryDate.setHours(0, 0, 0, 0);
    
    const diffTime = entryDate.getTime() - startDate.getTime();
    if (diffTime < 0) {
      return null; // La entrada es anterior al inicio del reto
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  saveEntry(entry: JournalEntry) {
    if (!localStorage.getItem(this.startDateKey)) {
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

  private saveToLocalStorage(entries: JournalEntry[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }
  }
}