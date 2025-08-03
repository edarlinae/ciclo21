import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { JournalService } from '../../core/services/journal';
import { JournalEntry } from '../../models/journal-entry';
import { JournalEntryComponent } from '../journal-entry/journal-entry';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './diary.html',
  styleUrl: './diary.scss'
})
export class DiaryComponent implements OnInit {
  private journalService = inject(JournalService);
  private dialog = inject(MatDialog);

  public entries: JournalEntry[] = [];

  ngOnInit(): void {
    this.journalService.entries$.subscribe(entries => {
      this.entries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  openJournalEntry(entryToEdit?: JournalEntry): void {
    this.dialog.open(JournalEntryComponent, {
      width: '500px',
      autoFocus: false,
      data: { 
        date: entryToEdit ? entryToEdit.date : new Date().toISOString().split('T')[0],
        entry: entryToEdit
      }
    });
  }

  getEmotionColorFromId(id: string): string {
    const emotion = this.journalService.getEmotionById(id);
    return emotion ? emotion.color : '';
  }

  getChallengeDayForEntry(date: string): number | null {
    return this.journalService.getChallengeDay(date);
  }
  
  deleteEntry(date: string): void {
    if (confirm('¿Estás seguro de que quieres borrar esta entrada?')) {
      alert('Función para borrar próximamente.');
    }
  }
}