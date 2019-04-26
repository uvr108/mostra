import { Component, OnInit, ViewChild,AfterViewInit  } from '@angular/core';
import { ChartErrorEvent, ChartEvent, GoogleChartComponent } from '../public_api/public_api';

@Component({
  selector: 'app-estaciones',
  templateUrl: './estaciones.component.html',
  styles: [':host > *:not(h1) { display: inline-block !important; }']
})
export class EstacionesComponent implements OnInit, AfterViewInit {

  charts: Array<{
    title: string,
    type: string,
    width: string,
    height: string,
    data: Array<Array<string | number | {}>>,
    roles: Array<{type: string, role: string, index?: number}>,
    columnNames?: Array<string>,
    options?: {}
  }> = [];

  title: string = 'Estaciones';
  

  @ViewChild('chart') chart: GoogleChartComponent;

  constructor() {
  }

  ngOnInit() {}

  ngAfterViewInit() {};

  mostra(zona:Array<string>, datos: Array<[]>) {
     let num = zona.length - 2;
     let serie = {};

     if (num == 7) { serie = { 7 : {type: 'line'}};}
     else if (num == 6) { serie = { 6 : {type: 'line'}};}
     else if (num == 5) { serie = { 5 : {type: 'line'}};}
     else if (num == 4) { serie = { 4 : {type: 'line'}};}
     else if (num == 3) { serie = { 3 : {type: 'line'}};}
     else if (num == 2) { serie = { 2 : {type: 'line'}};}
     else if (num == 1) { serie = { 1 : {type: 'line'}};}
     else { console.log('Mierda !!!!!!!!!'); }
    
     this.charts.push({
        title: 'Estaciones',
        width: '1600',
        height: '600',
        type: 'ComboChart',
        columnNames: zona,
        data:   datos 
        ,
        roles: [],
        options: {
            vAxis: {title: 'Estaciones'},
            hAxis: {title: 'Juliano'},
            seriesType: 'bars',
            series: serie 
        }
    });
  }

  onReady() {
    console.log('Chart ready');
    // console.log(this.get_zones());
  }

  onError(error: ChartErrorEvent) {
    console.error('Error: ' + error.message.toString());
  }

  onSelect(event: ChartEvent) {
    console.log('Selected: ' + event.toString());
  }

  onMouseEnter(event: ChartEvent) {
    console.log('Hovering ' + event.toString());
  }

  onMouseLeave(event: ChartEvent) {
    console.log('No longer hovering ' + event.toString());
  }
}
