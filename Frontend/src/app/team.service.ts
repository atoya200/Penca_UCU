import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  registerTeam(name: string, img: any): Observable<any> {
    let team = {
      'name': name,
      'image': img
    }
    return this.http.post("http://localhost:3000/team", { "team": team });
  }
}
