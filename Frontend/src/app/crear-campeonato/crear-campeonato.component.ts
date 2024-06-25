import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../team';
import { TeamService } from '../team.service';
import { StageService } from '../stage.service';
import { Stage } from '../stage';

@Component({
  selector: 'app-crear-campeonato',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-campeonato.component.html',
  styleUrl: './crear-campeonato.component.css'
})
export class CrearCampeonatoComponent implements OnInit {

  nombre: string = ""
  fechaInicio: string = ""
  fechaFin: string = ""
  teams: Team[] = []
  stages: Stage[] = []
  hayTeams = false;
  hayStages = false;
  hoy = new Date();

  constructor(private teamService: TeamService, private router: Router, private stageService: StageService, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.teamService.getAllActiveTeams().subscribe((respuesta) => {
      this.teams = respuesta.teams
    });

    this.stageService.getAllStages().subscribe(
      data => {
        this.stages = data.stages;

      },
      error => {
        alert(error.error.msg)
        console.log(error);
      });

    // Ponemos la fecha 
    this.fechaInicio = this.getFormatDate(false)
    this.fechaFin = this.getFormatDate(true)

  }

  private getFormatDate(fechaFin) {
    var date = null
    const today = new Date();
    if (fechaFin) {
      let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
      date = new Date(today.getTime() + DIA_EN_MILISEGUNDOS);
    } else {
      date = today
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }


  crearCampeonato() {
    
    alert(this.nombre + " " + this.fechaInicio + " " + this.fechaFin)
  }
}
