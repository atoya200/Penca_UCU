import { Injectable } from '@angular/core';
import { Match } from 'Match';
import { Stage } from 'Stage';
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
   
  predictedMatches: Match[] = []

  s1 : Stage[] =[
  { 
    id: 1,
    name: "Fase de Grupos", 
    championship: "libertadores", 
    matches: [
    {
      id: 1,
      teamA: "Real",
      teamB: "Barca",
      goalsA: 7,
      goalsB: 0,
      played: false
    },
    {
      id: 2,
      teamA: "Nacional",
      teamB: "Peñarol",
      goalsA: 1,
      goalsB: 0,
      played: false
    },
    {
      id: 3,
      teamA: "Plaza",
      teamB: "Boca",
      goalsA: 1,
      goalsB: 1,
      played: false
    }
  ]
},
{ 
  id: 2,
  name: "Cuartos de final", 
  championship: "libertadores", 
  matches: [
  {
    id: 4,
    teamA: "Uruguay",
    teamB: "Argentina",
    goalsA: 23,
    goalsB: 0,
    played: false
  },
  {
    id: 5,
    teamA: "Brasil",
    teamB: "Peru",
    goalsA: 1,
    goalsB: 5,
    played: false
  },
  {
    id: 6,
    teamA: "Alemania",
    teamB: "España",
    goalsA: 10,
    goalsB: 2,
    played: false
  }
]
}]

  // Obtener todas las predicciones del usuario
  getPredictions(): Observable<Stage[]> {
    //return this.http.get<Match[]>("URL_DEL_SERVICIO")
    return of (this.s1);
  }
  

  //Mandar preddicciones
  sendPredictions(){

  }

  //Editar predicción
  editPrediction(){

    let data = {}
    
  }

  getOficialMatchData(match: Match): Observable<Match>{
    console.log("Match: " + match)
    console.log("esto: "+this.s1[0][0])
    return of (this.s1[0].matches[0])
  }



}
