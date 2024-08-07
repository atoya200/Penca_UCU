import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { IngresarResultadosComponent } from './ingresar-resultados/ingresar-resultados.component';
import { FixtureComponent } from './fixture/fixture.component';
import { Championship } from 'Championship';
import { ChampionshipsComponent } from './championships/championships.component';
import { CrearCampeonatoComponent } from './crear-campeonato/crear-campeonato.component';
import { RankingComponent } from './ranking/ranking.component';
export const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'registrar', component: RegistrarComponent },
{ path: 'menu', component: MenuPrincipalComponent },
{ path: 'prediccion', component: IngresarResultadosComponent },
{ path: 'fixture/:id', component: FixtureComponent },
{ path: 'championships', component: ChampionshipsComponent },
{ path: 'championship-crud', component: CrearCampeonatoComponent },
{ path: 'ranking/:id', component: RankingComponent},
{ path: '**', redirectTo: '/login' }
];
