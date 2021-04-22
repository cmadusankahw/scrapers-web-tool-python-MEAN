
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { Driver } from '../scraper.model';
import { ScraperService } from '../scraper.service';

@Component({
  selector: 'app-scrapers-list',
  templateUrl: './scrapers-list.component.html',
  styleUrls: ['./scrapers-list.component.scss']
})
export class ScrapersListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['profilePic', 'driverName', 'action'];
  dataSource: MatTableDataSource<Driver>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // subscritions

  private driverSub: Subscription;

  drivers: Driver[] = [
    {
      driverId: 'D01',
      driverName: 'Chiran HW',
      driverContactNo: '0778956789',
      driverEmail: 'abc@gmail.com',
      profilePic: './assets/images/merchant/user.jpg',
      pickup: 'Matara',
      dropoff: 'Colombo',
      driverRegDate: '2021-01-23',
      vehicleNo: 'CAF2345',
      vehicleType: 'Car',
      noOfSeats: 4,
      availableSeats: 3,
      ACType: 'AC',
      vehiclePhotos: {
        image1: './assets/images/merchant/nopic.png',
        image2: './assets/images/merchant/nopic.png',
        image3: './assets/images/merchant/nopic.png',
        image4: './assets/images/merchant/nopic.png',
        image5: './assets/images/merchant/nopic.png',
        image6: './assets/images/merchant/nopic.png'
      },
      NICPhotos: {
        front: './assets/images/merchant/nopic.png',
        back: './assets/images/merchant/nopic.png',
      },
      driverLicensePhotos: {
        front: './assets/images/merchant/nopic.png',
        back: './assets/images/merchant/nopic.png',
      },
      revenueLicensePhotos: {
        front: './assets/images/merchant/nopic.png',
        back: './assets/images/merchant/nopic.png',
      },
      insurrencePhotos: {
        front: './assets/images/merchant/nopic.png',
        back: './assets/images/merchant/nopic.png',
      },
      bankBookPhoto: './assets/images/merchant/nopic.png',
      status: ' pending'
    },
  ];

  driver: Driver;

  constructor( private adminService: ScraperService) { }

  ngOnInit() {
    // get admin for child comp use
  //  this.adminService.getNewDrivers(1);
  //  this.driverSub = this.adminService.getDriversUpdateListener().subscribe(
  //    res => {
  //      if (res) {
  //        this.drivers = res;
         this.dataSource = new MatTableDataSource(this.drivers);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
  //     }
  //    });
  }


  ngOnDestroy() {

    if (this.driverSub) {
      this.driverSub.unsubscribe();
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // get selected driver details
  showUsertDetails(driverId: string) {
    for (const app of this.drivers) {
      if (app.driverId === driverId) {
        this.driver = app;
      }
    }
  }


}
