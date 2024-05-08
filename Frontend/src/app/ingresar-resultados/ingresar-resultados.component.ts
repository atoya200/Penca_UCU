import { Component } from '@angular/core';

@Component({
  selector: 'app-ingresar-resultados',
  standalone: true,
  imports: [],
  templateUrl: './ingresar-resultados.component.html',
  styleUrl: './ingresar-resultados.component.css'
})
export class IngresarResultadosComponent {

  

  miVariable: string;

  registrarCambio(newValue: string) {
    console.log('Nuevo valor:', newValue);
    // Aquí puedes realizar acciones adicionales con el nuevo valor
  }
}
