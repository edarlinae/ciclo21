import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importamos RouterLink

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Lo añadimos a los imports
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

}