import { Component, OnInit } from '@angular/core';
import { Match } from "../../../Match";
import { FixtureService } from "../services/fixture.service";
import { Stage } from 'Stage';
import { Championship } from 'Championship';
import { NgFor } from '@angular/common';
import {NgIf} from '@angular/common';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MenuPrincipalComponent } from '../menu-principal/menu-principal.component';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [NgFor,CommonModule, NgIf, FormsModule, ReactiveFormsModule, MenuPrincipalComponent],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})

export class FixtureComponent {

  constructor(private service: FixtureService, private router: Router, private route: ActivatedRoute) {
  }

  championship: Championship = null
  actualStage: string = "";
  matches: Match[] = [];
  stages: Stage[] = [];
  selectedMatch: any;
  // El oficial
  match: Match = null;
  showModal: boolean = false;
  happened : boolean = false;
  //Esto se debe hacer ya que la predicción de algún usuario puede ser 0 - 0
  teamAGoals: string | null = null;
  teamBGoals: string | null = null;
  // Se utilizan para validar que el usuario no ponga un resultado que sea un número y que lo haga en el plazo valido
  isNear: boolean = false;
  isValid: boolean = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.service.getPredictions(id).subscribe((championship) => {
        this.championship = championship
      });
      this.match = new Match(0, "", "", 0, 0, new Date(), 0);
    });
  }

  async openModal(match: any, stage: string) {
    this.selectedMatch = match;
    
    this.teamAGoals = match.goalsA.toString();
    this.teamBGoals = match.goalsB.toString();

    const matchDate = new Date(match.date);
    const now = new Date();
    const timeDifference = matchDate.getTime() - now.getTime();

    if (matchDate < now) {
      this.happened = true;
      this.isNear = true;
      this.service.getOficialMatchData(match.matchId).subscribe((matchData) => {
        console.log("Datos del partido oficial: ", matchData);
        this.match.date = match.date;
        this.match.goalsA = matchData[0].resultTeamA;
        this.match.goalsB = matchData[0].resultTeamB;
        this.match.teamA = match.teamA; 
        this.match.teamB = match.teamB;
        this.match.matchId = match.matchId;
        this.match.scoreObtained = match.scoreObtained;
        console.log("Match: ", this.match);
      });
    } else if (matchDate >= now) {
      this.happened = false;

      if (timeDifference < 3600000) {
        this.isNear = true;
      } else {
        this.isNear = false;
      }
    }

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.happened = false;
    this.isNear= false;
    this.isValid = true;
    this.teamAGoals = null;
    this.teamBGoals = null;
  }

  goBack(){
    this.router.navigate(['/championships']);
    this.happened = false;
  }

  savePrediction() {
    if (this.selectedMatch) {
      console.log ('Guardando predicción:', this.teamAGoals, this.teamBGoals, "se acerca: " + this.isNear, "valido: " + this.validateInput(this.teamAGoals, this.teamBGoals));
      if (this.validateInput(this.teamAGoals, this.teamBGoals)) {
        const newMatch : Match = {
          matchId: this.selectedMatch.matchId,
          teamA: this.selectedMatch.teamA,
          teamB: this.selectedMatch.teamB,
          goalsA: parseInt(this.teamAGoals),
          goalsB: parseInt(this.teamBGoals),
          date: this.selectedMatch.date,
          scoreObtained: this.selectedMatch.scoreObtained
        };
        console.log("Selected match: ", this.selectedMatch)
        console.log("New match: ", newMatch)
        this.service.savePrediction(newMatch).subscribe(
          response => {
            console.log('Predicción guardada:', response);
            console.log(this.selectedMatch.matchId)
            for (let stage of this.championship.stages) {
              for (let match of stage.matches) {
                console.log(match)
                console.log(`Comparando ${match.matchId} con ${this.selectedMatch.matchId}`);
                if (match.matchId === this.selectedMatch.matchId ) {
                  match.goalsA = parseInt(this.teamAGoals);
                  match.goalsB = parseInt(this.teamBGoals);
                  console.log(`Partido actualizado con el ID: ${this.selectedMatch.id}`);
                  break;
                }
              }
            }
            this.closeModal();
          },
          error => {
            console.error('Error guardando predicción:', error);
          }
        );
      }else{
        if (this.isNear){
          console.log("El partido ya ha sucedido")
        }else{
          console.log("El resultado no es valido")
        }
      }
    } else {
      console.log('selectedMatch es undefined');
    }
  };

    validateInput(teamAGoals: string, teamBGoals: string): boolean {
      const goalsPattern = /^[0-9]*$/;
      let value = goalsPattern.test(teamAGoals) && goalsPattern.test(teamBGoals);
      if (teamAGoals === null || teamBGoals === null){
        value = false;
      }else if (teamAGoals === " " ||  teamBGoals === ""){
        value = false;
      }else if (teamAGoals === " " ||  teamBGoals === " "){
        value = false;
      }
      this.isValid = value;
      return value;
    }
}
