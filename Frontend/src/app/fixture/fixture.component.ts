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

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [NgFor,CommonModule, NgIf, FormsModule],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})

export class FixtureComponent {

  constructor(private service: FixtureService, private router: Router) {
  }

  championship: Championship = null
  actualStage: string = "";
  matches: Match[] = [];
  stages: Stage[] = [];
  selectedMatch: any;
  // El oficial
  match: Match = null;
  showModal: boolean = false;
  happend : boolean = false;
  //Esto se debe hacer ya que la predicción de algún usuario puede ser 0 - 0
  teamAGoals: string | null = null;
  teamBGoals: string | null = null;
  // Se utilizan para validar que el usuario no ponga un resultado que sea un número y que lo haga en el plazo valido
  isNear: boolean = false;
  isValid: boolean = true;

  ngOnInit(): void {
   this.service.viewDetails().subscribe((championship) => {
    this.championship = championship
    console.log(championship);
  });
  }

  getMatchData(match: Match){
    return new Promise((resolve, reject) => {
      this.service.getOficialMatchData(match).subscribe((match) => {
        this.match = match
        resolve(match);
      }, reject);
    });
  }
  

  async openModal(match: any, stage: string) {
    this.selectedMatch = match;
    this.showModal = true;
    console.log(match.stage)
    this.actualStage = stage
    this.teamAGoals = match.goalsA.toString();
    this.teamBGoals = match.goalsB.toString();
    await this.getMatchData(match)
    console.log("Partido oficial : " + this.match)
    console.log("Sucedio : " + this.happend)
    if ( match.date.getTime() < new Date()){
      console.log("El partido ha sucedido"+ match.date + " < " + new Date());
      this.happend = true;
      this.isNear = true;
    }else if (match.date >= new Date()){
      console.log("El partido no ha sucedido" + match.date + " > " + new Date());
      this.happend = false;
      if(this.selectedMatch.date.getTime() - new Date().getTime() < 1800000){
        console.log("El partido esta por suceder")
        this.isNear = true;
      }else{
        console.log("El partido no esta por suceder")
        this.isNear = false;
      }
    }
    console.log("Sucedio : " + this.happend)
  }

  closeModal() {
    this.showModal = false;
    this.happend = false;
    this.isNear= false;
    this.isValid = true;
    this.teamAGoals = null;
    this.teamBGoals = null;
  }

  goBack(){
    this.router.navigate(['/menu']);
    this.happend = false;
  }

  savePrediction() {
    console.log ('Guardando predicción:', this.teamAGoals, this.teamBGoals, "se acerca: " + this.isNear, "valido: " + this.validateInput(this.teamAGoals, this.teamBGoals));
    if (this.validateInput(this.teamAGoals, this.teamBGoals)) {
      const newMatch : Match = {
        id: this.selectedMatch?.id,
        teamA: this.selectedMatch?.teamA,
        teamB: this.selectedMatch?.teamB,
        goalsA: parseInt(this.teamAGoals),
        goalsB: parseInt(this.teamBGoals),
        date: this.selectedMatch?.date,
        scoreObtained: this.selectedMatch?.scoreObtained
      };
      this.service.savePrediction(newMatch).subscribe(
        response => {
          console.log('Predicción guardada:', response);
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