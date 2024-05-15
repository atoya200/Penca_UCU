import { Component, Input } from '@angular/core';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {

  @Input() isAdmin?: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void{
    // verificar si el usuario tiene permisos, sino mandarlo al login
    // buscar las notificaciones que tiene el usuario (predicciones faltantes, etc)
    // buscar campeonatos que esta inscripto el usuario, o si es administrador que muestre los campeonatos activos listados
    



  }

  // TODO: 
  // - agregar carrousel con imagenes de futbol en el menu principal
  // - listar campeonatos en el inicio, al entrar al campeonato que aparezcan las funcionalidades que dependen de el
  // - navbar con las funcionalidades de anotarse a un nuevo campeonato, ver notificaciones, 
  // Equipos (ingresar equipos, modificar equipos, consultar equipos), 
  



}
