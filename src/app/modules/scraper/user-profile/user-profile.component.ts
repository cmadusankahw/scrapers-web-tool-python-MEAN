import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router} from '@angular/router';


import { ErrorComponent } from 'src/app/error/error.component';
import { DatePipe } from '@angular/common';
import { User } from '../scraper.model';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private userSubs: Subscription;

  // edit profile mode
  editmode = false;

  // bprofile data binding
  user: User = {
    userId: 'U01',
    userName: 'Test',
    userType: 'super-admin',
    profilePic: './assets/images/merchant/user.jpg',
    userEmail: 'abc@gmail.com',
    userContactNo: '0776789078',
    status: 'Registered',
    scrapers: null
  }


   // image to upload
   image: File;
   imageUrl: any = './assets/images/merchant/nopic.png';


  constructor(private authService: AuthService,
              public dialog: MatDialog,
              public datepipe: DatePipe,
              private router: Router) { }

  ngOnInit() {
    // this.adminService.getAdmin();
    // this.adminSubs = this.authService.getAdminUpdatteListener().subscribe (
    //   admin => {
    //       this.admin = admin;
    //   });
  }

  ngOnDestroy() {
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }
    this.imageUrl = './assets/images/merchant/nopic.png';
    this.image = null;
  }

  changeUserPassword(pwordForm: NgForm) {
    if (pwordForm.invalid) {
      console.log('Form invalid');
    }
    if ( pwordForm.value.new_password1 !== pwordForm.value.new_password2) {
      this.dialog.open(ErrorComponent, {data: {message: 'Passwords do not match! Please try again!'}});
    }
   // this.serviceProviderService.changeUserPassword(currentPword, newPword);
  }

  // edit user
  editUser(editForm: NgForm) {
    if (editForm.invalid) {
      console.log('Form Invalid');
    } else {
      const user: User = {
        userId: this.user.userId,
        userType: editForm.value.user_type,
        userName: editForm.value.user_name,
        profilePic: this.user.profilePic,
        userEmail: editForm.value.email,
        userContactNo: editForm.value.contact_no,
        status: this.user.status,
        scrapers: null
        };
      this.authService.updateUser(user, this.image);
      this.userSubs = this.authService.getUserUpdatteListener()
      .subscribe((res) => {
        this.user = res;
      });
      console.log('Admin details updated successfully!');
      editForm.resetForm();
      this.editmode = false;
    }
  }

    // profile pic uploading
    onImageUploaded(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = file;
        this.imageUrl = reader.result;
      };
    }

}
