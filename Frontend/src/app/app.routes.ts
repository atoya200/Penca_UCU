import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { IngresarResultadosComponent } from './ingresar-resultados/ingresar-resultados.component';
import { FixtureComponent } from './fixture/fixture.component';

export const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full'},

{ path: 'login', component: LoginComponent},
{ path: 'registrar', component: RegistrarComponent},
{ path: 'menu', component: MenuPrincipalComponent},
{ path: 'prediccion', component: IngresarResultadosComponent},
{ path: 'fixture', component: FixtureComponent}
];
