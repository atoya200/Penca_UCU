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

  constructor(private service: FixtureService) {
  }
  GroupStage: boolean;
  matches: Match[] = [];

  ngOnInit(): void {
    this.service.getPredictions().subscribe(matches => {
      this.matches = matches
    });
  }



}
