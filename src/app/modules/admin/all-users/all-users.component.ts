
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Scraper, User } from '../../scraper/scraper.model';
import { ScraperService } from '../../scraper/scraper.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['user_id', 'user_type', 'name', 'email', 'contact_no', 'action'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // subscritions
  private userSub: Subscription;
  private scraperSub: Subscription;

  // final merchants list
  users: User[];

  user: User;

  scrapers: Scraper[];

  selectedScraper: { scraperId: '', scraperName: ''}

  constructor(private scraperService: ScraperService, private authService: AuthService) { }

  ngOnInit() {
     // get all users
   this.authService.getUsers();
   this.userSub = this.authService.getUsersUpdateListener().subscribe(
     res => {
       if (res) {
         this.users = res;
         this.dataSource = new MatTableDataSource(this.users);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
         this.scraperService.getAllScrapers();
         this.scraperSub = this.scraperService.getScrapersUpdateListener().subscribe(
           scrs => {
             this.scrapers = scrs;
           })
      }
     });
  }

  ngOnDestroy() {

    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // get selected scraper run details
  showUserDetails(userId: string) {
    for (const app of this.users) {
      if (app.userId === userId) {
        this.user = app;
      }
    }
   }


   // remove a user
   removeUser(userId: string) {
     this.authService.removeUser(userId);
   }


   // add scraper to user
   addScraper(scraperId, scraperName){
     let updatable = true;
    if (this.user) {
      for (let scp of this.user.scrapers){
        if (scp.scraperId == scraperId) {
          updatable = false;
        }
      }
      if (updatable) {
        this.user.scrapers.push({
          scraperId: scraperId,
          scraperName: scraperName,
          status: 'ideal',
          scraperRuns: []
        })
      }
    }
   }

    // add scraper to user
    removeScraper(scraperID){
      console.log(scraperID);
      if (this.user) {
        const newScrapers = this.user.scrapers.filter(scraper => scraper.scraperId !== scraperID);
        console.log(newScrapers);
        this.user.scrapers = newScrapers;
     }
    }

    updateUser(user: User) {
      this.authService.updateSlectedUser(user);
    }




}
