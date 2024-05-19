import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-championship',
  standalone: true,
  imports: [],
  templateUrl: './championship.component.html',
  styleUrl: './championship.component.css'
})
export class ChampionshipComponent {

  constructor(private route: ActivatedRoute) { }

  campeonato: any;
  isAdmin: boolean;
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // ir a buscar datos campeonato 
      // ver el tipo de usuario que es y las opciones que hay que mostrarle
      this.campeonato = id
      

    } else {
      // campeonato no valido, mostrar error¿?
    }
  }
}
