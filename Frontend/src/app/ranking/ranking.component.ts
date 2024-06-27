import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RankingService } from '../services/ranking.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { NgModule } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NgFor],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent {

  ranking: any[] = [];

  @ViewChild('userToFind') userToFind: ElementRef;

  constructor(private cookies: CookieService, private service: RankingService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.service.getRanking(id).subscribe((ranking) => {
        this.ranking = ranking
      });
    });
  }


  findMe() {
    const user: any = this.cookies.get("user");
    const element = document.getElementById(`ranking-${user}`);
    if (element) {
      console.log(element)
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('highlighted');
      console.log(element.classList);
      console.log("Usuario encontrado");
    }else{
      console.log("No se encontró el usuario");
    }
  }

  goBack(){
    this.router.navigate(['/fixture/' + this.route.snapshot.params['id']]);
  }

}
