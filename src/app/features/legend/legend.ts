import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../core/services/journal';
import { Emotion } from '../../models/emotion';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend.html',
  styleUrl: './legend.scss'
})
export class LegendComponent {
  private journalService = inject(JournalService);
  public emotions: Emotion[] = this.journalService.getEmotions();
}