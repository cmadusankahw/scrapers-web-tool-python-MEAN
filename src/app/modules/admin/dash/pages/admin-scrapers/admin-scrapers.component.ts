import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { Scraper } from 'src/app/modules/scraper/scraper.model';
import { ScraperService } from 'src/app/modules/scraper/scraper.service';

@Component({
  selector: 'app-admin-scrapers',
  templateUrl: './admin-scrapers.component.html',
  styleUrls: ['./admin-scrapers.component.scss']
})
export class AdminScrapersComponent implements OnInit, OnDestroy {

  private scraperSub: Subscription;

  scrapers: Scraper[];


  constructor(private scraperService: ScraperService) { }

  ngOnInit() {
    this.scraperService.getAllScrapers();
     this.scraperSub = this.scraperService.getScrapersUpdateListener()
       .subscribe((res: Scraper[]) => {
         if (res) {
           this.scrapers = res;
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

}
