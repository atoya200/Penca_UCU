import { Component, OnInit } from '@angular/core';
import { Match } from "../../../Match";
import {FixtureService} from "../services/fixture.service";


@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})

export class FixtureComponent {

  constructor(private servicio: FixtureService) {
  }
  GroupStage: boolean;
  matches: Match[] = [];

  ngOnInit(): void {
    this.matches = this.servicio.getMatches()
  }



}
