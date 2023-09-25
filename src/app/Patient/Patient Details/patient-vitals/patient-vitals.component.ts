import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsService } from 'src/app/services/appointments.service';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit {

  appointmentID: any
  patientId: any
  vitals: any;
  isLoading: boolean = true
  constructor(private vitalService: AppointmentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appointmentID = this.route.snapshot.params?.['appointmentId']
    this.patientId = this.route.snapshot.params?.['patientId']
    this.getVitals(this.appointmentID, this.patientId)
  }

  getVitals(appointmentId: any, patientId: any) {
    this.vitalService.getVitals(appointmentId, patientId).subscribe({
      next: (data => {
        console.log(data);
        this.vitals = data.getVitals
        this.isLoading = false
      }), error: err => console.log(err),

    })
  }
}
