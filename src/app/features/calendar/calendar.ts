import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { JournalService } from '../../core/services/journal';
import { JournalEntryComponent } from '../journal-entry/journal-entry';
import { JournalEntry } from '../../models/journal-entry';

interface CalendarDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    TitleCasePipe, 
    DatePipe, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {
  
  private journalService = inject(JournalService);
  private dialog = inject(MatDialog);

  public daysInMonth: CalendarDay[] = [];
  public viewDate: Date = new Date();
  private today: string = this.formatDate(new Date());

  ngOnInit(): void {
    this.generateCalendarDays(this.viewDate);
    
    this.journalService.entries$.subscribe(() => {
      this.generateCalendarDays(this.viewDate);
    });
  }
  
  changeMonth(offset: number): void {
    this.viewDate.setMonth(this.viewDate.getMonth() + offset);
    this.generateCalendarDays(this.viewDate);
  }

  openJournalEntry(date: string): void {
    const entry = this.journalService.getEntryForDate(date);
    this.dialog.open(JournalEntryComponent, {
      width: '500px',
      autoFocus: false,
      data: { 
        date: date,
        entry: entry
      }
    });
  }

  public getEntryForDate(date: string): JournalEntry | undefined {
    return this.journalService.getEntryForDate(date);
  }

  public getEmotionColorFromId(id: string): string {
    const emotion = this.journalService.getEmotionById(id);
    return emotion ? emotion.color : '';
  }

  public isToday(date: string): boolean {
    return date === this.today;
  }

  private generateCalendarDays(date: Date): void {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];
    
    let startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = startDay; i > 0; i--) {
        const date = new Date(year, month - 1, lastDayOfLastMonth - i + 1);
        days.push({ date: this.formatDate(date), dayNumber: date.getDate(), isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const date = new Date(year, month, i);
        days.push({ date: this.formatDate(date), dayNumber: i, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({ date: this.formatDate(date), dayNumber: i, isCurrentMonth: false });
    }

    this.daysInMonth = days;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}