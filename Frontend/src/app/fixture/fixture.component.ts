import { Component, OnInit } from '@angular/core';
import { Match } from "../../../Match";
import { FixtureService } from "../services/fixture.service";
import { Stage } from 'Stage';
import { Championship } from 'Championship';
import { NgFor } from '@angular/common';
import {NgIf} from '@angular/common';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [NgFor,CommonModule, NgIf, FormsModule],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})

export class FixtureComponent {

  constructor(private service: FixtureService) {
  }

  championship: Championship = null
  actualStage: string = "";
  matches: Match[] = [];
  stages: Stage[] = [];
  selectedMatch: any;
  match: Match = null;
  showModal: boolean = false;

  ngOnInit(): void {
   this.service.viewDetails().subscribe((championship) => {
    this.championship = championship
    console.log(championship);
  });
  }

  getMatchData(match: Match){
    return new Promise((resolve, reject) => {
      this.service.getOficialMatchData(match).subscribe((match) => {
        this.match = match
        resolve(match);
      }, reject);
    });
  }
  

  async openModal(match: any, stage: string) {
    this.selectedMatch = match;
    this.showModal = true;
    console.log(match.stage)
    this.actualStage = stage
    await this.getMatchData(match)
    console.log("Partido oficial : " +this.match)

  }

  closeModal() {
    this.showModal = false;
  }

}
