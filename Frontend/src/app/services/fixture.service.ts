import { Injectable } from '@angular/core';
import { Match } from 'Match';
import { Stage } from 'Stage';
import { Championship } from 'Championship';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  constructor(private http: HttpClient, private cookies: CookieService) {

  }
   // Datos de campeonatos de prueba 
  championships: Championship[] = [{
    id: 1,
    name: "Copa Libertadores",
    description: "Copa Libertadores 2021",
    startDate: new Date(),
    endDate: new Date(),
    stages: [
      { 
        id: 1,
        name: "Fase de Grupos", 
        matches: [
        {
          id: 1,
          teamA: "Real",
          teamB: "Barca",
          goalsA: 7,
          goalsB: 0,

          date: new Date(2022, 5, 10)
        },
        {
          id: 2,
          teamA: "Nacional",
          teamB: "Peñarol",
          goalsA: 1,
          goalsB: 0,

          date: new Date()
        },
        {
          id: 3,
          teamA: "Plaza",
          teamB: "Boca",
          goalsA: 1,
          goalsB: 1,

          date: new Date()
        }
      ]
    },
    {   
      id: 2,
      name: "Cuartos de final", 
      matches: [
      {
        id: 4,
        teamA: "Uruguay",
        teamB: "Argentina",
        goalsA: 23,
        goalsB: 0,
        date: new Date()
      },
      {
        id: 5,
        teamA: "Brasil",
        teamB: "Peru",
        goalsA: 1,
        goalsB: 5,
        date: new Date()
      },
      {
        id: 6,
        teamA: "Alemania",
        teamB: "España",
        goalsA: 10,
        goalsB: 2,
        date: new Date(2024, 5, 10)
      }
    ]
  }
  ]
  },
  {
    id: 2,
    name: "Copa Sudamericana",
    description: "Copa Sudamericana 2021",
    startDate: new Date(),
    endDate: new Date(),
    stages: [
      { 
        id: 1,
        name: "Fase de Grupos", 
        matches: [
        {
          id: 1,
          teamA: "Real",
          teamB: "Barca",
          goalsA: 7,
          goalsB: 0,
          date: new Date()
        },
        {
          id: 2,
          teamA: "Nacional",
          teamB: "Peñarol",
          goalsA: 1,
          goalsB: 0,
          date: new Date()
        },
        {
          id: 3,
          teamA: "Plaza",
          teamB: "Boca",
          goalsA: 1,
          goalsB: 1,
          date: new Date()
        }
        ]
      }
    ]
  }
];
  actualChampionship: Championship = null;

  // Obtener todas las predicciones del usuario del campeonato seleccionado
  getPredictions(id: number){
    //this.http.get<Championship>('http://localhost:3000/user/predictions/' + id)
    for (let i = 0; i < this.championships.length; i++) {
      console.log("Campeonato: " + this.championships[i].name);
      if (this.championships[i].id === id) {
          this.actualChampionship = this.championships[i];
          console.log("Campeonato seleccionado: " + this.actualChampionship.name);
      }
    }
    if (this.actualChampionship === null) {
      this.actualChampionship = null;
      console.log("No se encontró el campeonato seleccionado");
    }
  }

  viewDetails(): Observable<Championship>{
    return of (this.actualChampionship);
  } 
  

  //Mandar preddicciones
  savePrediction(match: Match): Observable<any>{
    console.log ('llego:', match)
    return of (match);
  }

  

  getOficialMatchData(match: Match): Observable<Match>{
    return of (this.actualChampionship.stages[0].matches[0])
  }
}
