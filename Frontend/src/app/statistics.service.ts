import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  getStatistic(idchampionship: any, stat: any): Observable<any> {
    console.log(`http://localhost:3000/statistics/${stat}/${idchampionship}`)
    return this.http.get<any>(`http://localhost:3000/statistics/${stat}/${idchampionship}`)
  }

}
