
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

  scrapers: Scraper[] = [
    {
      scraperId: 'S1',
      scraperName: 'Rainbow Pages',
      description: 'SLT RAINBOW PAGES is Sri Lanka’s only telephone directory published by SLT Digital Services (Pvt) Ltd [formerly SLT Publications (Pvt) Ltd], a fully-owned subsidiary of Sri Lanka Telecom PLC (SLT) - the pioneer and foremost telecommunication solutions provider to the nation.',
      tags: ['mobile', 'landline', 'phone-book'],
      baseURL: 'https://rainbowpages.lk/',
      scraperLocation: 'scrapers/',
      script: 'python raibow_pages.py ',
      params: {
        categories: ['all', 'advertising', 'agriculture', 'baby goods', 'banking', 'bauty culture', 'computer'],
        locations: ['any', 'colombo', 'matara', 'galle'],
      },
      price: 2499
    },
    {
      scraperId: 'S2',
      scraperName: 'Rainbow Pages',
      description: 'SLT RAINBOW PAGES is Sri Lanka’s only telephone directory published by SLT Digital Services (Pvt) Ltd [formerly SLT Publications (Pvt) Ltd], a fully-owned subsidiary of Sri Lanka Telecom PLC (SLT) - the pioneer and foremost telecommunication solutions provider to the nation.',
      tags: ['mobile', 'landline', 'phone-book'],
      baseURL: 'https://rainbowpages.lk/',
      scraperLocation: 'scrapers/',
      script: 'python raibow_pages.py ',
      params: {
        categories: ['all', 'advertising', 'agriculture', 'baby goods', 'banking', 'bauty culture', 'computer'],
        locations: ['any', 'colombo', 'matara', 'galle'],
      },
      price: 2499
    }
  ];

  scraper: Scraper;

  constructor( private scraperService: ScraperService) { }

  ngOnInit() {
    // get admin for child comp use
  //  this.adminService.getNewDrivers(1);
  //  this.driverSub = this.adminService.getDriversUpdateListener().subscribe(
  //    res => {
  //      if (res) {
  //        this.drivers = res;
         this.dataSource = new MatTableDataSource(this.scrapers);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
  //     }
  //    });
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
  showUsertDetails(scraperId: string) {
    for (const app of this.scrapers) {
      if (app.scraperId === scraperId) {
        this.scraper = app;
      }
    }
  }


}
