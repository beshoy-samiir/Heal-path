import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { PatientlistComponent } from './Patient/patientlist/patientlist.component';
import { PatientdetailsComponent } from './Patient/Patient Details/patientdetails/patientdetails.component';
import { PatientEmrComponent } from './Patient/Patient Details/patient-emr/patient-emr.component';
import { PatientVitalsComponent } from './Patient/Patient Details/patient-vitals/patient-vitals.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PatientLoginComponent } from './Patient Model/patient-login/patient-login.component';
import { PatientDetailComponent } from './Patient Model/patient-detail/patient-detail.component';
import { PatientGuard } from './patient.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: "patient/login",
    pathMatch: 'full'
  },
  {
    path: "patient/login",
    component: PatientLoginComponent,
  }, {
    path: "login",
    component: LoginComponent
  },

  {
    path: 'home',
    component: CalendarComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'patientlist',
    component: PatientlistComponent,
    canActivate: [AuthGuard]
  }
  , {
    path: 'patientdetails/:id',
    component: PatientdetailsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'patientdetail/:id',
    component: PatientDetailComponent,
    // canActivate: [AuthGuard]
  },

  {
    path: 'emr/:AppointmentId/:patientId',
    component: PatientEmrComponent,
    canActivate: [PatientGuard]
  },
  {
    path: 'vitals/:appointmentId/:patientId',
    component: PatientVitalsComponent,
    canActivate: [PatientGuard]
  },


  {  // any other path
    path: '**',
    component: PageNotFoundComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
