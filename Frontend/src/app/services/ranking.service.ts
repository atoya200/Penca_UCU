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
export class RankingService {

  constructor(private http: HttpClient, private cookies: CookieService) { }

  getRanking(id: number): Observable<any> {
    const url = "http://localhost:3000/ranking/" + id;
    return this.http.get<any>(url).pipe(
      tap(data => {
        console.log('Ranking obtenido:', data);
      }),
      catchError(error => {
        console.error('Error al obtener el ranking:', error);
        return of(null);
      })
    );
  }
}
