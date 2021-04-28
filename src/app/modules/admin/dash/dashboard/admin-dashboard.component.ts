import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  // navigation
  home = 'txt-white row';
  users = 'txt-white row';
  settings = 'txt-white row';
  scrapers = 'txt-white row';

  topIcon = "./assets/images/scraper/logo_lg.png";


   isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
   .pipe(
     map(result => result.matches),
     shareReplay()
   );

 constructor(private breakpointObserver: BreakpointObserver,
             private router: Router) { }

 ngOnInit() {
   this.routerEvents();
 }


 routerEvents() {
   this.router.events.subscribe((e) => {
     if (e instanceof NavigationStart) {
       if (e.url === '/admin') {
         this.navHome();
       } else if (e.url === '/admin/users') {
         this.navUsers();
       } else if (e.url === '/admin/scrapers') {
        this.navScrapers();
      }else if (e.url === '/admin/settings') {
       this.navSettings();
   }
   }
 });
 }

 navHome() {
   this.home = 'txt-white row active-nav';
   this.users = this.scrapers = this.settings  = 'txt-white row';
 }

 navUsers() {
   this.users = 'txt-white row active-nav';
   this.home = this.scrapers =this.settings  = 'txt-white row';
 }


 navSettings() {
   this.settings = 'txt-white row active-nav';
   this.users = this.scrapers =this.home  = 'txt-white row';
 }

 navScrapers() {
  this.scrapers = 'txt-white row active-nav';
  this.users = this.settings =this.home  = 'txt-white row';
}

}
