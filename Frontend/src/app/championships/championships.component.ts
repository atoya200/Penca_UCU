import { Component } from '@angular/core';
import { Championship } from 'Championship';
import { ChampionshipsService } from '../services/championships.service';
import { Router } from '@angular/router';
import { FixtureService } from '../services/fixture.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import {NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-championships',
  standalone: true,
  imports: [NgFor,CommonModule, NgIf, FormsModule],
  templateUrl: './championships.component.html',
  styleUrl: './championships.component.css'
})
export class ChampionshipsComponent {

  constructor( private service: ChampionshipsService, private router: Router, private fixtureService: FixtureService ) {}
  
  championships: Championship[] = [];

  showModal: boolean = false;

  ngOnInit(): void {
    this.service.getChampionships().subscribe((championships) => {
      this.championships = championships
      console.log("campeonatos: " + championships);
      console.log("campeonatos: " + this.championships[0].name +", " + this.championships[1].name);
    });
  }

  viewDetails(id: number){
    this.fixtureService.getPredictions(id);
    this.router.navigate(['/fixture', id]);
    console.log("Viewing details of championship with id: " + id);
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