import { Component, OnInit } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  providers: [ NgxPaginationModule ],
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

  title:string="Datos";
  tabla: Object;
  cabecera: Array<string> = ['yr','jl','data'];

  constructor() { }

  ngOnInit() {
  }

}
