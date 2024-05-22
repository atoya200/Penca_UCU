import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor(private http: HttpClient) { }

  registerStage(name: string): Observable<any> {
    let stage = {
      'name': name
    }
    return this.http.post("http://localhost:3000/stage", { "stage": stage });
  }

  getAllStages(): Observable<any> {
    return this.http.get("http://localhost:3000/stage");
  }

}
