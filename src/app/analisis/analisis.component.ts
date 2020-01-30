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

    pversion : [false],
    evaluation_status : ['_ambos'],
    sensible: ['_ambos']
  });

  fecha_ini : string;
  fecha_fin : string;

  tipo='tabla';
  filedir:string;

  cabecera : Array<String> = ['event_id','fecha_even','lat','lon','mag','mag_type','author','process_delay','email_delay','evaluation_status',
  'n20','n5','sensible','station_count','user','version'];

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
    console.log(`FECHAS : ${JSON.stringify(this.fecha_ini)} ${JSON.stringify(this.fecha_fin)}`); 
    return [this.fecha_ini , this.fecha_fin]
  }

  constructor(private fb: FormBuilder, private dttService: ConectaService) { 
    this.dttService.stream_msg.subscribe(
      msg => {

          this.tabla = msg;
          // console.log(`this.tabla ${JSON.stringify(this.tabla)}`)
    
      });
  }

  ngAfterViewInit() {
    
  };

  ngOnInit() {
    
  }

  onSubmit() {
  
    this.tipo='tabla'; 
    
    var period = this.make_period();
    var between = [period[0] + 'T00:00:00+00:00' , period[1]+'T23:59:59+00:00','fecha_even'];
    var order = {'event_id':'desc','version':'desc'};
    var where={};
    var or={};

    if (this.periodForm.value.pversion) { 
        or['version'] = [0,null];
    }

    // console.log(`between : ${JSON.stringify(between)}`);
  
    switch (this.periodForm.value.evaluation_status) {
      case '_ambos' : {          
          break;
      }
      case '_preliminar' : {
          where['evaluation_status'] = 'preliminary';
          break;
      }
      case '_final' : {
          where['evaluation_status'] = 'final';
          break;     
      }
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
    // 
    const mensaje: Message = {'command': 'listar', 'tipo': 'rethink', 
    'message': {'table': 'seiscomp', 'option': 'select','betweenISO':between,
    'where' : where, 'order': order, 'or':or}};

    // console.log(`mensaje : ${JSON.stringify(mensaje)}`); 

    this.dttService.send(mensaje);
    
  }

}
