import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { WebsocketService } from '../websocket.service';
import { ConectaService } from '../conecta.service';
import { Message } from '../message';
import { Validators, FormBuilder } from '@angular/forms';
import { isNull } from 'util';

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

  make_period() {

    this.fecha_ini = this.periodForm.value['fecha_ini'];
    this.fecha_fin = this.periodForm.value['fecha_fin'];

    return [this.fecha_ini , this.fecha_fin]
  }

  tipo='tabla';

  periodForm = this.fb.group({

    fecha_ini : ['', [Validators.required]],
    fecha_fin : ['',  [Validators.required]],
    /*opt_n : ['1'],
    opt_nc : ['1'],
    opt_v : ['1'],
    opt_zc : ['1'],
    opt_s : ['1'], 
    opt_es : ['1'],*/
    pup : [false],
    sensible: ['_ambos']
  });

  fecha_ini : string;
  fecha_fin : string;

  filedir:string;

  // cabecera : Array<String> = ['sfile','action','latitud','longitud','m1_magnitud','m1_magnitud','m1_tipo','m5','m20','no','operator','email_origen','retardo','sensible','tipo_estadistica','up','version'];
  cabecera : Array<String> = ['sfile','action','fecha_origen','operator','latitud','longitud','dep','m1_magnitud','m1_tipo','no','m5','m20','email_origen','retardo','sensible','tipo_estadistica','up','version'];

  constructor(private fb: FormBuilder, private dttService: ConectaService) { 
    this.dttService.stream_msg.subscribe(
      msg => {
  

        if (Object.keys(msg).indexOf('filedir') == -1) { 
          this.tabla = msg;
        }
        else { 
          console.log(`filedir : ${JSON.stringify(msg)}`);
          this.filedir=msg['filedir'];
   
        }    
      });

  
  }
    ngOnInit() {
  }

  pull() {

    this.tipo='file';
  
    const mensaje: Message = {'command': 'download_mostra', 'tipo': 'csv','message': this.tabla};
  
    console.log(`Message : ${JSON.stringify(mensaje)}`);
  
    this.dttService.send(mensaje);
  
    }

  onSubmit() {
  
    this.tipo='tabla'; 

    var period = this.make_period();
  
    console.log(`period : ${period}`);
    console.log(`periodForm : ${JSON.stringify(this.periodForm.value)}`);

    var between = [period[0] + 'T00:00:00+00:00' , period[1]+'T23:59:59+00:00','fecha_origen'];

    var between = [period[0] + 'T00:00:00+00:00' , period[1]+'T23:59:59+00:00','fecha_origen'];
    var order = {'fecha_origen':'desc','version':'desc'};
    
    var where={};
    var or={};

    if (this.periodForm.value.pup) { 
        or['up'] = [0,null];
    }

    switch (this.periodForm.value.sensible) {
      case '_ambos' : {          
          break;
      }
      case '_sensibles' : {
          where['sensible'] = true;
          break;
      }
      case '_nosensible' : {
          where['sensible'] = false;
          break;     
      }
    }
    
    console.log(`where : ${JSON.stringify(where)}`);

    const mensaje: Message = {'command': 'listar', 'tipo': 'rethink', 
    'message': {'table': 'analisis', 'option': 'select','betweenISO':between,
    'where' : where, 'order': order, 'or':or}};

    console.log(`Message : ${JSON.stringify(mensaje)}`);

    this.dttService.send(mensaje);
    
  }

}
