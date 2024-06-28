import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../team';
import { Stage } from '../stage';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ChampionshipsService } from '../services/championships.service';
import { Championship } from 'Championship';
import { PartidoService } from '../partido.service';
import { Match } from 'Match';


@Component({
  selector: 'app-partido',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.css'
})
export class PartidoComponent implements OnInit {


  name: string = ""
  matchDate: string = ""
  hour: string = ""
  matchDateMin: string = ""
  Championships: Championship[] = []
  matchs: any[] = []
  teams: Team[];
  stages: Stage[];
  teamA: Team | string = null
  teamB: Team | string = null
  showStagesAndTeams = false;
  formPartido: FormGroup;
  formPartidoResultado: FormGroup;

  inputA: string | number = ""
  inputB: string | number = ""

  showMatchs: boolean = false
  showMatchItems: boolean = false

  constructor(private router: Router, private champSerivce: ChampionshipsService, private matchService: PartidoService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.formPartido = this.fb.group({
      championship: ['', Validators.required],
      teamA: ['', Validators.required],
      teamB: ['', Validators.required],
      matchDate: ['', Validators.required],
      stage: ['', Validators.required],
    });

    this.formPartidoResultado = this.fb.group({
      championshipResult: ['', Validators.required],
      inputTeamA: ['', Validators.required],
      inputTeamB: ['', Validators.required],
      matchs: ["", Validators.required]
      //matchs: new FormControl(''),  // 
    })
  }

  ngOnInit(): void {
    this.champSerivce.getAllChapmWithTeamsAndStages().subscribe((respuesta) => {

      this.Championships = respuesta.champs;
      console.log(this.Championships)
      for (let i = 0; i < this.Championships.length; i++) {
        let j = i + 1;
        this.formPartido.addControl('champ_' + j, this.fb.control(false));
      }
      console.log(this.formPartido)
    });

    // Ponemos la fecha 
    this.matchDateMin = this.getFormatDate(true);
  }

  private getFormatDate(fechaFin) {
    var date = null;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1)
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


  onChampionshipSelected() {
    const selectedOption = this.formPartido.get('championship').value;
    if (selectedOption != '-1') {
      this.showStagesAndTeams = true;

      console.log(selectedOption)
      const champ = this.Championships.find(ch => ch.id == selectedOption);
      this.teams = champ.teams
      this.stages = champ.stages
    } else {
      this.showStagesAndTeams = false;
    }
  }


  onSubmit() {
    // Verifica si el formulario es válido antes de enviar
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 2);

    const startDate = new Date(this.formPartido.value.matchDate);

    let fechasValidas = startDate >= hoy;

    const champsionshipSelected = this.formPartido.get('championship').value;
    const teamASelected = this.formPartido.get('teamA').value;
    const teamBSelected = this.formPartido.get('teamB').value;
    const stageSelected = this.formPartido.get('stage').value;

    console.log(champsionshipSelected)
    console.log(teamBSelected)
    console.log(teamBSelected)
    console.log(stageSelected)

