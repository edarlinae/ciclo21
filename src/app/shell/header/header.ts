import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Importamos MatIconModule
import { ChallengeStatus, JournalService } from '../../core/services/journal';
import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule], // Lo añadimos
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private journalService = inject(JournalService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  public challengeStatus: ChallengeStatus | null = null;
  public isMobileMenuOpen = false; // Variable para el menú responsive

  ngOnInit(): void {
    this.journalService.entries$.subscribe(async () => {
      this.challengeStatus = await this.journalService.getChallengeStatus();
    });
  }

  // Función para abrir/cerrar el menú móvil
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        this.isMobileMenuOpen = false; // Cerramos el menú al salir
        this.router.navigate(['/login']);
      })
      .catch(error => console.error(error));
  }
}