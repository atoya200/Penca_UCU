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
import { catchError, map, tap } from 'rxjs/operators';

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
          scoreObtained: 0,
          date: new Date(2022, 5, 10)
        },
        {
          id: 2,
          teamA: "Nacional",
          teamB: "Peñarol",
          goalsA: 1,
          goalsB: 0,
          scoreObtained: 0,
          date: new Date()
        },
        {
          id: 3,
          teamA: "Plaza",
          teamB: "Boca",
          goalsA: 1,
          goalsB: 1,
          scoreObtained: 0,
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
        scoreObtained: 0,
        date: new Date()
      },
      {
        id: 5,
        teamA: "Brasil",
        teamB: "Peru",
        goalsA: 1,
        goalsB: 5,
        scoreObtained: 0,
        date: new Date(2025, 5, 10)
      },
      {
        id: 6,
        teamA: "Alemania",
        teamB: "España",
        goalsA: 10,
        goalsB: 2,
        scoreObtained: 0,
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
          scoreObtained: 0,
          date: new Date()
        },
        {
          id: 2,
          teamA: "Nacional",
          teamB: "Peñarol",
          goalsA: 1,
          goalsB: 0,
          scoreObtained: 0,
          date: new Date()
        },
        {
          id: 3,
          teamA: "Plaza",
          teamB: "Boca",
          goalsA: 1,
          goalsB: 1,
          scoreObtained: 0,
          date: new Date()
        }
        ]
      }
    ]
  }
];
  actualChampionship: Championship = null;

  getPredictions(id: number): Observable<Championship> {
    let predictions = "http://localhost:3000/prediction/" + id;
    console.log(predictions)
    return this.http.get<Championship>(predictions).pipe(
      tap(data => {
        this.actualChampionship = data;
        console.log("Campeonato seleccionado: " + this.actualChampionship.name);
      }),
      catchError(error => {
        this.actualChampionship = null;
        console.log("No se encontró el campeonato seleccionado");
        return of(null);
      })
    );
  }


  savePrediction(newMatch: Match): Observable<any> {
    if (this.actualChampionship) {
      for (let stage of this.actualChampionship.stages) {
        let matchIndex = stage.matches.findIndex(match => match.id === newMatch.id);
        if (matchIndex !== -1) {
          stage.matches[matchIndex] = newMatch;
          console.log('Predicción guardada:', newMatch);
          return of(newMatch);
        }
      }
    }
    console.error('No se encontró el partido para actualizar');
    return of(null);
  }
  

  getOficialMatchData(match: Match): Observable<Match>{
    return of (this.actualChampionship.stages[0].matches[0])
  }
}
