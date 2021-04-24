import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { SuccessComponent } from 'src/app/success/success.component';
import { Scraper } from '../scraper.model';
import { ScraperService } from '../scraper.service';

@Component({
  selector: 'app-scraper-details',
  templateUrl: './scraper-details.component.html',
  styleUrls: ['./scraper-details.component.scss']
})
export class ScraperDetailsComponent implements OnInit, OnDestroy {

  private scraperSub: Subscription;

  private scraperStatusSub: Subscription;

  private resultsSub: Subscription;

  private scraperId: string;

  scraperStatus: string = 'ideal';

  categories = new FormControl();

  locations = new FormControl();

  scraper: Scraper = {
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
  }

  // printed status from terminal
  results =  'Scraper loaded successfully at ' + this.scraper.scraperLocation + '\nScraper is ready to run...';

  constructor(private router: Router,
              public scraperService: ScraperService,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
                this.scraperId = route.snapshot.params.id;
              }

  ngOnInit() {
    this.scraperService.getScraper(this.scraperId);
    this.scraperSub = this.scraperService.getScraprUpdateListener()
      .subscribe((rec: Scraper) => {
        if (rec) {
          this.scraperService.getUserScraperStatus(this.scraperId);
          this.scraperStatusSub = this.scraperService.getScraperStatusUpdatedListener()
      .subscribe((status: string) => {
        if (status){
          this.scraperStatus = status;
        }
          this.scraper = rec;
      })

        }
  }, (error) => {
    console.log(error);
    });
  }

  ngOnDestroy() {
    if (this.scraperSub) {
      this.scraperSub.unsubscribe();
    }

    if (this.resultsSub) {
      this.resultsSub.unsubscribe();
    }

    if (this.scraperStatusSub) {
      this.scraperStatusSub.unsubscribe();
    }
  }

  // run scraper
  runScraper() {

    this.scraperService.updateUserScraperStatus(this.scraperId, 'running');
    this.scraperStatus = 'running';

    this.scraperService.runScraper(this.scraper);
    this.resultsSub = this.scraperService.getResultsUpdateListener()
      .subscribe((rec: {result: string, status: boolean}) => {
        if (rec) {
          this.results = rec.result;
        }
        if (rec.status) {
          this.dialog.open(SuccessComponent, {data: {message: "Scraping completed successfully! All data extracted and saved!"}});
        } else {
          this.dialog.open(ErrorComponent, {data: {message: "Scraping completed failed! Please retry or contact administrator"}});
        }
      });
  }

  // stop execution
  terminateScraper() {
    this.scraperService.terminateScraper(this.scraper);

    this.scraperService.updateUserScraperStatus(this.scraperId, 'ideal');
    this.scraperStatus = 'ideal';
    console.log(this.scraperStatus);
  }


}
