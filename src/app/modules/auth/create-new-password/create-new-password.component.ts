import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { User } from '../auth.model';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.scss']
})
export class CreateNewPasswordComponent implements OnInit {

  loginForm: FormGroup;

  // recieving user list to check
  recievedUsers: User;

  constructor(private http: HttpClient,
              public authService: AuthService,
              public dialog: MatDialog) { }

  ngOnInit() {
    // login form validation
    this.loginForm = new FormGroup({
      retype_password: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });

  }

  // get form elements
  get password() { return this.loginForm.get('password'); }
  get retype_password() { return this.loginForm.get('retype_password'); }


  // loginUser(loginform) {
  //   if (this.loginForm.invalid) {
  //     console.log('form invalid');
  //     this.dialog.open(ErrorComponent, {data: {message: 'Incorrect Username or Password'}});
  //   } else {
  //     this.showAlert = false;
  //     const login: LogIn = {
  //       email: loginform.value.email,
  //       password: loginform.value.password
  //     };
  //     this.authService.signIn(login);
  //   }
  // }
}
