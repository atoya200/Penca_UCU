import { Component, Input, AfterViewInit } from '@angular/core';
import { LoginService } from '../login.service';
import { ChampionshipService } from '../championship.service';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})


export class MenuPrincipalComponent implements AfterViewInit {


  @Input() isAdmin?: boolean;
  equipo: String = "";
  imagenCargada: any;
  angForm: FormGroup;
  imagen: any = "";

  constructor(private teamService: TeamService, private fb: FormBuilder, private loginService: LoginService, private championshipService: ChampionshipService, private sanitizer: DomSanitizer) {
    this.createForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      equipo: ['', [Validators.required, Validators.maxLength(20)]],
      imagen: ['']
    });
  }

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

    this.isAdmin = this.loginService.getUserType().type == 'Admin';

  }


  limpiarDatos(): void {
    this.angForm.get('equipo').reset()
    this.angForm.get('imagen').reset()
  }

  eliminarImagen(): void {
    this.angForm.get('imagen').reset()
  }

  previsualizarImagen(): void {
    const reader = new FileReader();
    if (document.getElementById('imagen') != null) {
      let file = (<HTMLInputElement>document.getElementById('imagen')).files[0];

      reader.addEventListener(
        "load",
        () => {
          //debugger;
          // convert image file to base64 string
          //console.log(reader.result)

          this.imagen = reader.result;
          try {
            this.imagenCargada = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result.toString());

          } catch {
            console.log("Error al cargar imagen")
          }
        },
        false,
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  ingresarEquipo() {

    this.teamService.registerTeam(this.angForm.get('equipo').value, this.imagen).subscribe(
      data => {

        alert("Equipo registrado con exito");

      },
      error => {

        alert(error.error.msg)
        console.log(error);
      });
  }


  ngAfterViewInit() {
    // Este codigo del popover bloquea que funcione lo resto de bootstrap.
    // por el popover de las notificaciones
    /*const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map((popoverTriggerEl) => {
      return new bootstrap.Popover(popoverTriggerEl);
    });*/


    
  }

}

