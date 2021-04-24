import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // navigation
  home = 'txt-white row';
  data = 'txt-white row';
  settings = 'txt-white row';
  accSettings = 'txt-white row';

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
       if (e.url === '/scraper') {
         this.navHome();
       } else if (e.url === '/scraper/data') {
         this.navData();
       }else if (e.url === '/scraper/settings') {
       this.navSettings();
   }
   }
 });
 }

 navHome() {
   this.home = 'txt-white row active-nav';
   this.data = this.accSettings = this.settings  = 'txt-white row';
 }

 navData() {
   this.data = 'txt-white row active-nav';
   this.home = this.accSettings =this.settings  = 'txt-white row';
 }

 navSettings() {
   this.settings = 'txt-white row active-nav';
   this.data = this.accSettings =this.home  = 'txt-white row';
 }

 navAccSettings() {
  this.accSettings = 'txt-white row active-nav';
  this.data = this.settings =this.home  = 'txt-white row';
}

}
