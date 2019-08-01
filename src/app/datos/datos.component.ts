import { Component, OnInit, AfterViewInit  } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { WebsocketService } from '../websocket.service';
import { ConectaService } from '../conecta.service';
import { Message } from '../message';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../environments/environment';


@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  providers: [ ConectaService, WebsocketService,NgxPaginationModule ],
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit, AfterViewInit  {

  title:string="Datos";
  tabla: Object;
  ratios: Object;
  zona : Array<string>;
  p : any;

  my_server_ip = environment.my_server_ip; 

  controlname: Array<Array<string>> = [['opt_n','Norte'],['opt_nc','Norte Chico'],['opt_v','Valparaiso'],
  ['opt_zc','Central'],['opt_s','Sur'],['opt_es','Extremo Sur']];

  periodForm = this.fb.group({

    fecha_ini : ['', [Validators.required]],
    fecha_fin : ['',  [Validators.required]],
    opt_n : ['1'],
    opt_nc : ['1'],
    opt_v : ['1'],
    opt_zc : ['1'],
    opt_s : ['1'], 
    opt_es : ['1'],
  });

  fecha_ini : string;
  fecha_fin : string;

  usadas=[];
  eventos=[];
  // ratios={};

  norte = []; 
  norte_chico = [];
  valparaiso = [];
  central = [];
  sur = [];
  extremo_sur = [];

  tipo='tabla';
  filedir:string;

  cabecera : Array<String> = ['zona','fecha_origen','sfile','latitud','longitud', 'no','cont_5','cont_10','cont_15','cont_20'];

  pull() {

  this.tipo='file';

  const mensaje: Message = {'command': 'download_mostra', 'tipo': 'csv','message': this.tabla};

  console.log(`Message : ${JSON.stringify(mensaje)}`);

  this.dttService.send(mensaje);

  }

  make_period() {

    this.fecha_ini = this.periodForm.value['fecha_ini'];
    this.fecha_fin = this.periodForm.value['fecha_fin'];

    return [this.fecha_ini , this.fecha_fin]
  }

  constructor(private fb: FormBuilder, private dttService: ConectaService ) { 

    this.dttService.stream_msg.subscribe(
      msg => {
        // console.log(`campos : ${JSON.stringify(this.camposForm.value)}`)  
        // console.log('Resiviendo dato');
        // console.log(Object.keys(msg).indexOf('filedir'));

        if (Object.keys(msg).indexOf('filedir') == -1) { 
          this.tabla = msg;
        }
        else { 
          //console.log(`filedir : ${JSON.stringify(msg)}`);
          this.filedir=msg['filedir'];
   
        }    
      });
  }    
  
  ngAfterViewInit() {

    // console.log('after_init');
   
  };

  ngOnInit() {
    // console.log('init');
  }

onSubmit(){
  
  this.tipo='tabla'; 

  var period = this.make_period();
  
  // console.log(`period : ${period}`);

  

  this.zona = [];
  
  this.usadas=[];
  this.eventos=[];

  if ( this.periodForm.value['opt_n'] == true) { this.zona.push('Norte'); };
  if ( this.periodForm.value['opt_nc'] == true) { this.zona.push('N.Chico');  };
  if ( this.periodForm.value['opt_v'] == true) { this.zona.push('Valpo'); };
  if ( this.periodForm.value['opt_zc'] == true) { this.zona.push('Zona.C'); };
  if ( this.periodForm.value['opt_s'] == true) { this.zona.push('Sur');  };
  if ( this.periodForm.value['opt_es'] == true) { this.zona.push('Ext.S');  };

  // console.log(`zona : ${JSON.stringify(this.zona)}`); 

  
  var between = [period[0] + 'T00:00:00+00:00' , period[1]+'T23:59:59+00:00','fecha_origen'];
  var order = {'fecha_origen':'desc'};
  var or = {'zona':this.zona};

  const mensaje: Message = {'command': 'listar', 'tipo': 'rethink',
    'message': {'table': 'informes', 'option': 'select','betweenISO':between, 'or':or, 'order': order}};

  // console.log(`Message : ${JSON.stringify(mensaje)}`);

  this.dttService.send(mensaje);



}


}
