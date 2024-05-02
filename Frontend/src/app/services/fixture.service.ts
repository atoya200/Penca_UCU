import { Injectable } from '@angular/core';
import { Match } from 'Match';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  constructor(private http: HttpClient, private cookies: CookieService) {

   }

  matches: Match[] = []
  guesedMatches: Match[] = []




  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>("URL_DEL_SERVICIO")
  }

  sendGuess(){

  }
}
