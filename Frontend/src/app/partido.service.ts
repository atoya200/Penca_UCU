import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  constructor(private http: HttpClient) { }


  create(match: any): Observable<any>{
    return this.http.post("http://localhost:3000/match/create", match);
  }

}
