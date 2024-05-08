import { Component } from '@angular/core';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {

  constructor(private loginService: LoginService) { }

  send(): void {
    this.loginService.test().subscribe(
      data => {
        console.log(data)
      },
      error => {

        console.log(error);
      });
  }

}
