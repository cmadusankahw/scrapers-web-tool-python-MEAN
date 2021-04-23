import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashStat } from '../../scraper.model';
import { ScraperService } from '../../scraper.service';

@Component({
  selector: 'app-dash-stat',
  templateUrl: './dash-stat.component.html',
  styleUrls: ['./dash-stat.component.scss']
})
export class AdminDashStatComponent implements OnInit, OnDestroy {


  // subscribers
  private dashStatSub: Subscription;


  orderCounts: DashStat;

  constructor(private scraperService: ScraperService) { }

  ngOnInit() {
    // this.adminService.getreportData();
    // this.reportStatSub = this.adminService.getReportDataUpdateListener()
    //   .subscribe((recievedData: boolean) => {
    //     if (recievedData) {
    //       this.adminService.getDashStat();
    //       this.dashStatSub = this.adminService.getDashStatUpdateListener()
    //         .subscribe((recievedStat: DashStat) => {
    //           this.orderCounts = recievedStat;
    //           console.log(this.orderCounts);
    //         });
    //     }
    //   });
  }

  ngOnDestroy() {
    if (this.dashStatSub) {
      this.dashStatSub.unsubscribe();
    }
  }


}
