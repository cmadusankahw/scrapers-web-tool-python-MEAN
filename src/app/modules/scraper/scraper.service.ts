import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import {  CreateRunItem, DashStat, ResultUpdated, Scraper, ScraperRun } from './scraper.model';
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
  postDownloadCSV,
  getLastScraperId,
  postAddScraper,
  postRunUpdater,
  postCreateScraperRunEntry,
  getTerminateScraper,
  postScheduleScraper} from  './scraper.config';
import { SuccessComponent } from 'src/app/success/success.component';
import { ErrorComponent } from 'src/app/error/error.component';

@Injectable({providedIn: 'root'})
export class ScraperService {
  private dashStatUpdated = new Subject<DashStat>();
  private scraperUpdated = new Subject<Scraper>();
  private scrapersUpdated = new Subject<Scraper[]>();
  private userScrapersUpdated = new Subject<Scraper[]>();
  private resultsUpdated = new Subject<ResultUpdated>();
  private scrapedJSONUpdated = new Subject<any[]>();
  private scraperStatusUpdated = new Subject<string>();
  private lastScraperIdUpdated = new Subject<string>();



  private scraper: Scraper;
  private scrapers: Scraper[];
  private userScrapers: Scraper[];
  private lastId: string;

  scraperStatus: string = "ideal";
  results = 'Scraper loaded successfully...\nScraper is ready to run...';

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

  getLastScraperId(){
    this.http.get<{lastid: string}>(url + getLastScraperId )
    .subscribe((res) => {
      this.lastId = res.lastid;
      this.lastScraperIdUpdated.next(this.lastId);
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
    const today = new Date().toISOString();
    this.http.post(url + postDownloadCSV ,{dataLocation}, {responseType: 'blob'} )
    .subscribe((res) => {
      if (res) {
          console.log(res);
          saveAs(res, "dataset"+today.slice(0,10)+".csv");
          this._snackBar.open('Data CSV downloading started...', 'Dismiss', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          });
      }
    });
  }

  // POST, PUT
  runScraper(runMode: string, noOfdays: number, scraper: Scraper, selectedLocations: any[], selectedCategories: any[]) {
    let executionEndPoint = ''
    let newScraper = scraper
    if (runMode == 'scraper') {
      executionEndPoint = postRunScraper
      newScraper.script += ' ' + selectedCategories + ' ' + selectedLocations
      console.log("scraper script ==>>>", scraper.script) // test
    } else if (runMode == 'updater'){
      executionEndPoint = postRunUpdater
      newScraper.updaterScript += ' ' + selectedCategories + ' ' + selectedLocations + ' ' + noOfdays
      console.log("scraper updater script ==>>>", scraper.updaterScript) // test
    }
    this._snackBar.open('Scraper execution started...', 'Dismiss', {
      duration: 2500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      });
    this.http.post<{
          message: string,
          result: string,
          scraperRunId: string, // creates a new scraperRun and returns the ID
          dataLocation: string,
          dataFormat: string,
          status: boolean }>(url + executionEndPoint , newScraper)
    .subscribe((recievedData) => {
    console.log(recievedData.message);
    this.results = recievedData.result;
    if (recievedData.status) {
      this.createScraperRunEntry({
        scraperId: scraper.scraperId,
        scraperRunId: recievedData.scraperRunId,
        dataLocation: recievedData.dataLocation,
        dataFormat: recievedData.dataFormat,
        executionType: runMode,
        executedCategories: selectedCategories,
        executedLocations: selectedLocations,
        status: recievedData.status});
      this.dialog.open(SuccessComponent, {data: {message: recievedData.message}});
    } else {
      this.updateUserScraperStatus(scraper.scraperId, 'ideal');
      this.dialog.open(ErrorComponent, {data: {message: recievedData.message}});
    }

    }, (error) => {
    console.log(error);
    });
  }


  // create a new scraperRun entry
  createScraperRunEntry(runItem: CreateRunItem){
    this.http.post<{
          message: string
        }>(url + postCreateScraperRunEntry , runItem)
    .subscribe((recievedData) => {
      if (recievedData) {
        console.log(recievedData.message);
        this.scraperStatus = 'ideal';
        this.scraperStatusUpdated.next(this.scraperStatus);
      }
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
        this.scraperStatus = status;
        this.scraperStatusUpdated.next(this.scraperStatus);
      }
    }, (error) => {
    console.log(error);
    });
  }

  updateScraper(scraper: Scraper) {
    this.http.post<{
      message: string
    }>(url + putUpdateScraper, scraper)
    .subscribe((recievedData) => {
        if (recievedData) {
          console.log(recievedData.message);
          this.scraperUpdated.next(scraper);
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/admin/scrapers/details/' + scraper.scraperId]);
          this._snackBar.open('Scraper updated successfully...', 'Dismiss', {
            duration: 2500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            });
        }
      }, (error) => {
      console.log(error);
      });
  }

  addScraper(scraper: Scraper) {
    this.http.post<{
      message: string
    }>(url + postAddScraper , scraper)
    .subscribe((recievedData) => {
      if (recievedData) {
        console.log(recievedData.message);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/admin/scrapers']);
        this._snackBar.open('Scraper added successfully...', 'Dismiss', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          });
      }
    }, (error) => {
    console.log(error);
    });
  }

  terminateScraper(scraperId: string) {
      this.http.get<{
        message: string
      }>(url + getTerminateScraper + scraperId)
      .subscribe((recievedData) => {
        if (recievedData) {
          console.log(recievedData.message);
          this.updateUserScraperStatus(scraperId, 'ideal');
          this._snackBar.open(recievedData.message, 'Dismiss', {
            duration: 2500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            });
        }
      }, (error) => {
      console.log(error);
      });
  }

  // check runnig status
  scheduleScraper(scraper: Scraper, timestamp: number, executedLocations: string[], executedCategories: string[]){
    let newScraper = scraper;
    newScraper.script += ' ' + executedCategories + ' ' + executedLocations
    this.http.post<{
      message: string,
    }>(url + postScheduleScraper , {newScraper, timestamp, executedCategories, executedLocations})
    .subscribe((recievedData) => {
      if (recievedData) {
        console.log(recievedData.message);
          this._snackBar.open(recievedData.message, 'Dismiss', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          });
      }
    }, (error) => {
    console.log(error);
    });
  }


  // DELETE

  removeScraper(scraperId){
    this.http.delete<{ message: string }>(url + deleteScraper + scraperId)
    .subscribe((recievedData) => {
      if (this.scrapers.length) {
        const updatedscrapers = this.scrapers.filter(scr => scr.scraperId !== scraperId);
        this.scrapers = updatedscrapers;
        this.scrapersUpdated.next(this.scrapers);
      }
      console.log(recievedData.message);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/admin/scrapers']);
      this._snackBar.open('Scraper :' + scraperId + ' removed!', 'Dismiss', {
        duration: 2500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        });
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

  getLastScraperIdUpdatedListener() {
    return this.lastScraperIdUpdated.asObservable();
  }

}
