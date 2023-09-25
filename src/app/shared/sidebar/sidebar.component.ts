import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDaysOffComponent } from '../../settings/add-days-off/add-days-off.component';
import { AdjustWorkingHoursComponent } from '../../settings/adjust-working-hours/adjust-working-hours.component';
import { ChangeConsultationDurationComponent } from '../../settings/change-consultation-duration/change-consultation-duration.component';
import { AuthService } from '../../services/auth.service';
import { AddAppointmentComponent } from 'src/app/Patient Model/add-appointment/add-appointment.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  token: any
  role: any
  spliting: any;
  atb: any;
  patientId: any;
  constructor(private dialogref: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.checkIsLogged();
  }
  isclicked: boolean = false

  toggle() {
    this.isclicked = (this.isclicked ? false : true)
  }
  openAdujstWorkingHours() {
    this.dialogref.open(AdjustWorkingHoursComponent)
  }
  openConsultaionDuration() {
    this.dialogref.open(ChangeConsultationDurationComponent)
  }
  openDaysOff() {
    this.dialogref.open(AddDaysOffComponent)
  }
  checkIsLogged() {
    this.token = localStorage.getItem("currentDoctor")
    console.log(this.token);
    if (this.token) {
      this.spliting = this.token.split(".")[1];
      this.atb = JSON.parse(atob(this.spliting));
      this.role = this.atb.role
      this.patientId = this.atb._id
      console.log(this.atb);
    }


  }
  logout() {
    this.authService.logOut().subscribe({
      next: (mss => {
        console.log(mss)
        this.token = localStorage.removeItem("currentDoctor")
        console.log(this.token);
      }
      ),
      error: (err => console.log(err))
    })
  }
  openAddAppointment() {
    this.dialogref.open(AddAppointmentComponent,
      {
        width: '900px',
        height: '450px'
      })
  }
}