    if (champsionshipSelected == "-1") {
      alert("Debe seleccionar un equipo");
    } else if (teamASelected == -1 || teamBSelected == -1) {
      alert("Debe elegir ambos equipos para registrar un partido")
    } else if (teamASelected == teamBSelected) {
      alert("Debe seleccionar dos equipos distintos")
    } else if (!fechasValidas) {
      alert("La fecha debe ser igual o mayor a hoy")
    } else if (this.formPartido.valid) {

      // Recorre los datos del form para construir un objeto JSON
      const match = {
        teamA: teamASelected,
        teamB: teamBSelected,
        matchDate: this.formPartido.value.matchDate,
        stage: stageSelected,
        championship: champsionshipSelected
      };

      this.matchService.create(match).subscribe(
        data => {
          console.log(data)
          alert("Partido registrado correctamente")
          this.limpiarForm();

        },
        error => {
          alert("Ocurrió un error en la creacion de los partidos")
          console.log(error);
        });
    } else {
      alert('La elección hecha no es correcta, seleccione todos los campos');
    }
  }

  volver(): void {
    this.router.navigate(['/menu']);
  }

  private limpiarForm() {
    this.formPartido.reset({
      teamA: '',
      teamB: '',
      matchDate: ''
    });
  }


  onChampionshipResultSelected() {
    const selectedOption = this.formPartidoResultado.get('championshipResult').value;
    if (selectedOption != '-1') {

      console.log(selectedOption)
      this.champSerivce.getAllMatchs(selectedOption).subscribe((respuesta) => {
        for (let i = 0; i < respuesta.matchs.length; i++) {
          console.log(respuesta.matchs[i].matchDate)
          let tmpDate = new Date(respuesta.matchs[i].matchDate);
          console.log(tmpDate)
          const yyyy = tmpDate.getFullYear();
          const mm = String(tmpDate.getMonth() + 1).padStart(2, '0');
          const dd = String(tmpDate.getDate()).padStart(2, '0');
          const hh = String(tmpDate.getHours()).padStart(2, '0');
          const min = String(tmpDate.getMinutes()).padStart(2, '0');
          respuesta.matchs[i].originalDate = respuesta.matchs[i].matchDate;
          respuesta.matchs[i].hour = `${hh}:${min}`;
          respuesta.matchs[i].matchDate = `${yyyy}-${mm}-${dd}`;
        }

        // Actualiza el valor del formControl a la primera opción válida
        console.log(respuesta.matchs)
        this.matchs = respuesta.matchs
        this.showMatchs = true;
        const matchsControl = this.formPartidoResultado.get('matchs');
        if (matchsControl) {
          matchsControl.setValue('-1');
        }
      });
    } else {
      this.showMatchs = false;
    }

  }
  onMatchResultSelected() {

    const selectedOption = this.formPartidoResultado.get('matchs').value;
    console.log(this.formPartidoResultado)
    if (selectedOption != '-1') {

      console.log("seleccionada", selectedOption)
      let match = this.matchs.find(mt => mt.id == selectedOption)

      console.log(match)

      this.teamA = match.labelA;
      this.teamB = match.labelB;
      this.inputA = match.resultTeamA
      this.inputB = match.resultTeamB
      this.hour = match.hour;
      this.showMatchItems = true;
    } else {
      this.showMatchs = false;
    }
  }


  onSubmitResultado() {
    const teamAResult = this.formPartidoResultado.get('inputTeamA').value;
    const teamBResult = this.formPartidoResultado.get('inputTeamB').value;


    if (!Number.isInteger(Number.parseInt(teamAResult)) || teamAResult < 0) {
      alert("Los puntos del equipo A deben ser 0 o mayor a 0");
    } else if (!Number.isInteger(Number.parseInt(teamBResult)) || teamBResult < 0) {
      alert("Los puntos del equipo B deben ser 0 o mayor a 0");
    } else if (this.formPartidoResultado.valid) {

      //const {championshipId, matchId, resultTeamA, resultTeamB }
      // Recorre los datos del form para construir un objeto JSON
      const match = {
        championshipId: this.formPartidoResultado.value.championshipResult,
        matchId: this.formPartidoResultado.value.matchs,
        resultTeamA: this.formPartidoResultado.value.inputTeamA,
        resultTeamB: this.formPartidoResultado.value.inputTeamB
      };

      this.matchService.registerResult(match).subscribe(
        data => {
          console.log(data)
          alert("Partido actualizado correctamente")
          this.limpiarFormResult();

        },
        error => {
          alert("Ocurrió un error en la creacion de los partidos")
          console.log(error);
        });
    } else {
      alert('La elección hecha no es correcta, seleccione todos los campos');
    }
  }

  private limpiarFormResult() {
    this.formPartido.reset({
      championshipId: "",
      matchId: "",
      resultTeamA: "",
      resultTeamB: ""
    });
  }
}