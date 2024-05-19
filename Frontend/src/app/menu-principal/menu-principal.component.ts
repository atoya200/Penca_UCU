import { Component, Input, AfterViewInit } from '@angular/core';
import { LoginService } from '../login.service';
import { ChampionshipService } from '../championship.service';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})


export class MenuPrincipalComponent implements AfterViewInit {


  @Input() isAdmin?: boolean;

  Championships: any;
  constructor(private loginService: LoginService, private championshipService: ChampionshipService) { }


  ngOnInit(): void {
    // verificar si el usuario tiene permisos, sino mandarlo al login
    // buscar las notificaciones que tiene el usuario (predicciones faltantes, etc)
    // Done. buscar campeonatos que esta inscripto el usuario, o si es administrador que muestre los campeonatos activos listados
    // Empezar un spinner y despues terminarlo?

    // TODO: 
    // - agregar carrousel con imagenes de futbol en el menu principal
    // - listar campeonatos en el inicio, al entrar al campeonato que aparezcan las funcionalidades que dependen de el
    // - navbar con las funcionalidades de anotarse a una penca (Done), crear campeonato (Done), ver notificaciones (Done), 
    // Equipos (ingresar equipos, modificar equipos, consultar equipos), 

    this.championshipService.getChampionships().subscribe(
      data => {
        console.log(data)
        this.Championships = data.championships
      },
      error => {
        alert(error.error)
        console.log(error);
      });

  }

  ngAfterViewInit() {
    // por el popover de las notificaciones
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map((popoverTriggerEl) => {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }





}

