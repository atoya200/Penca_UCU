import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../team';
import { TeamService } from '../team.service';
import { StageService } from '../stage.service';
import { Stage } from '../stage';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ChampionshipsService } from '../services/championships.service';

@Component({
  selector: 'app-crear-campeonato',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-campeonato.component.html',
  styleUrls: ['./crear-campeonato.component.css']
})
export class CrearCampeonatoComponent implements OnInit {

  nombre: string = ""
  fechaInicio: string = ""
  fechaFin: string = ""
  fechaInicioMin: string = ""
  fechaFinMin: string = ""
  description: string = ""
  teams: Team[] = []
  stages: Stage[] = []
  form: FormGroup;

  constructor(private teamService: TeamService, private router: Router, private champSerivce: ChampionshipsService, private stageService: StageService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.teamService.getAllActiveTeams().subscribe((respuesta) => {
      this.teams = respuesta.teams;
      for (let i = 0; i < this.teams.length; i++) {
        let j = i + 1;
        this.form.addControl('team_' + j, this.fb.control(false));
      }

      console.log(this.form)
    });

    this.stageService.getAllStages().subscribe((data) => {
      this.stages = data.stages;
      for (let i = 0; i < this.stages.length; i++) {
        let j = i + 1;
        this.form.addControl('stage_' + j, this.fb.control(false));
      }
      console.log(this.form)

    },

    );

    // Ponemos la fecha 
    this.fechaInicioMin = this.getFormatDate(false);
    this.fechaFinMin = this.getFormatDate(true);
  }

  private getFormatDate(fechaFin) {
    var date = null;
    const hoy = new Date();
    if (fechaFin) {
      let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
      date = new Date(hoy.getTime() + DIA_EN_MILISEGUNDOS);
    } else {
      date = hoy;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  toggleEquipos() {
    var equipos = document.getElementById('equipos');
    if (equipos.classList.contains('show')) {
      equipos.classList.remove('show');
    } else {
      equipos.classList.add('show');
    }
  }

  toggleEtapas() {
    var equipos = document.getElementById('etapas');
    if (equipos.classList.contains('show')) {
      equipos.classList.remove('show');
    } else {
      equipos.classList.add('show');
    }
  }

  onSubmit() {
    // Verifica si el formulario es válido antes de enviar
    const hoy = new Date();
    const mañana = new Date();
    hoy.setDate(mañana.getDate() - 1);
    mañana.setDate(mañana.getDate() + 1);

    const startDate = new Date(this.form.value.startDate);
    const endDate = new Date(this.form.value.endDate);

    let fechasValidas = startDate >= hoy && endDate >= mañana && startDate < endDate;

    if (this.form.valid && fechasValidas) {
      // Recorre los datos del form para construir un objeto JSON
      const formData = this.form.value;


      let idTeams = []
      let idStages = []
      Object.keys(formData).forEach((key) => {
        if (key.startsWith('team_') && formData[key]) {
          idTeams.push(key.slice(5))
        }
      })

      Object.keys(formData).forEach((key) => {
        if (key.startsWith('stage_') && formData[key]) {
          idStages.push(key.slice(6))
        }
      })

      console.log('Equipos seleccionados:', idTeams);
      console.log('Etapas seleccionados:', idStages);

      // name, startDate, endDate, description, stages, teams 
      const champ = {
        name: this.form.value.name,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        description: this.form.value.description,
        teams: idTeams,
        stages: idStages
      };
      console.log('Datos enviados:', champ);

      this.champSerivce.createChampionship(champ).subscribe(
        data => {
          console.log(data)
          alert("Campeonato creado correctamente")
          this.limpiarForm();

        },
        error => {
          alert(error.error.msg)
          console.log(error);
        });
    } else {
      alert('El form no es válido. Por favor complete los campos requeridos.');
    }
  }

  private limpiarForm() {
    this.form.reset({
      name: '',
      startDate: '',
      endDate: "",
      description: ''
    });
    for (let i = 0; i < this.teams.length; i++) {
      let j = i + 1;
      const control = this.form.get("team_" + j);
      console.log("team_control", control)
      console.log(control)
      control.reset();
    }
    for (let i = 0; i < this.stages.length; i++) {
      let j = i + 1;
      const control = this.form.get("stage_" + j);
      console.log("stage_controlS", control)
      control.reset();
    }

    document.getElementById("toggle-teams").click();
    document.getElementById("toggle-stages").click();
  }

  volver(): void {
    this.router.navigate(['/menu']);
  }
}


