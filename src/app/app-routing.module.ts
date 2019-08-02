import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { DatosComponent } from './datos/datos.component';
import { EstacionesComponent } from './estaciones/estaciones.component';
import { EventosComponent } from './eventos/eventos.component';
import { RatiosComponent } from './ratios/ratios.component';
import { AnalisisComponent} from './analisis/analisis.component';

const routes: Routes = [
  
  { path: '404', redirectTo: '/', pathMatch: 'full' },
  { path:'menu', component: MenuComponent},
  { path:'datos', component: DatosComponent},
  { path:'analisis', component: AnalisisComponent},
  { path:'estaciones', component: EstacionesComponent},
  { path:'eventos', component: EventosComponent},
  { path:'ratios', component: RatiosComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
