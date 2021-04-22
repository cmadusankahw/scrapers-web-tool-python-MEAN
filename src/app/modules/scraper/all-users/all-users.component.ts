
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { Admin } from '../scraper.model';
import { ScraperService } from '../scraper.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['user_id', 'user_type', 'name', 'email', 'contact_no'];
  dataSource: MatTableDataSource<Admin>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // subscritions
  private adminSub: Subscription;

  // final merchants list
  admins: Admin[] = [
    {
      userId: 'U01',
      userName: 'Test',
      userType: 'super-admin',
      profilePic: './assets/images/merchant/user.jpg',
      userEmail: 'abc@gmail.com',
      userContactNo: '0776789078',
      gender: 'male'
    }
  ];

  constructor( private adminService: ScraperService) { }

  ngOnInit() {
     // get admin for child comp use
  //  this.adminService.getAdmins();
  //  this.adminSub = this.adminService.getAdminsUpdateListener().subscribe(
  //    res => {
  //      if (res) {
  //        this.admins = res;
         this.dataSource = new MatTableDataSource(this.admins);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
    //   }
    //  });
  }

  ngOnDestroy() {

    if (this.adminSub) {
      this.adminSub.unsubscribe();
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




}
