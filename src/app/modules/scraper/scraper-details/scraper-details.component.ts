import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  categories = new FormControl();

  locations = new FormControl();

  scraper: Scraper;

  selectedLocations = [];

  selectedCategories = [];

  timestamp: number;

  today = new Date();


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

  setDate(date: Date){
    this.timestamp = date.getTime();
    console.log(this.timestamp);
  }

  // run scraper
  runScraper(runMode: string) {
    // this.results +="\nScraper execution started... Please wait...";
    this.scraperService.updateUserScraperStatus(this.scraperId, 'running');

    this.scraperService.runScraper(runMode,this.scraper, this.selectedLocations, this.selectedCategories);

  }

  // stop execution
  terminateScraper(scraperId: string) {
    this.scraperService.terminateScraper(scraperId);

    this.scraperService.updateUserScraperStatus(this.scraperId, 'ideal');
  }

  // schedule scraper
  scheduleScraper(timestamp: number){
    this.scraperService.scheduleScraper(this.scraper,timestamp,this.selectedLocations,this.selectedCategories);
  }


}
