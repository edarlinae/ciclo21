import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { JournalService } from '../../core/services/journal';
import { Emotion } from '../../models/emotion';
import { JournalEntry } from '../../models/journal-entry';

@Component({
  selector: 'app-journal-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './journal-entry.html',
  styleUrl: './journal-entry.scss'
})
export class JournalEntryComponent implements OnInit {

  private journalService = inject(JournalService);
  public dialogRef = inject(MatDialogRef<JournalEntryComponent>);
  public data: { date: string, entry: JournalEntry | undefined } = inject(MAT_DIALOG_DATA);

  public emotions: Emotion[] = [];
  public selectedEmotionIds: Set<string> = new Set(); // Usamos un Set
  public notes: string = '';

  ngOnInit(): void {
    this.emotions = this.journalService.getEmotions();
    if (this.data.entry) {
      this.selectedEmotionIds = new Set(this.data.entry.emotionIds);
      this.notes = this.data.entry.notes;
    }
  }

  toggleEmotion(emotionId: string): void {
    if (this.selectedEmotionIds.has(emotionId)) {
      this.selectedEmotionIds.delete(emotionId);
    } else {
      this.selectedEmotionIds.add(emotionId);
    }
  }

  save(): void {
    if (this.selectedEmotionIds.size === 0) {
      return; 
    }
    const entry: JournalEntry = {
      date: this.data.date,
      emotionIds: Array.from(this.selectedEmotionIds), // Convertimos el Set a Array
      notes: this.notes
    };
    this.journalService.saveEntry(entry);
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}