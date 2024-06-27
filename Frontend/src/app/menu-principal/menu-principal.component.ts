import { Component, Input, AfterViewInit } from '@angular/core';
import { LoginService } from '../login.service';
import { ChampionshipsService } from '../services/championships.service';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import {Router, RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, NgForm, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TeamService } from '../team.service';
import { StageService } from '../stage.service';
import { StatisticsService } from '../statistics.service';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
  angFormCrearFase: FormGroup;
  angFormPencaId: FormGroup;
  angFormVerFase: FormGroup;
  angFormElegirEquipos: FormGroup;
  angFormEstadisticas: FormGroup;
  imagen: any = "";
  Fases: any = [];
  Notificaciones: any = [];

  pencaValida: boolean = false;
  Equipos: any = []
  Campeonatos: any = []
  Estadistica: any = []
  constructor(private router: Router, private statisticsService: StatisticsService, private stageService: StageService, private teamService: TeamService, private fb: FormBuilder, private loginService: LoginService, private championshipService: ChampionshipsService, private sanitizer: DomSanitizer) {

    this.createForm();

  }

  createForm() {
    // Form crear equipo
    this.angForm = this.fb.group({
      equipo: ['', [Validators.required, Validators.maxLength(20)]],
      imagen: ['', [Validators.required]]
    });

    // Form crear fase
    this.angFormCrearFase = this.fb.group({
      nombreFase: ['', [Validators.required, Validators.maxLength(20)]],
      faseEliminatoria: []
    });

    // Form id penca
    this.angFormPencaId = this.fb.group({
      idPenca: ['', [Validators.required]],
    });

    this.angFormElegirEquipos = this.fb.group({
      equipoCampeon: ['', [Validators.required]],
      equipoSubcampeon: ['', [Validators.required]]
    });

    this.angFormEstadisticas = this.fb.group({
      campeonato: ['', [Validators.required]],
      consulta: ['', [Validators.required]]
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
    this.angFormCrearFase.get('nombreFase').reset()
    this.angFormCrearFase.get('faseEliminatoria').reset()
    this.angFormPencaId.get('idPenca').reset()
    this.angFormElegirEquipos.get('equipoCampeon').reset()
    this.angFormElegirEquipos.get('equipoSubcampeon').reset()
    this.pencaValida = false;
    this.angFormEstadisticas.get('campeonato').reset()
    this.angFormEstadisticas.get('consulta').reset()
    this.Estadistica = []
    this.Notificaciones = []
  }

  eliminarImagen(): void {
    this.angForm.get('imagen').setValue("");
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

  crearFase() {
    // ingresar fase

    this.stageService.registerStage(this.angFormCrearFase.get('nombreFase').value, this.angFormCrearFase.get('faseEliminatoria').value).subscribe(
      data => {

        alert("Fase creada con éxito.");

      },
      error => {

        alert(error.error.msg)
        console.log(error);
      });
  }

  buscarFases() {
    this.stageService.getAllStages().subscribe(
      data => {
        this.Fases = data.stages;
      },
      error => {
        this.Fases = [];
        alert(error.error.msg)
        console.log(error);
      });
  }


  elegirEquipos(): void {
    // validar si el ID penca(campeonato) existe
    // Si existe, ir a buscar los equiops del campeonato y cargarlos en el select

    this.championshipService.getTeams(this.angFormPencaId.get('idPenca').value).subscribe(
      data => {
        this.Equipos = data.teams;
        if (this.Equipos.length == 0) {
          this.angFormPencaId.controls['idPenca'].setErrors({ 'notExists': 'true' });
        } else {
          this.angFormPencaId.controls['idPenca'].setErrors(null);
          this.pencaValida = true;
        }

        console.log(this.Equipos);
      },
      error => {
        this.pencaValida = false;
        this.Equipos = [];
        alert(error.error.msg)
        console.log(error);
      });


  }

  /*
  checkPencaExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      if (!control.value) {
        return of(null);
      }
      debugger;
      if (this.Equipos.length != 0) {
        return of({ pencaExists: true });
      } else {
        return of({ pencaExists: false });
      }

    };
  }
*/

  inscribirPenca(): void {

    this.championshipService.joinChampionship(this.angFormPencaId.get('idPenca').value, this.angFormElegirEquipos.get('equipoCampeon').value, this.angFormElegirEquipos.get('equipoSubcampeon').value).subscribe(
      data => {
        alert("Se inscribío con éxito a la penca.");

      },
      error => {
        alert(error.error.msg)
        console.log(error);
      });


  }

  buscarCampeonatos(): void {

    this.limpiarDatos()
    // buscar campeonatos
    this.championshipService.getAllChampionships().subscribe(data => {

      this.Campeonatos = data;

    }, error => {

      alert(error.error.msg)
      console.log(error);
    })
  }

  buscarEstatistica() {
    this.statisticsService.getStatistic(this.angFormEstadisticas.get('campeonato').value, this.angFormEstadisticas.get('consulta').value).subscribe(
      data => {
        // cargar datos
        this.Estadistica = data.consulta;

        for (let index = 0; index < this.Estadistica.length; index++) {
          const element = this.Estadistica[index];
          console.log(element)
        }

        for (let element of this.Estadistica) {
          console.log(element)
        }

      }, error => {
        alert(error.error.msg)
        console.log(error);
      })
  }


  buscarNotificaciones(): void {
    this.limpiarDatos()

    this.championshipService.notifications().subscribe(
      data => {
        this.Notificaciones = data.notificaciones;
        console.log(this.Equipos);
      },
      error => {
        this.Notificaciones = [];
        console.log(error);
      });
  }

  ngAfterViewInit() {
    // Este codigo del popover bloquea que funcione lo resto de bootstrap.
    // por el popover de las notificaciones
    /*
      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      const popoverList = popoverTriggerList.map((popoverTriggerEl) => {
        return new bootstrap.Popover(popoverTriggerEl);
      });
  */


  }

  goBack(): void {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }
}

