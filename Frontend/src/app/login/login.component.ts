import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
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

  ngOnInit(): void {
    this.loginService.logOut()
  }

  ci = ""
  password = ""
  userValid: Boolean = true
  passValid: Boolean = true

  signup() {
    this.router.navigate(['/registrar']);
  }

  login() { 
    this.loginService.login(this.ci, this.password).subscribe(
      data => {
        console.log(data)
        this.loginService.setUserType(data.user)
        this.loginService.setToken(data.token)
        this.router.navigateByUrl('/championships');
      },
      error => {
        alert(error.error.msg)
        console.log(error);
      });
  }
}
