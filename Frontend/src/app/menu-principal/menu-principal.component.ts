import { Component, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { ChampionshipService } from '../championship.service';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {

  @Input() isAdmin?: boolean;

  Championships: any;
  constructor(private loginService: LoginService, private championshipService: ChampionshipService) { }

  ngOnInit(): void {
    // verificar si el usuario tiene permisos, sino mandarlo al login
    // buscar las notificaciones que tiene el usuario (predicciones faltantes, etc)
    // buscar campeonatos que esta inscripto el usuario, o si es administrador que muestre los campeonatos activos listados
    // Empezar un spinner y despues terminarlo?
    this.championshipService.getChampionships().subscribe(
      data => {
        console.log(data)
        this.Championships = data.championships
      },
      error => {
        alert(error.error.msg)
        console.log(error);
      });

  }

  // TODO: 
  // - agregar carrousel con imagenes de futbol en el menu principal
  // - listar campeonatos en el inicio, al entrar al campeonato que aparezcan las funcionalidades que dependen de el
  // - navbar con las funcionalidades de anotarse a un nuevo campeonato, ver notificaciones, 
  // Equipos (ingresar equipos, modificar equipos, consultar equipos), 




}
