import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scraper } from '../../scraper/scraper.model';
import { ScraperService } from '../../scraper/scraper.service';


@Component({
  selector: 'app-admin-scraper-details',
  templateUrl: './admin-scraper-details.component.html',
  styleUrls: ['./admin-scraper-details.component.scss']
})
export class AdminScraperDetailsComponent implements OnInit, OnDestroy {

  private scraperSub: Subscription;

  private scraperId: string;

  scraperStatus: string;

  categories = new FormControl();

  locations = new FormControl();

  scraper: Scraper;

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
          this.scraper = rec;
      }, (error) => {
    console.log(error);
    });
  }

  ngOnDestroy() {
    if (this.scraperSub) {
      this.scraperSub.unsubscribe();
    }

  }


  removeScraper(scraperId) {
    this.scraperService.removeScraper(scraperId);
  }


}

