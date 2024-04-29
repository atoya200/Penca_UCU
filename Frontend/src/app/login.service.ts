import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { NgForm } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookies: CookieService) { }

  login(logid: string, contraseña: string): Observable<any> {
    let user = {
      logId: logid,
      password: contraseña
    }


    return this.http.post("http://localhost:3005/login", user);
  }

  setTipo(tipo: string) {
    this.cookies.set("rol", tipo);
  }

  getTipoUsuario() {
    return { tipo: this.cookies.get("rol") };
  }

  logOut() {
    this.cookies.delete("rol");
  }
}
