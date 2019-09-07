import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { LoginComponent } from './login/login.component';
import { AdminpanelComponent } from './login/adminpanel/adminpanel.component';
import { EmployeesComponent } from './employees/employees.component';
import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent },
  { path: 'appointment', component: AppointmentComponent},
  { path: 'admin', component: LoginComponent},
  { path: 'admin-panel', component: AdminpanelComponent, canActivate: [AuthGuardService]},
  { path: 'employees', component: EmployeesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
