import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { User } from '../scraper/scraper.model';
import { getUser, getHeader, getLastId, postSignIn, url, getUsers, deleteUser } from '../scraper/scraper.config';
import { LogIn } from './auth.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private lastIdUpdated = new Subject<string>();
  private userUpdated = new Subject<User>();
  private usersUpdated = new Subject<User[]>();
  private authStatusListener = new Subject<boolean>();
  private headerDetailsListener = new Subject<{userType: string, userName: string, profilePic: string}>();

  // to get admin once logged in
  private user: User;

  // all users
  private users: User[];

  // last signed user id
  private lastId: string;

  // storing token for auth validation
  private token: string;

  // timer to auto logout
  private tokenTimer: any;

  private headerDetails: {userType: string, userName: string, profilePic: string};

  // user login status
  private isAuthenticated = false;

  // snack bars for notification display
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(private http: HttpClient,
              private router: Router,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) {}


  // GET

    getUser(userId) {
      this.http.get<{user: User}>(url + getUser + userId)
        .subscribe((res) => {
          this.user = res.user;
          this.userUpdated.next(this.user);
      });
    }

    getUsers() {
      this.http.get<{users: User[]}>(url + getUsers)
        .subscribe((res) => {
          this.usersUpdated.next(res.users);
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
    if (this.user) {
      return this.user.userType;
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

  // get authentication statusgetAuthAdmin
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

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUserUpdatteListener() {
    return this.userUpdated.asObservable();
  }

// POST , PUT

  signUp(user: User) {
    //   this.http.post<{message: string}>(this.url + 'auth/admin' , admin)
   //   .subscribe((recievedData) => {
   //     console.log(recievedData.message);
   //     this.admin = admin;
   //     this.adminUpdated.next(this.admin);
   //     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   //     this.router.onSameUrlNavigation = 'reload';
   //     this.router.navigate(['/admin/profile']);
   //     this.dialog.open(SuccessComponent, {data: {message: 'Your Profile Details Updated Successfully!'}});
   //   }, (error) => {
   //     console.log(error);
   //     });
 }


 updateUser(user: User, image: File) {
  // if (image) {
  //   const newImage = new FormData();
  //   newImage.append('images[]', image, image.name);

  //   this.http.post<{profile_pic: string}>(this.url + 'auth/admin/img', newImage )
  //   .subscribe ((recievedImage) => {
  //   console.log(recievedImage);
  //   admin.profile_pic = recievedImage.profile_pic;
  //   this.http.post<{message: string}>(this.url + 'auth/admin' , admin)
  //   .subscribe((recievedData) => {
  //     console.log(recievedData.message);
  //     this.admin = admin;
  //     this.adminUpdated.next(this.admin);
  //     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //     this.router.onSameUrlNavigation = 'reload';
  //     this.router.navigate(['/admin/profile']);
  //     this.dialog.open(SuccessComponent, {data: {message: 'Your Profile Details Updated Successfully!'}});
  //   }, (error) => {
  //     console.log(error);
  //     });
  //   });
  // } else {
  //   this.http.post<{message: string}>(this.url + 'auth/admin' , admin)
  //   .subscribe((recievedData) => {
  //     console.log(recievedData.message);
  //     this.admin = admin;
  //     this.adminUpdated.next(this.admin);
  //     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //     this.router.onSameUrlNavigation = 'reload';
  //     this.router.navigate(['/admin/profile']);
  //     this.dialog.open(SuccessComponent, {data: {message: 'Your Profile Details Updated Successfully!'}});
  //   }, (error) => {
  //     console.log(error);
  //     });
  //  }
}


// DELETE

removeUser(userId){
    this.http.delete<{ message: string }>(url + deleteUser + userId)
      .subscribe((recievedData) => {
        if (this.users.length) {
          const updatedUsers = this.users.filter(usr => usr.userId !== userId);
          this.users = updatedUsers;
          this.usersUpdated.next(this.users);
          this._snackBar.open('User :' + userId + ' removed!', 'Dismiss', {
            duration: 2500,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            });
        }
        }, (error) => {
          console.log(error);
          });
}


  // user profile change password
  changeUserPassword(userType: string, currentPword: string, newPword: string) {
  }


  // log in user
  signIn(login: LogIn) {
    this.http.post<{ message: string,
                     token: any,
                     expiersIn: number,
                     user_type: string }>(url + postSignIn , login)
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
