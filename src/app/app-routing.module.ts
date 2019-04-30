import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { DatosComponent } from './datos/datos.component';
import { EstacionesComponent } from './estaciones/estaciones.component';
import { EventosComponent } from './eventos/eventos.component';
import { RatiosComponent } from './ratios/ratios.component';

const routes: Routes = [
  { path:'menu', component: MenuComponent},
  { path:'datos', component: DatosComponent},
  { path:'estaciones', component: EstacionesComponent},
  { path:'eventos', component: EventosComponent},
  { path:'ratios', component: RatiosComponent},
  { path: '', redirectTo: 'menu', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
