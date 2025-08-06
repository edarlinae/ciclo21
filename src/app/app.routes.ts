import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { MainLayoutComponent } from './shell/main-layout/main-layout';
import { DiaryComponent } from './features/diary/diary';
import { Calendar } from './features/calendar/calendar';
import { ProgressComponent } from './features/progress/progress';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { authGuard } from './core/auth/auth-guard'; // <-- RUTA CORREGIDA

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Ciclo 21 - Iniciar Sesión' },
  { path: 'register', component: RegisterComponent, title: 'Ciclo 21 - Registro' },
  {
    path: '',
    component: HomeComponent,
    title: 'Ciclo 21 - Inicio'
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Ruta protegida
    children: [
      { path: 'calendario', component: Calendar, title: 'Ciclo 21 - Calendario' },
      { path: 'diario', component: DiaryComponent, title: 'Ciclo 21 - Diario' },
      { path: 'progreso', component: ProgressComponent, title: 'Ciclo 21 - Mi Progreso'},
      { path: '', redirectTo: 'diario', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];