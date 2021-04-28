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
import { ScraperDetailsComponent } from './modules/scraper/scraper-details/scraper-details.component';
import { AddUserComponent } from './modules/auth/add-user/add-user.component';
import { AdminHomeComponent } from './modules/admin/dash/pages/admin-home/admin-home.component';
import { AdminScrapersComponent } from './modules/admin/dash/pages/admin-scrapers/admin-scrapers.component';
import { AdminSettingsComponent } from './modules/admin/dash/pages/admin-settings/admin-settings.component';
import { AdminUsersComponent } from './modules/admin/dash/pages/admin-users/admin-users.component';
import { AdminDashboardComponent } from './modules/admin/dash/dashboard/admin-dashboard.component';
import { AdminScraperDetailsComponent } from './modules/admin/admin-scraper-details/admin-scraper-details.component';
import { AdminAddScraperComponent } from './modules/admin/admin-add-scraper/admin-add-scraper.component';

const routes: Routes = [
  {
    path: 'scraper',
    component: DashboardComponent,
    children: [
      { path: '', component: DashHomeComponent },
      { path: 'run/:id', component: ScraperDetailsComponent },
      { path: 'data', component: DashDataComponent },
      { path: 'settings', component: DashSettingsComponent },
      { path: '**', component: NotFoundPageComponent },
    ], canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'scrapers', component: AdminScrapersComponent },
      { path: 'scrapers/details/:id', component: AdminScraperDetailsComponent },
      { path: 'scrapers/add', component: AdminAddScraperComponent },
      { path: 'scrapers/edit/:id', component: AdminAddScraperComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: '**', component: NotFoundPageComponent },
    ], canActivate: [AuthGuard]
  },
  { path: '', component: HomepageComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: AddUserComponent },
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
