import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// --- IMPORTACIONES DE FIREBASE ---
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

// --- TU CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBwwllQ4LJOrGgdHR_EYALeWcfdAIVCCUE",
  authDomain: "ciclo21-app.firebaseapp.com",
  projectId: "ciclo21-app",
  storageBucket: "ciclo21-app.appspot.com",
  messagingSenderId: "455665457482",
  appId: "1:455665457482:web:f15d1eeaeec5cd263a49b3"
};
// ------------------------------------

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es' },

    // --- PROVEEDORES DE FIREBASE ---
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};