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

  getChampionships(){
    return this.http.get<Championship[]>('http://localhost:3000/user/championships')
  }
    
  getChampionshipDetails(idChampionship: number){
    return this.http.get<Championship[]>('http://localhost:3000/championships/' + idChampionship)
  }
}

// Obtener campeonatos asiciados a un usuario 


// Agregar campeonato 



