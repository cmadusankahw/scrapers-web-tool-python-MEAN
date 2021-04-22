import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-users-pie-chart',
  templateUrl: './admin-users-pie-chart.component.html',
  styleUrls: ['./admin-users-pie-chart.component.scss']
})
export class AdminUsersPieChartComponent implements OnInit {


  chartType = 'doughnut';

  public chartDatasets: Array<any> = [
    { data: [0, 0  ], label: 'users' }
  ];

  public chartLabels: Array<any> = ['Sellers', 'Service Providers'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1'],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };


  constructor() { }

  ngOnInit() {
  }

}
