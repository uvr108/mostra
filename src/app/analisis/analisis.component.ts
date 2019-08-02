import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { WebsocketService } from '../websocket.service';
import { ConectaService } from '../conecta.service';
import { Message } from '../message';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../environments/environment';

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

  p : any; 

  my_server_ip = environment.my_server_ip; 

  periodForm = this.fb.group({

    fecha_ini : ['', [Validators.required]],
    fecha_fin : ['',  [Validators.required]],

    pup : [false],
    sensible: ['_ambos']
  });

  fecha_ini : string;
  fecha_fin : string;

  tipo='tabla';
  filedir:string;

  cabecera : Array<String> = ['sfile','action','fecha_origen','operator','latitud','longitud','dep','m1_magnitud','m1_tipo','no','m5','m20','email_origen','retardo','sensible','tipo_estadistica','up','version'];

  pull() {

    this.tipo='file';
    const epochNow = (new Date).getTime();
    this.filedir = String(epochNow);
  
    const mensaje: Message = {'command': 'download_mostra', 'tipo': 'csv','message': [this.filedir, this.tabla]};

    this.dttService.send(mensaje);
  
  }

  make_period() {

    this.fecha_ini = this.periodForm.value['fecha_ini'];
    this.fecha_fin = this.periodForm.value['fecha_fin'];

    return [this.fecha_ini , this.fecha_fin]
  }

  constructor(private fb: FormBuilder, private dttService: ConectaService) { 
    this.dttService.stream_msg.subscribe(
      msg => {

          this.tabla = msg;
    
      });
  }

  ngAfterViewInit() {
    
  };

    ngOnInit() {
  }

  onSubmit() {
  
    this.tipo='tabla'; 

    var period = this.make_period();
  
    var between = [period[0] + 'T00:00:00+00:00' , period[1]+'T23:59:59+00:00','fecha_origen'];

    var between = [period[0] + 'T00:00:00+00:00' , period[1]+'T23:59:59+00:00','fecha_origen'];
    var order = {'oid':'desc','version':'desc'};
    
    var where={};
    var or={};

    if (this.periodForm.value.pup) { 
        or['up'] = [0,null];
    }

    switch (this.periodForm.value.sensible) {
      case '_ambos' : {          
          break;
      }
      case '_sensible' : {
          where['sensible'] = true;
          break;
      }
      case '_nosensible' : {
          where['sensible'] = null;
          break;     
      }
    }
    
    const mensaje: Message = {'command': 'listar', 'tipo': 'rethink', 
    'message': {'table': 'analisis', 'option': 'select','betweenISO':between,
    'where' : where, 'order': order, 'or':or}};

    this.dttService.send(mensaje);
    
  }

}
