import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scraper } from '../scraper.model';
import { ScraperService } from '../scraper.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


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

  categories = new FormControl('',[
    Validators.required,
  ]);

  locations = new FormControl('',[
    Validators.required,
  ]);

  scraper: Scraper;

  selectedLocations = [];

  selectedCategories = [];

  timestamp: number;

  noOfdays: number = 0;

  today = new Date();

  matcher = new MyErrorStateMatcher();


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
  runScraper(runMode: string, noOfdays:number) {
    // this.results +="\nScraper execution started... Please wait...";
    if(!this.selectedCategories.length) {
      this.selectedCategories.push('all');
    }
    if(!this.selectedLocations.length) {
      this.selectedLocations.push('any');
    }
    this.scraperService.updateUserScraperStatus(this.scraperId, 'running');

    this.scraperService.runScraper(runMode, noOfdays, this.scraper, this.selectedLocations, this.selectedCategories);

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
