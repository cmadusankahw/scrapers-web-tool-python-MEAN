import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { Scraper } from 'src/app/modules/scraper/scraper.model';
import { ScraperService } from 'src/app/modules/scraper/scraper.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-admin-scrapers',
  templateUrl: './admin-scrapers.component.html',
  styleUrls: ['./admin-scrapers.component.scss']
})
export class AdminScrapersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['scraper_id', 'scraper_name', 'description', 'base_url', 'action'];
  dataSource: MatTableDataSource<Scraper>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private scraperSub: Subscription;

  scrapers: Scraper[];

  scraper: Scraper;

  constructor(private scraperService: ScraperService) { }

  ngOnInit() {
    this.scraperService.getAllScrapers();
     this.scraperSub = this.scraperService.getScrapersUpdateListener()
       .subscribe((res: Scraper[]) => {
         if (res) {
           this.scrapers = res;
           this.dataSource = new MatTableDataSource(this.scrapers);
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
         }
    }, (error) => {
      console.log(error);
      });
  }

  ngOnDestroy(){
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
  showScraperDetails(scraperId: string) {
    for (const app of this.scrapers) {
      if (app.scraperId === scraperId) {
        this.scraper = app;
      }
    }
   }

}
