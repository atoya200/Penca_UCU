import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {

  constructor(private http: HttpClient) {
  }

  createChampionship(): Observable<any> {
    // creates a new championship
    return this.http.post("http://localhost:3000/championship/", {});
  }

  getChampionships(): Observable<any> {
    // returns championships user is/has participated in
    return this.http.get("http://localhost:3000/championship");
  }

  participateInChampionship(id: string, pwd: string): Observable<any> {
    // registers user as a participant in a championship
    return this.http.post("http://localhost:3000/", {});
  }


}
