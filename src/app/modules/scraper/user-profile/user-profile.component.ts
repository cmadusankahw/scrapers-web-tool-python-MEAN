import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router} from '@angular/router';


import { ErrorComponent } from 'src/app/error/error.component';
import { DatePipe } from '@angular/common';
import { ScraperService } from '../scraper.service';
import { Admin } from '../scraper.model';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private adminSubs: Subscription;

  // edit profile mode
  editmode = false;

  // bprofile data binding
  admin: Admin = {
    userId: 'U01',
    userName: 'Test',
    userType: 'super-admin',
    profilePic: './assets/images/merchant/user.jpg',
    userEmail: 'abc@gmail.com',
    userContactNo: '0776789078',
    gender: 'male'
  }


   // image to upload
   image: File;
   imageUrl: any = './assets/images/merchant/nopic.png';


  constructor(private adminService: ScraperService,
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
    if (this.adminSubs) {
      this.adminSubs.unsubscribe();
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
      const admin: Admin = {
        userId: this.admin.userId,
        userType: editForm.value.user_type,
        userName: editForm.value.user_name,
        profilePic: this.admin.profilePic,
        userEmail: editForm.value.email,
        userContactNo: editForm.value.contact_no,
        gender: editForm.value.gender,
        };
      this.adminService.updateAdmin(admin, this.image);
      this.adminSubs = this.adminService.getAdminUpdateListener()
      .subscribe((res) => {
        this.admin = res;
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
