import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs'
import { Championship } from 'Championship';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipsService {

  constructor() { }

  http: HttpClient;

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
          scoreObtained: 1,
          date: new Date()
        },
        {
          id: 2,
          teamA: "Nacional",
          teamB: "Peñarol",
          goalsA: 1,
          goalsB: 0,
          scoreObtained: 1,
          date: new Date()
        },
        {
          id: 3,
          teamA: "Plaza",
          teamB: "Boca",
          goalsA: 1,
          goalsB: 1,
          scoreObtained: 1,
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
        scoreObtained: 1,
        date: new Date()
      },
      {
        id: 5,
        teamA: "Brasil",
        teamB: "Peru",
        goalsA: 1,
        goalsB: 5,
        scoreObtained: 1,  
        date: new Date()
      },
      {
        id: 6,
        teamA: "Alemania",
        teamB: "España",
        goalsA: 10,
        goalsB: 2,
        scoreObtained: 1,
        date: new Date()
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
          scoreObtained: 1,
          date: new Date()
        },
        {
          id: 2,
          teamA: "Nacional",
          teamB: "Peñarol",
          goalsA: 1,
          goalsB: 0,
          scoreObtained: 1,
          date: new Date()
        },
        {
          id: 3,
          teamA: "Plaza",
          teamB: "Boca",
          goalsA: 1,
          goalsB: 1,
          scoreObtained: 1,
          date: new Date()
        }
        ]
      }
    ]
  }
];

  // Obtener campeonatos asociados a un usuario (unicamente los nombres e id's)
  getChampionships(): Observable<Championship[]>{
    //return this.http.get<Championship[]>('http://localhost:3000/user/championships')
    return of(this.championships);
  }
  
  // Anotar usuario a penca
  joinChampionship(id: number){
    //return this.http.post('http://localhost:3000/user/joinChampionship', {id})
  }
}



