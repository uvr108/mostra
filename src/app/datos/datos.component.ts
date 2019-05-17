import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { WebsocketService } from '../websocket.service';
import { ConectaService } from '../conecta.service';
import { Message } from '../message';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  providers: [ ConectaService, WebsocketService,NgxPaginationModule ],
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

  title:string="Datos";
  tabla: Object;
  ratios: Object;
  zona : Array<string>;

  cabecera3: Array<string> = ['sfile','latitud','longitud','dep','m1_magnitud',
  'm1_tipo','m5','m20','no','pup','retardo','sensible','tipo_estadistica','version'];
  cabecera2 : Array<String> = ['yr','jl','data'];
  cabecera : Array<String> = ['zona','fecha_origen','sfile','latitud','longitud', 'no','cont_5','cont_10','cont_15','cont_20'];


  
  constructor(private dttService: ConectaService ) { 

    this.dttService.stream_msg.subscribe(
      msg => {
          
        console.log('Resiviendo dato');
        console.log(msg);
        this.tabla = msg;
      });
  }    
  

  ngOnInit() {
  }

  carga_datos(period:string, zona:Array<string>) {
    console.log(`PERIOD : ${JSON.stringify(period)}`); 
    var between =   {'initial': period['fecha_ini'] + 'T00:00:00+00:00' ,'final': period['fecha_fin']+'T23:59:59+00:00','index': 'fecha_origen'}
    var orderBy = {'order': ['zona','fecha_origen'] , 'tipo':'desc'};
   
    console.log(`ZONA : ${zona}`);

    this.zona = zona;

    console.log( `between : ${JSON.stringify(between)}`);
    const mensaje: Message = {'command': 'listar','tipo': 'rethink', 
      'message': [{'command': 'listar', 'message': {'table': 'informes', 'option': 'select', 'betweenISO':between,'orderBy': orderBy}}]};

    console.log(`Message : ${JSON.stringify(mensaje)}`);

    this.dttService.send(mensaje);
    
  }


}
