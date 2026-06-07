import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // <-- Clave para que funcionen los botones de re-dirección
  templateUrl: './home.component.html', // <-- Si tu IDE lo creó como ./home.html cambialo a ese nombre
  styleUrl: './home.component.css', // <-- Si tu IDE lo creó como ./home.css cambialo a ese nombre
  changeDetection: ChangeDetectionStrategy.OnPush, // Lineamiento técnico del profe
})
export class HomeComponent {
  // Por ahora no necesitamos lógica acá, el HTML es estático.
}
