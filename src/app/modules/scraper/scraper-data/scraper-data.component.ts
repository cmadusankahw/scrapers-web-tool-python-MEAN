import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ScraperRun } from '../scraper.model';
import { ScraperService } from '../scraper.service';


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

  @Input() scraperRuns: ScraperRun[] = [];

  scraperRun: ScraperRun;

  // dynamic table
  columns:Array<any>
  recievedDisplayedColumns:Array<any>
  recievedDataSource:any

  constructor(private scraperService: ScraperService, private authService: AuthService) { }

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
        this.scraperService.getScrapedJSON(this.scraperRun.dataLocation);
        this.scraperSub = this.scraperService.getScrapedJSONUpdatedListener()
          .subscribe((res: any[]) => {
            if (res) {
              const columns = res
              .reduce((columns, row) => {
                return [...columns, ...Object.keys(row)]
              }, [])
              .reduce((columns, column) => {
                return columns.includes(column)
                  ? columns
                  : [...columns, column]
              }, [])
            // Describe the columns for <mat-table>.
            this.columns = columns.map(column => {
              return {
                columnDef: column,
                header: column,
                cell: (element: any) => `${element[column] ? element[column] : ``}`
              }
            })
            this.recievedDisplayedColumns = this.columns.map(c => c.columnDef);
            // Set the dataSource for <mat-table>.
            this.recievedDataSource = res
            }
       });

      }
    }
   }

  // get date from timestamp
  convertTimeStamptoDate(timestamp: number){
    return new Date(timestamp).toLocaleString();
  }

  // remove a dataset
  removeScraperRun(scraperRunId){
    this.authService.removeScraperRun(this.scraperId, scraperRunId);
  }

  downloadCSV(){
    this.scraperService.downloadDataCSV(this.scraperRun.dataLocation);
  }

}
