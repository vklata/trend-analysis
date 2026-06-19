import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BranchDirectoryComponent } from "./pages/branch-directory/branch-directory.component";
import { BudgetTrackingComponent } from "./pages/budget-tracking/budget-tracking.component";
import { AttendanceComponent } from "./pages/attendance/attendance.component";
import { ExamResultsComponent } from "./pages/exam-results/exam-results.component";
import { FeeCollectionComponent } from "./pages/fee-collection/fee-collection.component";
import { OverviewComponent } from "./pages/overview/overview.component";
import { LoginComponent } from "./login/login.component";
import {AllLayoutComponent} from './all-layout/all-layout.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },

  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "",
    component: AllLayoutComponent,
       canActivate: [AuthGuard],
    children: [
      {
        path: "overview",
        component: OverviewComponent,
      },

      {
        path: "fee-collection",
        component: FeeCollectionComponent,
      },

      {
        path: "attendance",
        component: AttendanceComponent,
      },

      {
        path: "exam-results",
        component: ExamResultsComponent,
      },
      { path: "budget-tracking", component: BudgetTrackingComponent },
      { path: "branch-directory", component: BranchDirectoryComponent },
      { path: "", redirectTo: "overview", pathMatch: "full" },
    ],
  },
];
// const routes: Routes = [
//    { path:'', component:LoginComponent },
//  { path:'overview', component:OverviewComponent },
//  { path:'fee-collection', component:FeeCollectionComponent },
//  { path:'exam-results', component:ExamResultsComponent },
//  { path:'attendance', component:AttendanceComponent },
//  { path:'budget-tracking', component:BudgetTrackingComponent },
//  { path:'branch-directory', component:BranchDirectoryComponent },
//  { path:'', redirectTo:'overview', pathMatch:'full' }
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
