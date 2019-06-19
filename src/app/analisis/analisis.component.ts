import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { WebsocketService } from '../websocket.service';
import { ConectaService } from '../conecta.service';
import { Message } from '../message';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  providers: [ ConectaService, WebsocketService,NgxPaginationModule ],
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit {

  title:string="Analisis";
  tabla: Object;
  ratios: Object;
  zona : Array<string>;

  // cabecera : Array<String> = ['sfile','action','latitud','longitud','m1_magnitud','m1_magnitud','m1_tipo','m5','m20','no','operator','email_origen','retardo','sensible','tipo_estadistica','up','version'];
  cabecera : Array<String> = ['sfile','action','fecha_origen','operator','latitud','longitud','m1_magnitud','no','m5','m20','email_origen','retardo','sensible','tipo_estadistica','up','version'];

  constructor(private fb: FormBuilder, private dttService: ConectaService) { 
    this.dttService.stream_msg.subscribe(
      msg => {
  
        console.log('Resiviendo datos analisis');
        console.log(msg);
        this.tabla = msg;
      });
  }
    ngOnInit() {
  }

  carga_datos(period:string) {
  
    var between = [period['fecha_ini'] + 'T00:00:00+00:00' , period['fecha_fin']+'T23:59:59+00:00','fecha_origen'];
    var order = {'version':'desc'};
    var pluck = {'fecha_origen':['sfile','action','fecha_origen','latitud','longitud','m1_magnitud',
    'm1_magnitud','m1_tipo','m5','m20','no','operator','email_origen','retardo','sensible','tipo_estadistica','up','version']}

    const mensaje: Message = {'command': 'listar', 'tipo': 'rethink',
    'message': {'table': 'analisis', 'option': 'select','betweenISO':between, 'order': order}};

    console.log(`Message : ${JSON.stringify(mensaje)}`);

    this.dttService.send(mensaje);
    
  }

}
