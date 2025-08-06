import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

// Estructura de la Cita Original (en inglés)
export interface Quote {
  q: string; // quote
  a: string; // author
}

// Estructura de la Respuesta de la API de Traducción
interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);
  
  // API para la frase del día en inglés
  private quoteApiUrl = 'https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/today';

  getQuoteOfTheDay(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.quoteApiUrl).pipe(
      // Usamos switchMap para encadenar la segunda llamada a la API
      switchMap(quotes => {
        if (!quotes || quotes.length === 0) {
          return this.getFallbackQuote(); // Si no hay frase, usamos la de por defecto
        }

        const englishQuote = quotes[0];
        const textToTranslate = englishQuote.q;

        // API de traducción (MyMemory)
        const translationApiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|es`;

        // Llamamos a la API de traducción
        return this.http.get<TranslationResponse>(translationApiUrl).pipe(
          // Usamos map para transformar la respuesta traducida a nuestra estructura original
          map(translationResponse => {
            const translatedText = translationResponse.responseData.translatedText;
            // Devolvemos la frase traducida pero manteniendo el autor original
            return [{ q: translatedText, a: englishQuote.a }];
          }),
          // Si la traducción falla, devolvemos la frase original en inglés
          catchError(() => {
            console.error('Error translating the quote. Returning original.');
            return of(quotes); 
          })
        );
      }),
      // Si la llamada inicial a ZenQuotes falla, usamos la de por defecto
      catchError(error => {
        console.error('Error fetching the quote:', error);
        return this.getFallbackQuote();
      })
    );
  }

  // Pequeña función para tener una frase de emergencia
  private getFallbackQuote(): Observable<Quote[]> {
    return of([{ q: 'La mejor manera de predecir el futuro es crearlo.', a: 'Peter Drucker' }]);
  }
}