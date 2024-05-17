import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient, private cookies: CookieService) { }

  login(id: string, pwd: string): Observable<any> {
    let user = {
      ci: id,
      password: pwd
    }
    return this.http.post("http://localhost:3000/user/login", { "user": user });
  }

  setToken(token: string) {
    this.cookies.set("token", token);
  }

  getToken() {
    return this.cookies.get("token");
  }

  setUserType(type: string) {
    this.cookies.set("role", type);
  }

  getUserType() {
    return { type: this.cookies.get("role") };
  }

  logOut() {
    this.cookies.delete("role");
    this.cookies.delete("token");
  }

  isLoggedIn() {
    return this.cookies.check("token")
  }

  test(): Observable<any> {
    return this.http.get("http://localhost:3000/test");
  }

}
