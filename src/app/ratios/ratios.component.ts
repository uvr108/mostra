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

  norte = [ [ "121", 0.3, 0.18, 0.13, 0.1 ], [ "122", 0.31, 0.2, 0.13, 0.11 ], [ "123", 0.38, 0.22, 0.14, 0.12 ] ];

  mostra(zona:Array<string>, ratios: any) {

    for (let r in ratios) {

      if (ratios[r].length == 0) {}
      else {
          console.log(`ratios : ${r} ${typeof(ratios[r])}  ${JSON.stringify(ratios[r])}`);

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
