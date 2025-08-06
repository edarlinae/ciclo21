import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Quote, QuoteService } from '../../core/services/quote';

@Component({
  selector: 'app-quote-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-card.html',
  styleUrl: './quote-card.scss'
})
export class QuoteCardComponent implements OnInit {
  private quoteService = inject(QuoteService);
  public quote$!: Observable<Quote[]>;

  ngOnInit(): void {
    this.quote$ = this.quoteService.getQuoteOfTheDay();
  }
}