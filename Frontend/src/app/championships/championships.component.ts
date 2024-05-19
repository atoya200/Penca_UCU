import { Component } from '@angular/core';
import { Championship } from 'Championship';
import { ChampionshipsService } from '../services/championships.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-championships',
  standalone: true,
  imports: [],
  templateUrl: './championships.component.html',
  styleUrl: './championships.component.css'
})
export class ChampionshipsComponent {

  constructor(private service: ChampionshipsService, private router: Router) {}

  championships: Championship[] = [];

  ngOnInit(): void {
    this.service.getChampionships().subscribe((championships) => {
      this.championships = championships
    });
  }

  viewDetails(id: number){
    this.service.getChampionshipDetails(id);
    this.router.navigate(['/championship', id]);
    console.log("Viewing details of championship with id: " + id);
  }

}
