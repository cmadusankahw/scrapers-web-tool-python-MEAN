import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scraper } from '../../scraper/scraper.model';
import { ScraperService } from '../../scraper/scraper.service';

@Component({
  selector: 'app-admin-add-scraper',
  templateUrl: './admin-add-scraper.component.html',
  styleUrls: ['./admin-add-scraper.component.scss']
})
export class AdminAddScraperComponent implements OnInit, OnDestroy {

  private lastIdSub: Subscription;

  private scraperSub: Subscription;

  scraper: Scraper;

  scraperId: string;

  categories = '';

  locations = '';

  tags = '';

  constructor(private scraperService: ScraperService,  private route: ActivatedRoute) {
    if (route.snapshot.params.id) {
      this.scraperId = route.snapshot.params.id;
    }
   }

  ngOnInit() {
    if (this.scraperId) {
      this.scraperService.getScraper(this.scraperId);
      this.scraperSub = this.scraperService.getScraprUpdateListener()
        .subscribe((scraper: Scraper) => {
            this.scraper = scraper;
            this.categories = scraper.params.categories.join();
            this.locations = scraper.params.locations.join();
            this.tags = scraper.tags.join();
        }, (error) => {
      console.log(error);
      });
    } else {
      this.scraperService.getLastScraperId();
      this.lastIdSub = this.scraperService.getLastScraperIdUpdatedListener()
        .subscribe((lastId: string) => {
            this.scraper = {
              scraperId: lastId,
            scraperName: '',
            description: '',
            tags: [],
            baseURL: '',
            scraperLocation: '',
            script: '',
            updaterMode: false,
            updaterScript: '',
            params: {
              categories: ['all'],
              locations: ['any']
            },
            price: 0
            }
        }, (error) => {
      console.log(error);
      });
    }

  }

  ngOnDestroy() {
    if (this.lastIdSub) {
      this.lastIdSub.unsubscribe();
    }
    if (this.scraperSub) {
      this.scraperSub.unsubscribe();
    }
  }

  addScraper() {
    this.scraper.params.categories = [... this.categories.split(',')];
    this.scraper.params.locations = [... this.locations.split(',')];
    this.scraper.tags = [... this.tags.split(',')];

    if (this.scraper.updaterScript != '') {
      this.scraper.updaterMode = true;
    }
    this.scraperService.addScraper(this.scraper);
  }

  updateScraper() {
    this.scraperService.updateScraper(this.scraper);
  }

}
