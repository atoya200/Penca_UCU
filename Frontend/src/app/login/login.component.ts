import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import {NgIf} from '@angular/common';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) { }

  user = ""
  password = ""
  userValid: Boolean = true
  passValid: Boolean = true

  signup() {
    this.router.navigate(['/registrar']);
  }

  login() {
    /*
    this.loginService.login(this.user, this.password).subscribe(
      data => {
        console.log(data)
        this.loginService.setTipo(data.tipo)
        this.router.navigateByUrl('/menu');
      },
      error => {
        alert(error.error.error)
        console.log(error);
      });*/
      this.router.navigate(['/menu']);

  }
}
