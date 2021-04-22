import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Admin } from '../scraper/scraper.model';
import { getAuthAdmin, getHeader, getLastId, getSignIn, url } from '../scraper/scraper.config';
import { LogIn } from './auth.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private lastIdUpdated = new Subject<string>();
  private adminUpdated = new Subject<Admin>();

  // to get admin once logged in
  private admin: Admin;

  // last signed user id
  private lastId: string;

  // storing token for auth validation
  private token: string;

  // timer to auto logout
  private tokenTimer: any;

  // login details listener
  private authStatusListener = new Subject<boolean>();

  // details for app header
  private headerDetailsListener = new Subject<{userType: string, userName: string, profilePic: string}>();

  private headerDetails: {userType: string, userName: string, profilePic: string};

  // user login status
  private isAuthenticated = false;


  constructor(private http: HttpClient,
              private router: Router,
              public dialog: MatDialog) {}


  // get methods

    getAdmin() {
      this.http.get<{admin: Admin}>(url + getAuthAdmin)
        .subscribe((recievedMerchant) => {
          this.admin = recievedMerchant.admin;
          this.adminUpdated.next(this.admin);
      });
    }

  // get details for header
  getHeaderDetails() {
    if (this.token) {
      this.http.get<{user_type: string, user_name: string, profile_pic: string}>(url + getHeader)
      .subscribe((recievedHeader) => {
        this.headerDetails = {
          userType: recievedHeader.user_type,
          userName: recievedHeader.user_name,
          profilePic: recievedHeader.profile_pic};
        this.headerDetailsListener.next(this.headerDetails);
    });
    }
  }

  // get user type in signup-select
  getUserType() {
    if (this.admin) {
      return this.admin.userType;
    }
  }

   // get last product id
  getLastUserId() {
        this.http.get<{ lastid: string }>(url + getLastId)
        .subscribe((recievedId) => {
          console.log(recievedId.lastid);
          this.lastId = recievedId.lastid;
          this.lastIdUpdated.next(this.lastId);
        });
  }

  // get token to be used by other services
  getToken() {
    return this.token;
  }

  // get authentication status
  getisAuth() {
    return this.isAuthenticated;
  }


  // listners for subjects
  getLastIdUpdateListener() {
    return this.lastIdUpdated.asObservable();
  }

  getAuhStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getHeaderDetailsListener() {
    return this.headerDetailsListener.asObservable();
  }


  getAdminUpdatteListener() {
    return this.adminUpdated.asObservable();
  }


  // user profile change password
  changeUserPassword(userType: string, currentPword: string, newPword: string) {
  }


  // log in user
  signIn(login: LogIn) {
    this.http.post<{ message: string,
                     token: any,
                     expiersIn: number,
                     user_type: string }>(url + getSignIn , login)
    .subscribe((recievedData) => {
      console.log(recievedData.message);

      this.setAuthTimer(recievedData.expiersIn);

      this.token = recievedData.token;
      console.log(this.token);
      this.getHeaderDetails();

      if (recievedData.token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date (now.getTime() + recievedData.expiersIn * 1000 );
        this.saveAuthData(recievedData.token, expirationDate );

        this.router.navigate(['/admin']);
      }
   }, (error) => {
     console.log(error);
   });
 }

   // auto auth user after restart
   autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiersIn = authInformation.expiarationDate.getTime() - now.getTime();
    if (expiersIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiersIn / 1000); // node timers works in secords (not ms)
      this.authStatusListener.next(true);
    }
  }


 // log out user
 signOut() {
   this.token = null;
   this.isAuthenticated = false;
   this.authStatusListener.next(false);
   this.clearAuthData();
   clearTimeout(this.tokenTimer);
 }


 // starts the session timer
 private setAuthTimer(duration: number) {
   console.log ('Setting timer to : ' + duration);
   this.tokenTimer = setTimeout(() => {
    this.signOut();
    alert('Session Time Out! You have been logged out! Please log in back..');
    this.router.navigate(['/']);
   }, duration * 1000);
 }

 // store token and user data in local storage
 private saveAuthData(token: string, expiarationDate: Date) {
   localStorage.setItem('token', token);
   localStorage.setItem('expiration', expiarationDate.toISOString());
 }

 // clear locally sotred auth data in timeout or sign out
 private clearAuthData() {
   localStorage.removeItem('token');
   localStorage.removeItem('expiration');
 }

 // access locally stored auth data
 private getAuthData() {
   const token = localStorage.getItem('token');
   const expiration = localStorage.getItem('expiration');
   if (!token || !expiration) {
     return;
   }
   return {
     token,
     expiarationDate : new Date(expiration),
   };
 }

}
