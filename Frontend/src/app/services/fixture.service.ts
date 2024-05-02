import { Injectable } from '@angular/core';
import { Match } from 'Match';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  constructor(private http: HttpClient, private cookies: CookieService) {

   }

  Matches: Match[] = []
  GuesedMatches: Match[] = []




  getMatches(): Match[] {
    this.http.get<Match[]>("URL_DEL_SERVICIO").subscribe(matches => {
      this.Matches = matches;
    });
  }

  sendGuess(){

  }
}
