import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { InputsModule,
        InputUtilitiesModule,
        WavesModule,
        ButtonsModule,
        ModalModule,
        TableModule,
        ChartsModule,
        CarouselModule } from 'angular-bootstrap-md';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatDialogModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgbModule, NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import { DatePipe } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/auth/header/header.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { FooterComponent } from './modules/home/footer/footer.component';
import { AddUserComponent } from './modules/auth/add-user/add-user.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { UserProfileComponent } from './modules/scraper/user-profile/user-profile.component';
import { ContactUsComponent } from './modules/home/contact-us/contact-us.component';
import { NotFoundPageComponent } from './modules/home/not-found-page/not-found-page.component';
import { AuthInterceptor } from './modules/auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { SuccessComponent } from './success/success.component';
import { DashboardComponent } from './modules/scraper/dash/dashboard/dashboard.component';
import { DashHomeComponent } from './modules/scraper/dash/pages/dash-home/dash-home.component';
import { DashDataComponent } from './modules/scraper/dash/pages/dash-data/dash-data.component';
import { AllUsersComponent } from './modules/admin/all-users/all-users.component';
import { ScrapersListComponent } from './modules/scraper/scrapers-list/scrapers-list.component';
import { DashSettingsComponent } from './modules/scraper/dash/pages/dash-settings/dash-settings.component';
import { CreateNewPasswordComponent } from './modules/auth/create-new-password/create-new-password.component';
import { PasswordResetComponent } from './modules/auth/password-reset/password-reset.component';
import { HomepageComponent } from './modules/home/homepage/homepage.component';
import { ScraperDetailsComponent } from './modules/scraper/scraper-details/scraper-details.component';
import { ScraperDataComponent } from './modules/scraper/scraper-data/scraper-data.component';
import { AdminDashStatComponent } from './modules/admin/dash/dash-stat/dash-stat.component';
import { AdminDashboardComponent } from './modules/admin/dash/dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './modules/admin/dash/pages/admin-home/admin-home.component';
import { AdminScrapersComponent } from './modules/admin/dash/pages/admin-scrapers/admin-scrapers.component';
import { AdminSettingsComponent } from './modules/admin/dash/pages/admin-settings/admin-settings.component';
import { AdminUsersComponent } from './modules/admin/dash/pages/admin-users/admin-users.component';
import { AdminAddScraperComponent } from './modules/admin/admin-add-scraper/admin-add-scraper.component';
import { AdminScraperDetailsComponent } from './modules/admin/admin-scraper-details/admin-scraper-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    AddUserComponent,
    UserProfileComponent,
    ContactUsComponent,
    NotFoundPageComponent,
    ErrorComponent,
    SuccessComponent,
    CreateNewPasswordComponent,
    PasswordResetComponent,
    HomepageComponent,
    DashboardComponent,
    DashHomeComponent,
    DashDataComponent,
    AllUsersComponent,
    ScrapersListComponent,
    DashSettingsComponent,
    ScraperDetailsComponent,
    ScraperDataComponent,
    AdminDashStatComponent,
    AdminDashboardComponent,
    AdminHomeComponent,
    AdminScrapersComponent,
    AdminSettingsComponent,
    AdminUsersComponent,
    AdminAddScraperComponent,
    AdminScraperDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    InputsModule,
    InputUtilitiesModule,
    WavesModule,
    ButtonsModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ModalModule,
    MatSidenavModule,
    LayoutModule,
    MatToolbarModule,
    MatListModule,
    TableModule,
    MatTableModule,
    MatPaginatorModule,
    ChartsModule,
    MatProgressBarModule,
    NgbModule,
    MatCheckboxModule,
    CarouselModule,
    MatSliderModule,
    MatDialogModule,
    NgbDropdownModule,
    DragDropModule,
    NgbProgressbarModule,
    MatTabsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, SuccessComponent]
})
export class AppModule { }
