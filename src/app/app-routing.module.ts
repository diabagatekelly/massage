import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { LoginComponent } from './login/login.component';
import { AdminpanelComponent } from './login/adminpanel/adminpanel.component';
import { EmployeesComponent } from './employees/employees.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent },
  { path: 'appointment', component: AppointmentComponent},
  { path: 'admin', component: LoginComponent},
  { path: 'admin-panel', component: AdminpanelComponent},
  { path: 'employees', component: EmployeesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
