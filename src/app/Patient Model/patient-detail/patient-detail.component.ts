import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PatientDetailsService } from 'src/app/services/patient-details.service';
import { SettingsService } from 'src/app/services/settings.service';
import { PatientPopupComponent } from 'src/app/shared/patient-popup/patient-popup.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {

  patientDetails: any;
  patientID: any;
  isLoading: boolean = true;
  appointments: any[] = [];
  duration: any;
  appoitmentID: Array<any> = [];
  isSelected: boolean = true;
  ids: any
  doctors: any;
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
    // this.getAllAppointmentsForDoctor()
    this.getAllDoctors()
  }
  toggleSelection(clickedCard: any) {
    this.doctors.forEach((card: any) => {
      card.isSelected = card === clickedCard;
    });
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
  getAllDoctors() {
    this.patientService.getAllDoctors().subscribe({
      next: (data) => {
        console.log(data);
        this.doctors = data.data
      }, error: (err) => {
        console.log(err);

      }, complete: () => {
        this.getAllAppointmentsForDoctor(this.doctors[0]._id, this.patientID);
      },
    })
  }

  getAllAppointmentsForDoctor(dId: any, pId: any) {
    this.patientService.getAllAppointmentsForDoctor(dId, pId).subscribe({
      next: (data => {
        console.log(data);
        this.appointments = data.getAppointment
        this.appointments.forEach(e => {

          const [hours, minutes] = e.time.split(":");
          var updatedTimeString

          let hourValue = Number(hours) + 1;

          if (hourValue >= 24) {
            hourValue -= 24;
          }
          updatedTimeString = `${hourValue.toString().padStart(2, '0')}:${minutes}`;

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
