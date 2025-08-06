import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChallengeStatus, JournalService } from '../../core/services/journal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private journalService = inject(JournalService);
  public challengeStatus: ChallengeStatus | null = null;

  ngOnInit(): void {
    this.journalService.entries$.subscribe(() => {
      this.challengeStatus = this.journalService.getChallengeStatus();
    });
  }
}