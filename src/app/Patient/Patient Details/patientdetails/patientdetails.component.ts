import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { PatientPopupComponent } from 'src/app/shared/patient-popup/patient-popup.component';
import { PatientDetailsService } from '../../../services/patient-details.service';

@Component({
  selector: 'app-patientdetails',
  templateUrl: './patientdetails.component.html',
  styleUrls: ['./patientdetails.component.css']
})
export class PatientdetailsComponent implements OnInit {

  patientDetails: any;
  patientID: any;
  isLoading: boolean = true;
  appointments: any[] = [];
  duration: any;
  appoitmentID: Array<any> = [];
  ids: any
  constructor(
    private patientService: PatientDetailsService,
    private settingService: SettingsService,
    private route: ActivatedRoute,
    private dialogRef: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.patientID = this.route.snapshot.params?.['id']
    this.showPatient(this.patientID);
    this.getDuration()
  }
  showPatient(id: any) {
    this.patientService.getPaitientDetails(id).subscribe({
      next: (data => {
        console.log(data)
        this.patientDetails = data.getpatient
        console.log(this.patientDetails);
        this.isLoading = false;
      }),
      error: (err => console.log(err))
    })
  }


  public convertToStringDate(DateInput: any) {
    var day = new Date(DateInput).getDate();
    var month = new Date(DateInput).getMonth() + 1;
    var year = new Date(DateInput).getFullYear();
    let currentStringDate: string = `${day}/${month}/${year}`
    return currentStringDate
  }

  public convertToStringTime(DateInput: any) {
    let currentSlotDateTemp = new Date(DateInput);
    let currentSlotDateTempHours = currentSlotDateTemp.getHours()
    let currentSlotDateTempMin = currentSlotDateTemp.getMinutes()
    let currentSlotTime = `${this.addZero(currentSlotDateTempHours)}:${this.addZero(currentSlotDateTempMin)}`
    return currentSlotTime
  }



  public getAge(dateString: any) {

    var today = new Date();

    var birthDate = new Date(dateString);

    var age = today.getFullYear() - birthDate.getFullYear();
    return age;
  }


  public addZero(number: any) {
    let currentNumber = number
    if (number.toString().length == 1) {
      currentNumber = `0${number}`
    }
    return currentNumber
  }
  getDuration() {
    this.settingService.getconsultaionDuration().subscribe({
      next: (data) => {
        console.log(data);
        this.duration = data.getDuration
      }, error: (err => {
        console.log(err);

      }), complete: () => {
        this.getAllAppointments()
      }
    })
  }
  getAllAppointments() {
    this.patientService.getAllAppointments(this.patientID).subscribe({
      next: (data => {
        console.log(data);
        this.appointments = data.getAppointment
        this.appointments.forEach(e => {

          const [hours, minutes] = e.time.split(":");
          const date = new Date();
          var updatedTimeString
          if (this.duration.time > 30) {
            let hourValue = Number(hours) + 1;

            if (hourValue >= 24) {
              hourValue -= 24;
            }

            updatedTimeString = `${hourValue.toString().padStart(2, '0')}:${minutes}`;
          } else {
            date.setHours(Number(hours), Number(minutes) + this.duration.time);

            updatedTimeString = `${date.getHours()}:${date.getMinutes()}`;
          }
          e.endTime = updatedTimeString;
        })
        console.log(this.appointments);
        this.isLoading = false
      }), error: (err) => console.log(err)

    })
  }

  openDetails() {
    this.dialogRef.open(PatientPopupComponent, {
      data: {
        data: this.patientID
      },
      width: '700px',
      height: '700px'
    })
  }
}
