import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs'
import { Championship } from 'Championship';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipsService {

  constructor(private http: HttpClient) { }

  // Obtener campeonatos asociados a un usuario (unicamente los nombres e id's)
  getChampionships(): Observable<Championship[]> {
    return this.http.get<Championship[]>('http://localhost:3000/championship')
  }

  // Obtener todos los campeonatos
  getAllChampionships(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/championship/all')
  }

  // Anotar usuario a penca
  joinChampionship(id: number, championId: string, runnerupId: string) {

    return this.http.post(`http://localhost:3000/championship/${id}/register`, {
      "championId": championId,
      "runnerUpId": runnerupId
    })

  }
  // Obtener equipos pertenecientes a un campeonato
  getTeams(idchampionship: any): Observable<any> {
    return this.http.get(`http://localhost:3000/championship/${idchampionship}/team`)
  }

  // Crear campeonato
  createChampionship(championship: any): Observable<any>{
    return this.http.post(`http://localhost:3000/championship/`, championship)
  }

  // Recuperar datos del campeonato, etapas, y equipos
  getAllChapmWithTeamsAndStages(): Observable<any>{
    return this.http.get(`http://localhost:3000/championship/with_stages_and_teams`)
  }



  notifications(): Observable<any> {
    return this.http.get(`http://localhost:3000/notification`)
  }

  getAllMatchs(idchamp: any): Observable<any> {
    return this.http.get(`http://localhost:3000/match/getAllMatchs/`  + Number.parseInt(idchamp))
  }

}

