import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { MainLayoutComponent } from './shell/main-layout/main-layout';
import { DiaryComponent } from './features/diary/diary';
import { Calendar } from './features/calendar/calendar';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Ciclo 21 - Inicio'
  },
  {
    path: 'app', // Una ruta "padre" para todo lo que va dentro de la app
    component: MainLayoutComponent,
    children: [ // Rutas "hijas" que se mostrarán dentro del MainLayout
      { path: 'calendario', component: Calendar, title: 'Ciclo 21 - Calendario' },
      { path: 'diario', component: DiaryComponent, title: 'Ciclo 21 - Diario' },
      { path: '', redirectTo: 'diario', pathMatch: 'full' } // Redirige /app a /app/diario
    ]
  },
  {
    path: '**', // Cualquier otra ruta
    redirectTo: ''
  }
];