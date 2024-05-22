import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  constructor(private http: HttpClient) { }

  register(ci: String, firstname: String, lastname: String, password: String, email: String, careerId: any): Observable<any> {
    
    let user = {
      "ci": ci,
      "password": password,
      "firstname": firstname,
      "lastname": lastname,
      "email": email,
      "career": {
        "id":  careerId 
      }
    }
    console.log(user)
    return this.http.post("http://localhost:3000/user/register", { "user": user });
  }

  getCareers() {
    return this.http.get("http://localhost:3000/user/career")
  }

}
