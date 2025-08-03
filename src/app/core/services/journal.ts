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
      const savedEntries = localStorage.getItem('ciclo21-entries');
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

  saveEntry(entry: JournalEntry) {
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
      localStorage.setItem('ciclo21-entries', JSON.stringify(entries));
    }
  }
}