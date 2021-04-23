import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { User } from '../../scraper/scraper.model';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              public datepipe: DatePipe,
              public authService: AuthService) { }

  ngOnInit() {
    // get merchant temp
    //this.merchantTemp = this.authService.getMerchantTemp();

    // router scroll
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
  });
  }

  ngOnDestroy() {
  }

   signupUser(signupForm: NgForm) {
    if (signupForm.invalid) {
      console.log('Form Invalid');
    } else {
      const user: User = {
        userId: '',
        userType: signupForm.value.user_type,
        userName: signupForm.value.user_name,
        profilePic: './assets/images/merchant/nopic.png',
        userEmail: signupForm.value.email,
        userContactNo: signupForm.value.contact_no,
        status: 'Registered'
        };
      this.authService.signUp(user);
      console.log('User created successfully!');
      signupForm.resetForm();
    }
  }


}
