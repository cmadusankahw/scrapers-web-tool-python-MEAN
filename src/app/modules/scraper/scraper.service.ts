import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import {  DashStat, Scraper, ScraperRun } from './scraper.model';
import {url,
  getDashStat,
  getScraper,
  getAllScrapers,
  getUserScrapers,
  getUserScraperRuns,
  putUpdateUser,
  putUpdateScraper,
  postRunScraper,
  deleteScraper,
  deleteScraperRun} from  './scraper.config';

@Injectable({providedIn: 'root'})
export class ScraperService {
  private dashStatUpdated = new Subject<DashStat>();
  private scraperUpdated = new Subject<Scraper>();
  private scrapersUpdated = new Subject<Scraper[]>();
  private userScrapersUpdated = new Subject<Scraper[]>();
  private scraperRunUpdated = new Subject<ScraperRun>();
  private scraperRunsUpdated = new Subject<ScraperRun[]>();


  private dashStat: DashStat;
  private scraper: Scraper;
  private scrapers: Scraper[];
  private userScrapers: Scraper[];
  private scraperRun: ScraperRun;
  private scraperRuns: ScraperRun[];

    // snack bars for notification display
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private http: HttpClient,
              private router: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) {}


  // GET
  getScraper(scraperId){
    this.http.get<{scraper: Scraper}>(url + getScraper)
    .subscribe((res) => {
      this.scraper = res.scraper;
      this.scraperUpdated.next(this.scraper);
    });
  }

  getAllScrapers(){
    this.http.get<{scrapers: Scraper[]}>(url + getAllScrapers)
    .subscribe((res) => {
      this.scrapers = res.scrapers;
      this.scrapersUpdated.next(this.scrapers);
    });
  }

  getUserScrapers(){
    this.http.get<{scrapers: Scraper[]}>(url + getUserScrapers)
    .subscribe((res) => {
      this.userScrapers = res.scrapers;
      this.userScrapersUpdated.next(this.userScrapers);
    });
  }

    // dashboard page
  getDashStat() {
    this.http.get<{dashboardData: DashStat}>(url + getDashStat)
    .subscribe((res) => {
      this.dashStat = res.dashboardData;
      this.dashStatUpdated.next(this.dashStat);
    });
  }

  getUserScraperRuns(userId){
    this.http.get<{scraperRuns: ScraperRun[]}>(url + getUserScraperRuns + userId)
    .subscribe((res) => {
      this.scraperRuns = res.scraperRuns;
      this.scraperRunsUpdated.next(this.scraperRuns);
    });
  }



  // POST, PUT
  RunScraper(scraper: Scraper) {
    this.http.post<{
          message: string,
          result: string,
          status: string }>(url + postRunScraper , scraper)
    .subscribe((recievedData) => {
    console.log(recievedData.message);
       return {
         result: recievedData.result,
         status: recievedData.status
        }
    }, (error) => {
    console.log(error);
        return null;
    });
  }

  updateScraper(scraper: Scraper) {
    // code here
  }


  // DELETE

  removeScraper(scraperId){
    this.http.delete<{ message: string }>(url + deleteScraper + scraperId)
    .subscribe((recievedData) => {
      if (this.scrapers.length) {
        const updatedscrapers = this.scrapers.filter(scr => scr.scraperId !== scraperId);
        this.scrapers = updatedscrapers;
        this.scrapersUpdated.next(this.scrapers);
        this._snackBar.open('Scraper :' + scraperId + ' removed!', 'Dismiss', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          });
      }
      }, (error) => {
        console.log(error);
        });
  }


  removeScraperRun(scraperRunId){
    this.http.delete<{ message: string }>(url + deleteScraperRun + scraperRunId)
    .subscribe((recievedData) => {
      if (this.scrapers.length) {
        const updatedscraperRuns = this.scraperRuns.filter(scr => scr.scraperRunId !== scraperRunId);
        this.scraperRuns = updatedscraperRuns;
        this.scrapersUpdated.next(this.scrapers);
        this._snackBar.open('Scraper Eun entry and dataset removed!', 'Dismiss', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          });
      }
      }, (error) => {
        console.log(error);
        });
  }


  // listners for subjects

  getDashStatUpdateListener() {
    return this.dashStatUpdated.asObservable();
  }

  getScraprUpdateListener() {
    return this.scraperUpdated.asObservable();
  }

  getScrapersUpdateListener() {
    return this.scrapersUpdated.asObservable();
  }

  getUserScrapersUpdateListener() {
    return this.userScrapersUpdated.asObservable();
  }

  getScraperRunUpdateListener() {
    return this.scraperRunUpdated.asObservable();
  }

  getScraperRunsUpdateListener() {
    return this.scraperRunsUpdated.asObservable();
  }



}
