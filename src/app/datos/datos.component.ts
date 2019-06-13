import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { WebsocketService } from '../websocket.service';
import { ConectaService } from '../conecta.service';
import { Message } from '../message';
import { FormBuilder } from '@angular/forms';


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

  // cabecera3: Array<string> = ['sfile','latitud','longitud','dep','m1_magnitud',
  // 'm1_tipo','m5','m20','no','pup','retardo','sensible','tipo_estadistica','version'];
  // cabecera2 : Array<String> = ['yr','jl','data'];
  campos  : Array<String> = ['zona','fecha_origen','sfile','latitud','longitud', 'no','cont_5',
  'cont_10','cont_15','cont_20','sensible','email_origen','retardo','operario','pup','m5','m20','version','tipo_estadistica'];
  cabecera : Array<String> = ['zona','fecha_origen','sfile','latitud','longitud', 'no','cont_5','cont_10','cont_15','cont_20'];


  camposForm = this.fb.group({
    zona :[true],
    fecha_origen :[true],
    sfile : [true],
    latitud :[true],
    longitud :[true], 
    no : [true],
    cont_5 :[true],
    cont_10 : [true],
    cont_15 : [true],
    cont_20 : [true],
    sensible : [false],
    email_origen : [false],
    retardo : [false],
    operario : [false],
    pup : [false],
    m5 : [false],
    m20 : [false],
    version : [false],
    tipo_estadistica : [false],
  });
 
  
  constructor(private fb: FormBuilder, private dttService: ConectaService ) { 

    this.dttService.stream_msg.subscribe(
      msg => {
        console.log(`campos : ${JSON.stringify(this.camposForm.value)}`)  
        console.log('Resiviendo dato');
        // console.log(msg);
        this.tabla = msg;
      });
  }    
  

  ngOnInit() {
  }

  carga_datos(period:string, zona:Array<string>) {
    console.log(`zona : ${JSON.stringify(zona)}`);
    for (var z in zona)
    {
      console.log({'zona':zona[z]})
    }
    // var where = {'zona':['Norte','Sur']}
    // console.log(`PERIOD : ${JSON.stringify(period)}`); 
    // var between = ['2019-06-01T00:00:00+00:00','2019-06-04T23:59:59+00:00','fecha_origen'];
  
    var between = [period['fecha_ini'] + 'T00:00:00+00:00' , period['fecha_fin']+'T23:59:59+00:00','fecha_origen'];
    var order = {'fecha_origen':'desc'};
    var or = {'zona':zona};
   
    console.log(`ZONA : ${zona}`);

    this.zona = zona;

    const mensaje: Message = {'command': 'listar', 'tipo': 'rethink',
    'message': {'table': 'informes', 'option': 'select','betweenISO':between, 'or':or, 'order': order}};

    console.log(`Message : ${JSON.stringify(mensaje)}`);

    this.dttService.send(mensaje);
    
  }


}
