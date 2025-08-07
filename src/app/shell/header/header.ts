import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ChallengeStatus, JournalService } from '../../core/services/journal';
import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private journalService = inject(JournalService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  public challengeStatus: ChallengeStatus | null = null;

  ngOnInit(): void {
    this.journalService.entries$.subscribe(async () => {
      this.challengeStatus = await this.journalService.getChallengeStatus();
    });
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.error(error));
  }
}