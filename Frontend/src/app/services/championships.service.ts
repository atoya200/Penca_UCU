import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs'
import { Championship } from 'Championship';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipsService {

  constructor() { }

  http: HttpClient;

  // Obtener campeonatos asociados a un usuario (unicamente los nombres e id's)
  getChampionships(){
    return this.http.get<Championship[]>('http://localhost:3000/user/championships')
  }
  
  // Anotar usuario a penca
  joinChampionship(id: number){
    //return this.http.post('http://localhost:3000/user/joinChampionship', {id})
  }
}



