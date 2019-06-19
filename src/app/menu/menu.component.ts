import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Message } from '../message';
import { ConectaService } from '../conecta.service';
import { WebsocketService } from '../websocket.service';
import { DatosComponent } from '../datos/datos.component';
import { EstacionesComponent } from '../estaciones/estaciones.component';
import { EventosComponent } from '../eventos/eventos.component';
import { RatiosComponent } from '../ratios/ratios.component';
import { AnalisisComponent } from '../analisis/analisis.component';

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
  @ViewChild(AnalisisComponent) analisisComponent: AnalisisComponent;

  fecha_ini : string;
  fecha_fin : string;


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
 
  zona:Array<string> = [];
  columnas:Array<string> = [];

  
  datos_tabla: Object;

  constructor(private fb: FormBuilder,private dttService: ConectaService  ) { 

    this.dttService.stream_msg.subscribe(
      msg => {
          
        console.log('Resiviendo dato');
        // console.log(`msg : ${JSON.stringify(msg)}`)
        this.datos_tabla = msg;
        this.formatear_ratios();
        this.formatear_datos();
        this.datosComponent.ratios = this.datos_tabla;
        this.datosComponent.carga_datos(this.periodForm.value, this.zona);
        this.analisisComponent.carga_datos(this.periodForm.value);
        this.estacionesComponent.mostra(this.columnas, this.usadas);
        this.eventosComponent.mostra(this.columnas, this.eventos);
        /*
        console.log(`this.norte : ${JSON.stringify(this.norte)}`);
        console.log(`this.norte_chico : ${ JSON.stringify(this.norte_chico)}`);
        console.log(`this.valparaiso : ${JSON.stringify(this.valparaiso)}`);
        console.log(`this.central : ${JSON.stringify(this.central)}`);
        console.log(`this.sur : ${JSON.stringify(this.sur)}`);
        console.log(`this.extremo_sur : ${JSON.stringify(this.extremo_sur)}`);
        */
        this.ratiosComponent.mostra(this.norte,this.norte_chico,this.valparaiso,
          this.central,this.sur,this.extremo_sur);


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
/*
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

    var j1 = this.julian(p1[0],p1[1],p1[2]);
    var j2 = this.julian(p2[0],p2[1],p2[2]);

    console.log(`p1,p2 : ${p1} ${p2}`);
    console.log(`j1,j2 : ${j1} ${j2}`);

    j1='001'; 
    j2='015';

    return [[p1[0], j1],[p2[0], j2]]
  }
*/
  usadas=[];
  eventos=[];
  ratios={};

  norte = []; 
  norte_chico = [];
  valparaiso = [];
  central = [];
  sur = [];
  extremo_sur = [];

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

  formatear_ratios() {
 
    let tabla = this.datos_tabla;
    let data: Object;
    let jl: Object;
    let jr = [];

    let Norte = [];
    let NChico = [];
    let Valparaiso = [];
    let Central = [];    
    let Sur = [];
    let Extremo_Sur = [];


    // console.log(`zona : ${this.zona}`);

    for (let t in tabla) {
         for (let z in this.zona) {

          try
          {
            data = tabla[t]["data"][this.zona[z]]['ratio'];
            jl = tabla[t]["jl"];
            jr = [jl,data['5°'],data['10°'],data['15°'],data['20°']];
            // console.log(`tabla_tabla : ${jl} ${this.zona[z]} ${JSON.stringify(jr)}`);
          }
          catch (Exception)
          {
            jr = [jl,0,0,0,0];
            // console.log(`tabla_tabla : ${jl} ${this.zona[z]} ${JSON.stringify(jr)}`);     
          }

          if (this.zona[z] == 'Norte') { Norte.push(jr); }
          if (this.zona[z] == 'N.Chico') { NChico.push(jr); } 
          if (this.zona[z] == 'Valpo') { Valparaiso.push(jr); }
          if (this.zona[z] == 'Zona.C') { Central.push(jr); }
          if (this.zona[z] == 'Sur') { Sur.push(jr); }
          if (this.zona[z] == 'Extremo_Sur') { Extremo_Sur.push(jr); }
    
 
         }
    }
    
    this.norte = Norte; 
    this.norte_chico = NChico;
    this.valparaiso = Valparaiso;
    this.central = Central;
    this.sur = Sur;
    this.extremo_sur = Extremo_Sur;
    
  } 

  formatear_datos(){

    let data_usadas = [];
    let data_eventos = [];
    let usadas:any;
    let eventos:any;
    let usadas_arr=[];
    let eventos_arr=[];
    let average_usadas: Number;
    let average_eventos: Number;
    let jl: String;
 
    for ( let d in this.datos_tabla) {

        average_usadas = 0;
        average_eventos = 0;
        jl = '';

        usadas=0;
        eventos=0;
        
        usadas_arr=[];
        eventos_arr=[];

        data_usadas=[];
        data_eventos=[];

        jl = this.datos_tabla[d]['jl'];
        
        data_usadas.push(jl);
        data_eventos.push(jl);

        for (let z in this.zona) {

                try
                {
                  usadas = this.datos_tabla[d]['data'][this.zona[z]]['usadas'];    
                }
                catch (Exception)
                {
                   usadas = 0;
                }

                try
                {
                  eventos = this.datos_tabla[d]['data'][this.zona[z]]['eventos'];
                }
                catch (Exception)
                {
                  eventos = 0;
                }  
               

                data_usadas.push(usadas);
                data_eventos.push(eventos);

                usadas_arr.push(usadas);
                eventos_arr.push(eventos);
          
                
        } 

        average_usadas = this.average(usadas_arr);
        average_eventos = this.average(eventos_arr);

        data_usadas.push(average_usadas);
        data_eventos.push(average_eventos);

        this.usadas.push(data_usadas);
        this.eventos.push(data_eventos);


      } 
        
         // console.log(`columnas : ${JSON.stringify(this.columnas)}`)
         // console.log(`zona : ${this.zona}`);
         // console.log(`usadas : ${JSON.stringify(this.usadas)}`);
         // console.log(`eventos : ${JSON.stringify(this.eventos)}`);
         
  };

 

  onSubmit() {

    var period = this.make_period();
    // var jp = this.get_julian(period);
 
    console.log(`period : ${JSON.stringify(period)}`); 

    this.zona = [];
    this.columnas=[];
    this.usadas=[];
    this.eventos=[];

    this.columnas.push('juliano');

    if ( this.periodForm.value['opt_n'] == true) { this.zona.push('Norte'); this.columnas.push('Norte'); };
    if ( this.periodForm.value['opt_nc'] == true) { this.zona.push('N.Chico'); this.columnas.push('N.Chico'); };
    if ( this.periodForm.value['opt_v'] == true) { this.zona.push('Valpo'); this.columnas.push('Valpo'); };
    if ( this.periodForm.value['opt_zc'] == true) { this.zona.push('Zona.C'); this.columnas.push('Zona.C'); };
    if ( this.periodForm.value['opt_s'] == true) { this.zona.push('Sur'); this.columnas.push('Sur'); };
    if ( this.periodForm.value['opt_es'] == true) { this.zona.push('Ext.S'); this.columnas.push('Ext.S'); };

    console.log(`zona : ${JSON.stringify(this.zona)}`); 

    this.columnas.push('promedio');

    const pluck = ['yr', 'jl', {'data': this.zona}];
    // const get_julian = [[period[0], period[1]],'yrjl'];
    const get_julian = [[period[0],period[1]],'yrjl'];
    const order = {'yr':'asc','jl':'asc'};
  

    const mensaje: Message = {'command': 'listar', 'tipo': 'rethink','message': 
    {'table': 'ratio',  'option': 'select', 'get_julian': get_julian,'pluck' : pluck, 'order': order }};
    console.log(`Message : ${JSON.stringify(mensaje)}`);

    this.dttService.send(mensaje);
    
  }



}
