import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { User } from '../auth.model';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  loginForm: FormGroup;

  // recieving user list to check
  recievedUsers: User;

  constructor(private http: HttpClient,
              public authService: AuthService,
              public dialog: MatDialog) { }

  ngOnInit() {
    // login form validation
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

  }

  // get form elements
  get email() { return this.loginForm.get('email'); }


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
