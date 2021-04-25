
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { Scraper } from '../scraper.model';
import { ScraperService } from '../scraper.service';

@Component({
  selector: 'app-scrapers-list',
  templateUrl: './scrapers-list.component.html',
  styleUrls: ['./scrapers-list.component.scss']
})
export class ScrapersListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['scraperIcon', 'description', 'baseURL',  'action'];
  dataSource: MatTableDataSource<Scraper>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // subscritions

  private scraperSub: Subscription;

  scrapers: Scraper[] = [];

  scraper: Scraper;

  constructor( private scraperService: ScraperService) { }

  ngOnInit() {
    // get user scrapers
   this.scraperService.getUserScrapers();
   this.scraperSub = this.scraperService.getUserScrapersUpdateListener().subscribe(
     res => {
       if (res) {
         this.scrapers = res;
         this.dataSource = new MatTableDataSource(this.scrapers);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
      }
     });
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


}
