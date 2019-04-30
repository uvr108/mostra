import { Component, OnInit, ViewChild,  AfterViewInit } from '@angular/core';
import { ChartErrorEvent, ChartEvent, GoogleChartComponent } from '../public_api/public_api';

@Component({
  selector: 'app-ratios',
  templateUrl: './ratios.component.html',
  styleUrls: ['./ratios.component.css'],
  styles: [':host > *:not(h1) { display: inline-block !important; }']
})
export class RatiosComponent implements OnInit ,  AfterViewInit {

  constructor() { }

  charts: Array<{
    title: string,
    type: string,
    columnNames?: Array<string>,
    width: string,
    height: string,
    data: Array<Array<string | number | {}>>,
    roles: Array<{type: string, role: string, index?: number}>,
    options?: {}
  }> = [];

  @ViewChild('chart') chart: GoogleChartComponent;

  mostra(norte:any,nchico:any,valpo:any,central:any,sur:any, extremo_sur:any) {
          
          let ratios = {'Norte': norte,'N_Chico': nchico,'Valparaiso': valpo,'Central':central,'Sur': sur, 'Extremo_Sur': extremo_sur };  
          
          this.charts=[];

          for ( let r in ratios) { 
           if (ratios[r].length > 0 ) {
             
           console.log(`r : ${r} | ${ratios[r].length} | ${JSON.stringify(ratios[r])}`);
         
          this.charts.push({
            title: r,
            type: 'LineChart',
            columnNames: ['julian','5°', '10°','15°','20°'],
            width: '1200',
            height: '400',
            roles: [], 
            data: ratios[r],
            options: {
              vAxis: {title: 'Estaciones [usadas/disponibles]'},
              hAxis: {title: 'Juliano'},
            }
      
          });
         
         
        }
        }
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

 
   ngAfterViewInit() {};

  ngOnInit() {
  }

}
