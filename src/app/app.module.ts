import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { DatosComponent } from './datos/datos.component';
// import { RatiosComponent } from './ratios/ratios.component';
// import { EventosComponent } from './eventos/eventos.component';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { GoogleChartsModule } from 'angular-google-charts';
import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatosComponent } from './datos/datos.component';
import { EstacionesComponent } from './estaciones/estaciones.component';
import { EventosComponent } from './eventos/eventos.component';
import { RatiosComponent } from './ratios/ratios.component';
import { AnalisisComponent } from './analisis/analisis.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DatosComponent,
    EstacionesComponent,
    EventosComponent,
    RatiosComponent,
    AnalisisComponent
    
  ],
  imports: [
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    FormsModule,
    GoogleChartsModule.forRoot('AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'),
    DeviceDetectorModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
