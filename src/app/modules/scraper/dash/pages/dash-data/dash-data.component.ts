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

  userScrapers: UserScraper[] = [
    {
      scraperId: 'S1',
      scraperName: 'Rainbow Pages',
      scraperRuns: [
        {
          scraperRunId: 'U1S12345678',
          userId: 'U1',
          scraperId: 'S1',
          timestamp: 1382086394000,
          noOfRuns: 1,
          noOfCols: 15,
          noOfRows: 2870,
          executed_params:{
            categories: ['computers', 'industry', 'telcom'],
            locations: ['any'],
          },
          dataLocation: 'sdcrapers/data/rainbowpages.csv',
          dataFormat: 'csv',
          status: 'success'
        },
      ]
    }
  ];


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
