import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Message } from '../message';
import { sprintf } from 'sprintf-js';
import { ConectaService } from '../conecta.service';
import { WebsocketService } from '../websocket.service';
import { DatosComponent } from '../datos/datos.component';
import { EstacionesComponent } from '../estaciones/estaciones.component';
import { EventosComponent } from '../eventos/eventos.component';
import { RatiosComponent } from '../ratios/ratios.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  providers: [
    ConectaService, WebsocketService,
  ],
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild(DatosComponent) private datosComponent: DatosComponent;
  @ViewChild(EstacionesComponent) private estacionesComponent: EstacionesComponent;
  @ViewChild(EventosComponent) eventosComponent: EventosComponent;
  @ViewChild(RatiosComponent) ratiosComponent: RatiosComponent;

  fecha_ini : string;
  fecha_fin : string;

  controlname: Array<Array<string>> = [['opt_n','Norte'],['opt_nc','Norte Chico'],['opt_v','Valparaiso'],
  ['opt_zc','Central'],['opt_s','Sur'],['opt_es','Extremo Sur']];


  periodForm = this.fb.group({
    fecha_ini : ['', [Validators.required]],
    fecha_fin : ['',  [Validators.required]],
    opt_n : [''],
    opt_nc : [''],
    opt_v : [''],
    opt_zc : [''],
    opt_s : [''], 
    opt_es : [''],
  });
 
  zona:Array<string> = [];
  columnas:Array<string> = [];
  ratios={};

  
  datos_tabla: Object;

  constructor(private fb: FormBuilder,private dttService: ConectaService  ) { 

    this.dttService.stream_msg.subscribe(
      msg => {
        console.log('Resiviendo dato');
        this.datos_tabla = msg;    
        this.formatear_datos();
        this.datosComponent.tabla = this.datos_tabla;
        this.estacionesComponent.mostra(this.columnas, this.usadas);
        this.eventosComponent.mostra(this.columnas, this.eventos);
        this.ratiosComponent.mostra(this.zona, this.ratios);
      });
    console.log('Test WS Ok');
  }

  ngAfterViewInit() {};

  ngOnInit() {
  }

  make_period() {

    this.fecha_ini = this.periodForm.value['fecha_ini'];
    this.fecha_fin = this.periodForm.value['fecha_fin'];

    return [this.fecha_ini , this.fecha_fin]
  }

  julian(ano:string,mes:string,dia:string) {

    var now:any = new Date(+ano,+mes,+dia,0,0,0);
    var start:any = new Date(now.getFullYear(+ano,+mes,+dia,0,0,0), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return sprintf('%03d', day);
  }


  get_julian(period:Array<String>) {

    var p1 = period[0].split('-');
    var p2 = period[1].split('-');

    return [[p1[0], this.julian(p1[0],p1[1],p1[2])],[p2[0], this.julian(p2[0],p2[1],p2[2])]]
  }

  usadas=[];
  eventos=[];
  
  ratios_norte=[];
  ratios_nchico=[];
  ratios_valpo=[];
  ratios_central=[];
  ratios_sur=[];
  ratios_exts=[];

  average(arr) {
     
    var sum = 0;
    var avg = 0;

    if (arr.length)
    {
       sum = arr.reduce(function(a, b) { return a + b; });
       avg = sum / arr.length;
    } 
    return avg;
 }


  formatear_datos(){

    let data_usadas = [];
    let data_eventos = [];
    let data_ratios = [];
    let usadas:any;
    let eventos:any;
    let ratios=[];
    let usadas_arr=[];
    let eventos_arr=[];
    let average_usadas: Number;
    let average_eventos: Number;
    let jl: String;
    
    let ratios_norte=[];
    let ratios_nchico=[];
    let ratios_valpo=[];
    let ratios_central=[];
    let ratios_sur=[];
    let ratios_exts=[];

    for ( let d in this.datos_tabla){
        average_usadas = 0;
        average_eventos = 0;
        jl = '';

        usadas=0;
        eventos=0;
        ratios=[];

        usadas_arr=[];
        eventos_arr=[];

        data_usadas=[];
        data_eventos=[];
        data_ratios=[];

        ratios_norte=[];
        ratios_nchico=[];
        ratios_valpo=[];
        ratios_central=[];
        ratios_sur=[];
        ratios_exts=[];

        jl = this.datos_tabla[d]['jl'];
        
        data_usadas.push(jl);
        data_eventos.push(jl);
        
        let rjs = {};  // alberga los ratios

        for (let z in this.zona) {
            if (Object.keys(this.datos_tabla[d]['data']).length==0) {}
            else
            {
                usadas = (this.datos_tabla[d]['data']=={}) ? 0 : this.datos_tabla[d]['data'][this.zona[z]]['usadas'];
                eventos = (this.datos_tabla[d]['data']=={}) ? 0 : this.datos_tabla[d]['data'][this.zona[z]]['eventos'];
            
                rjs = this.datos_tabla[d]['data'][this.zona[z]]['ratio'];

                data_usadas.push(usadas);

                data_eventos.push(eventos);
            
                data_ratios = [jl,rjs['5°'],rjs['10°'],rjs['15°'],rjs['20°']];
           
                if (z=='0') { ratios_norte = data_ratios;}
                if (z=='1') { ratios_nchico = data_ratios;}
                if (z=='2') { ratios_valpo = data_ratios;}
                if (z=='3') { ratios_central = data_ratios;}
                if (z=='4') { ratios_sur = data_ratios;}
                if (z=='5') { ratios_exts = data_ratios};

                usadas_arr.push(usadas);
                eventos_arr.push(eventos);
            }    
        }    
        average_usadas = this.average(usadas_arr);
        average_eventos = this.average(eventos_arr);

        data_usadas.push(average_usadas);
        data_eventos.push(average_eventos);

        this.usadas.push(data_usadas);
        this.eventos.push(data_eventos);

        if (ratios_norte.length>0) this.ratios_norte.push(ratios_norte);
        if (ratios_nchico.length>0) this.ratios_nchico.push(ratios_nchico);
        if (ratios_valpo.length>0) this.ratios_valpo.push(ratios_valpo);
        if (ratios_central.length>0) this.ratios_central.push(ratios_central);
        if (ratios_sur.length>0) this.ratios_sur.push(ratios_sur);
        if (ratios_exts.length>0) this.ratios_exts.push(ratios_exts);
      } 
        this.ratios = {'Norte': this.ratios_norte,'Norte Chico': this.ratios_nchico,
        'Valparaiso': this.ratios_valpo,'Central': this.ratios_central,'Sur' : this.ratios_sur,'Extremo Sur': this.ratios_exts};

   


  };

  onSubmit() {

    var period = this.make_period();
    var jp = this.get_julian(period);
    
    this.zona = [];

    this.columnas.push('juliano');

    if ( this.periodForm.value['opt_n'] == true) { this.zona.push('Norte'); this.columnas.push('Norte'); };
    if ( this.periodForm.value['opt_nc'] == true) { this.zona.push('N.Chico'); this.columnas.push('N.Chico'); };
    if ( this.periodForm.value['opt_v'] == true) { this.zona.push('Valpo'); this.columnas.push('Valpo'); };
    if ( this.periodForm.value['opt_zc'] == true) { this.zona.push('Zona.C'); this.columnas.push('Zona.C'); };
    if ( this.periodForm.value['opt_s'] == true) { this.zona.push('Sur'); this.columnas.push('Sur'); };
    if ( this.periodForm.value['opt_es'] == true) { this.zona.push('Ext.S'); this.columnas.push('Ext.S'); };

    this.columnas.push('promedio');

    const pluck = ['yr', 'jl', {'data': this.zona}];
    const between = [jp[0], jp[1],'yrjl']

    const mensaje: Message = {'command': 'listar','tipo': 'rethink', 
      'message': [{'command': 'listar', 'message': {'table': 'ratio', 'between': between, 'order': 'yrjl', 'option': 'select', 'pluck' : pluck }}]};

    console.log(mensaje);  

    this.dttService.send(mensaje);
    
  }



}
