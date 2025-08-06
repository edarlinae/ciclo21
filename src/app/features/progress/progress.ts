import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChallengeStatus, JournalService } from '../../core/services/journal';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './progress.html',
  styleUrl: './progress.scss'
})
export class ProgressComponent implements OnInit {
  private journalService = inject(JournalService);
  
  public status: ChallengeStatus = { currentDay: 0, isCompleted: false, streakBroken: false, startDate: null };
  public days = Array.from({ length: 21 }, (_, i) => i + 1);

  ngOnInit(): void {
    this.journalService.entries$.subscribe(async () => { // <-- async
      this.status = await this.journalService.getChallengeStatus(); // <-- await
    });
  }

  resetChallenge(): void {
    this.journalService.resetChallenge();
  }
}