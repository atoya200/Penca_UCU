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
    console.log('Guardando predicción:', newMatch);
    const url = "http://localhost:3000/prediction";
    let body: any = {
      "newMatch": newMatch
    }
    console.log(body);
    return this.http.post<any>(url, body).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        return response.success === true;
      }),
      catchError(error => {
        console.error('Error en la solicitud:', error);
        return of(false);
      })
    );
 } 

  getOficialMatchData(matchId: number): Observable<any> {
    const url = "http://localhost:3000/prediction/oficialMatch/" + matchId;
    return this.http.get<any>(url);
  }
}
