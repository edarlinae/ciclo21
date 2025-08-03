// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Calendar } from './features/calendar/calendar'; // Nuestro calendario ahora será una ruta

export const routes: Routes = [
  {
    path: '', // La URL raíz (ej: localhost:4200)
    component: HomeComponent,
    title: 'Ciclo 21 - Tu Viaje de Transformación'
  },
  {
    path: 'diario', // La URL para el diario (ej: localhost:4200/diario)
    component: Calendar, // Mostramos el calendario aquí
    title: 'Ciclo 21 - Mi Diario Emocional'
  },
  {
    path: '**', // Cualquier otra ruta no encontrada
    redirectTo: '',
    pathMatch: 'full'
  }
];