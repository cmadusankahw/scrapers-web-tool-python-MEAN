import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { NotFoundPageComponent } from './modules/home/not-found-page/not-found-page.component';
import { AuthGuard } from './modules/auth/auth.guard';
import { DashHomeComponent } from './modules/scraper/dash/pages/dash-home/dash-home.component';
import { DashboardComponent } from './modules/scraper/dash/dashboard/dashboard.component';
import { DashSettingsComponent } from './modules/scraper/dash/pages/dash-settings/dash-settings.component';
import { DashDataComponent } from './modules/scraper/dash/pages/dash-data/dash-data.component';
import { PasswordResetComponent } from './modules/auth/password-reset/password-reset.component';
import { CreateNewPasswordComponent } from './modules/auth/create-new-password/create-new-password.component';
import { HomepageComponent } from './modules/home/homepage/homepage.component';
import { ContactUsComponent } from './modules/home/contact-us/contact-us.component';

const routes: Routes = [
  {
    path: 'scraper',
    component: DashboardComponent,
    children: [
      { path: '', component: DashHomeComponent },
      { path: 'data', component: DashDataComponent },
      { path: 'settings', component: DashSettingsComponent },
      { path: '**', component: NotFoundPageComponent },
    ], canActivate: [AuthGuard]
  },
  { path: '', component: HomepageComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'resetpw', component: PasswordResetComponent },
  { path: 'createpw', component: CreateNewPasswordComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
