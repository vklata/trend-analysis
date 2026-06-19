import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule,ThemeService } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { FeeCollectionComponent } from './pages/fee-collection/fee-collection.component';
import { ExamResultsComponent } from './pages/exam-results/exam-results.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { BudgetTrackingComponent } from './pages/budget-tracking/budget-tracking.component';
import { BranchDirectoryComponent } from './pages/branch-directory/branch-directory.component';
import { LoginComponent } from './login/login.component';
import { AllLayoutComponent } from './all-layout/all-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    OverviewComponent,
    FeeCollectionComponent,
    ExamResultsComponent,
    AttendanceComponent,
    BudgetTrackingComponent,
    BranchDirectoryComponent,
    LoginComponent,
    AllLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    HttpClientModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
