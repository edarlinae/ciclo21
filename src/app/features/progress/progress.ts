import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChallengeStatus, JournalService } from '../../core/services/journal';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './progress.html',
  styleUrl: './progress.scss'
})
export class ProgressComponent implements OnInit {
  private journalService = inject(JournalService);
  
  public status: ChallengeStatus = { currentDay: 0, isCompleted: false, streakBroken: false, startDate: null };
  public days = Array.from({ length: 21 }, (_, i) => i + 1); // Array de 1 a 21

  ngOnInit(): void {
    this.journalService.entries$.subscribe(() => {
      this.status = this.journalService.getChallengeStatus();
    });
  }

  resetChallenge(): void {
    this.journalService.resetChallenge();
  }
}