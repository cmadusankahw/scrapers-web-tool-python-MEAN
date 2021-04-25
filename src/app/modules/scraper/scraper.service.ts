import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import {  DashStat, ResultUpdated, Scraper, ScraperRun } from './scraper.model';
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
  deleteScraperRun,
  getUserScraperStatus,
  postUpdateUserScraperStatus,
  getScrapedJSONData,
  postDownloadCSV} from  './scraper.config';

@Injectable({providedIn: 'root'})
export class ScraperService {
  private dashStatUpdated = new Subject<DashStat>();
  private scraperUpdated = new Subject<Scraper>();
  private scrapersUpdated = new Subject<Scraper[]>();
  private userScrapersUpdated = new Subject<Scraper[]>();
  private resultsUpdated = new Subject<ResultUpdated>();
  private scrapedJSONUpdated = new Subject<any[]>();
  private scraperStatusUpdated = new Subject<string>();


  private scraper: Scraper;
  private scrapers: Scraper[];
  private userScrapers: Scraper[];
  private scraperStatus: string;

  // script execution related
  downloadable = false;

    // snack bars for notification display
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private http: HttpClient,
              private router: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) {}


  // GET
  getScraper(scraperId){
    this.http.get<{scraper: Scraper}>(url + getScraper + scraperId)
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

  // user Id from backend
  getUserScrapers(){
    this.http.get<{message:string, scrapers: Scraper[]}>(url + getUserScrapers)
    .subscribe((res) => {
      console.log(res.message);
      this.userScrapers = res.scrapers;
      this.userScrapersUpdated.next(this.userScrapers);
    });
  }

   // userId from backend
  getUserScraperStatus(scraperId) {
    this.http.get<{message: string, status: string}>(url + getUserScraperStatus + scraperId)
    .subscribe((res) => {
      console.log(res.message);
      this.scraperStatus = res.status;
      this.scraperStatusUpdated.next(this.scraperStatus);
    });
  }


  // get JSON table data
  getScrapedJSON(dataLocation: string){
    // code here
    this.http.post<{JSONData: any[]}>(url + getScrapedJSONData , {dataLocation} )
    .subscribe((res) => {
      this.scrapedJSONUpdated.next(res.JSONData);
    });
  }

  // download data to csv
  downloadDataCSV(dataLocation: string){
    // code here
    this.http.post<{jsonObj: string}>(url + postDownloadCSV , {dataLocation} )
    .subscribe((res) => {
      if (res) {
        console.log(res)
          this._snackBar.open('Data CSV downloading started...', 'Dismiss', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          });
      }
    });
  }

  // POST, PUT
  runScraper(scraper: Scraper) {
    this._snackBar.open('Scraper execution started...', 'Dismiss', {
      duration: 2500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      });
    this.http.post<{
          message: string,
          result: string,
          scraperRunId: string, // creates a new scraperRun and returns the ID
          status: boolean }>(url + postRunScraper , scraper)
    .subscribe((recievedData) => {
    console.log(recievedData.message);
    this.resultsUpdated.next({result: recievedData.result, scraperRunId: recievedData.scraperRunId, status: recievedData.status});
    }, (error) => {
    console.log(error);
    });
  }

  // update user scraper status runnig , failed, or ideal
  updateUserScraperStatus(scraperId, status){
    this.http.post<{
          message: string
        }>(url + postUpdateUserScraperStatus , {scraperId, status})
    .subscribe((recievedData) => {
      if (recievedData) {
        console.log(recievedData.message);
        this.scraperStatusUpdated.next(status);
      }
    }, (error) => {
    console.log(error);
    });
  }

  updateScraper(scraper: Scraper) {
    // code here
  }

  terminateScraper(scraper: Scraper) {
    // code here
    this._snackBar.open('Scraper execution terminated', 'Dismiss', {
      duration: 2500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      });
  }

  // check runnig status
  checkScraperStatus(scraper: Scraper){
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

  getResultsUpdateListener() {
    return this.resultsUpdated.asObservable();
  }

  getScrapedJSONUpdatedListener() {
    return this.scrapedJSONUpdated.asObservable();
  }

  getScraperStatusUpdatedListener() {
    return this.scraperStatusUpdated.asObservable();
  }




}
