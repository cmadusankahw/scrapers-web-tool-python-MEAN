import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { ScraperRun } from '../scraper.model';


@Component({
  selector: 'app-scraper-data',
  templateUrl: './scraper-data.component.html',
  styleUrls: ['./scraper-data.component.scss']
})
export class ScraperDataComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['scraperId', 'scraperName', 'lastRun', 'noOfRuns', 'status','action'];
  dataSource: MatTableDataSource<ScraperRun>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // subscritions
  private scraperSub: Subscription;

  @Input() scraperName: string;

  @Input() scraperId: string;

  @Input() scraperRuns: ScraperRun[];

  scraperRun: ScraperRun;

  constructor() { }

  ngOnInit() {
         this.dataSource = new MatTableDataSource(this.scraperRuns);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
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

  // get selected scraper run details
  showScraperRunDetails(scraperRunId: string) {
    for (const app of this.scraperRuns) {
      if (app.scraperRunId === scraperRunId) {
        this.scraperRun = app;
      }
    }
  }

  // get date from timestamp
  convertTimeStamptoDate(timestamp: number){
    return new Date(timestamp).toLocaleString();
  }

}
