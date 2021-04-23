import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { ScraperRun } from '../../../scraper.model';
import { ScraperService } from '../../../scraper.service';

@Component({
  selector: 'app-dash-data',
  templateUrl: './dash-data.component.html',
  styleUrls: ['./dash-data.component.scss']
})
export class DashDataComponent implements OnInit {

  displayedColumns: string[] = ['passengerId', 'passengerName','passengerMobile', 'pickup', 'dropoff','regDate', 'status', 'action'];
  dataSource: MatTableDataSource<ScraperRun>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // subscritions
  private scraperSub: Subscription;

  scrapers: ScraperRun[] = [
    {
      scraperRunId: 'U1S12345678',
      userId: 'U1',
      scraperId: 'S1',
      timestamp: 2345678,
      noOfRuns: 1,
      noOfCols: 15,
      noOfRows: 2870,
      executed_params:{
        categories: ['all'],
        locations: ['any'],
      },
      dataLocation: 'sdcrapers/data/rainbowpages.csv',
      dataFormat: 'csv',
      status: 'success'
    },
  ];

  scraper: ScraperRun;

  constructor( private scraperService: ScraperService) { }

  ngOnInit() {
  //  this.adminService.getPassengers();
  //  this.passengerSub = this.adminService.getPassengersUpdateListener().subscribe(
  //    res => {
  //      if (res) {
        //  this.passengers = res;
         this.dataSource = new MatTableDataSource(this.scrapers);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
    //   }
    //  });
  }


  ngOnDestroy() {

    if (this.scraperSub) {
      this.scraperSub.unsubscribe();
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // get selected driver details
  showUsertDetails(scraperRunId: string) {
    for (const app of this.scrapers) {
      if (app.scraperRunId === scraperRunId) {
        this.scraper = app;
      }
    }
  }


}
