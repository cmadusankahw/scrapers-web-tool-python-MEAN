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

  scraperStatus: string;

  categories = new FormControl();

  locations = new FormControl();

  scraper: Scraper;

  // printed status from terminal
  results: string;

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
          this.results = 'Scraper loaded successfully at ' + this.scraper.scraperLocation + '\nScraper is ready to run...'
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
