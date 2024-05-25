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
  getChampionships(): Observable<Championship[]>{
    return this.http.get<Championship[]>('http://localhost:3000/championship')
  }

  // Anotar usuario a penca
  joinChampionship(id: number, championId: string, runnerupId: string) {

    return this.http.post(`http://localhost:3000/championship/${id}/register`, {
      "championId": championId,
      "runnerUpId": runnerupId
    })

  }


}

