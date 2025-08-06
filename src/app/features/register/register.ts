import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';

  onSubmit() {
    this.authService.register({ email: this.email, password: this.password })
      .then(() => {
        this.router.navigate(['/app/diario']);
      })
      .catch(error => {
        console.error(error);
        alert('Error al registrar: ' + error.message);
      });
  }
}