import { Component, OnInit } from '@angular/core';
import { Championship } from 'Championship';
import { ChampionshipsService } from '../services/championships.service';
import { Router } from '@angular/router';
import { FixtureService } from '../services/fixture.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import {NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuPrincipalComponent } from '../menu-principal/menu-principal.component';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-championships',
  standalone: true,
  imports: [NgFor,CommonModule, NgIf, FormsModule, MenuPrincipalComponent],
  templateUrl: './championships.component.html',
  styleUrl: './championships.component.css'
})
export class ChampionshipsComponent implements OnInit {

  isAdmin: boolean;
  constructor( private service: ChampionshipsService, private router: Router, private fixtureService: FixtureService, private loginService: LoginService) {
    this.isAdmin = this.loginService.getUserType().type == 'Admin';
  }

  championships: Championship[] = [];

  showModal: boolean = false;

  ngOnInit(): void {


    console.log("Getting championships");

    console.log(this.isAdmin)
    if(this.isAdmin){
      this.service.getAllChampionships().subscribe((championships) => {
        console.log("Championships received: " + JSON.stringify(championships) );
        championships.forEach(championship => {
          this.championships.push(championship);
        });
        console.log("Championships: " + JSON.stringify(this.championships));
      });
    } else {
      this.service.getChampionships().subscribe((championships) => {
        console.log("Championships received where i am admin: " + JSON.stringify(championships) );
        championships.forEach(championship => {
          this.championships.push(championship);
        });
        console.log("Championships: " + JSON.stringify(this.championships));
      });
    }
  }

  viewDetails(id: number){
    if(this.isAdmin){
      this.router.navigate(['/ranking', id]);
    } else {
      this.router.navigate(['/fixture', id]);
      console.log("Viewing details of championship with id: " + id);
    }
  }
  async openModal(){
    console.log("Opening modal");
    this.showModal = true;
  }

  closeModal(){
    this.showModal = false;
  }
}

/*
Este componente tendrá un botón flotante para anotarse a una nueva penca
*/
