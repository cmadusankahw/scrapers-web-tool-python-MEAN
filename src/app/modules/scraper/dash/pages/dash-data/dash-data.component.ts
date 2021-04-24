import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { User, UserScraper } from '../../../scraper.model';

@Component({
  selector: 'app-dash-data',
  templateUrl: './dash-data.component.html',
  styleUrls: ['./dash-data.component.scss']
})
export class DashDataComponent implements OnInit, OnDestroy {

  private userSub: Subscription;

  user: User;

  userScrapers: UserScraper[] = [];


  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthUser();
     this.userSub = this.authService.getCurrentUserUpdatteListener()
       .subscribe((res: User) => {
         if (res) {
           this.user = res;
           this.userScrapers = res.scrapers;
         }
    }, (error) => {
      console.log(error);
      });
  }

  ngOnDestroy(){
    if (this.userSub) {
      this.userSub.unsubscribe();
  }
  }

}
