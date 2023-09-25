import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsService } from 'src/app/services/appointments.service';

@Component({
  selector: 'app-patient-emr',
  templateUrl: './patient-emr.component.html',
  styleUrls: ['./patient-emr.component.css']
})
export class PatientEmrComponent implements OnInit {
  token: any
  role: any
  spliting: any;
  atb: any;
  patientId: any;
  emr: any
  errMess: any
  appoitmentID: any
  public EMRerrorMsg = 'Note: You Can Only Upload Files on The Day of The Consultation!'
  isLoading: boolean = true

  constructor(private emrService: AppointmentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appoitmentID = this.route.snapshot.params?.['AppointmentId']
    this.getEMR(this.appoitmentID)
    setTimeout(() => { // just wait 2.5 more secs
      this.ToggleLoadingIndicator() // loading
    }, 1000);
    this.checkIsLogged();

  }
  checkIsLogged() {
    this.token = localStorage.getItem("currentDoctor")
    console.log(this.token);
    this.spliting = this.token.split(".")[1];
    this.atb = JSON.parse(atob(this.spliting));
    this.role = this.atb.role
    this.patientId = this.atb._id
    console.log(this.atb);

    console.log(this.role);

  }
  public getEMR(AppointmentId: any) { // send the id of the current appointment
    this.emrService.getEMR(AppointmentId).subscribe({
      next: (data: any) => {
        console.log(data)
        this.emr = data.getEmr
        // this.isLoading = false
      },
    })
  }
  public handlePrint(filePath: any) {
    console.log('in print', filePath);
    let OpenUrl = `http://shaheersherif-001-site1.gtempurl.com/${filePath}`
    window.open(OpenUrl, "_blank");
  }
  public deleteEMR(DocumentId: any) { // send the id of the current appointment
    console.log(DocumentId);

    this.ToggleLoadingIndicator() // loading
    this.emrService.deleteEMR(DocumentId).subscribe({
      next: (data: any) => {
        if (data.apiStatues) {
          this.getEMR(this.appoitmentID) // to update the view
          this.EMRerrorMsg = 'File Successfully Deleted!'
          // this.isLoading = false
        } else {
          this.EMRerrorMsg = data.message
        }
        console.log('in delete doc', data)
        // this.isLoading = false
      },
      complete: () => {
        setTimeout(() => { // just wait 2.5 more secs
          this.ToggleLoadingIndicator() // loading
        }, 1000);
      }
    })
  }
  public fileToUpload: File | null = null;
  public handleFileInput(files: any) {
    console.log('in handle file')
    this.fileToUpload = files.files.item(0);
    // console.log('the appoitment id',this.currentSelectedSlot)
    const formData: FormData = new FormData();
    formData.append('upload', this.fileToUpload!);
    console.log('the form data', formData)
    this.addEMR(this.appoitmentID, formData) // automacally will upload
    // this.isLoading = false
  }
  public addEMR(AppointmentId: any, File: any) { // send the id of the current appointment
    this.ToggleLoadingIndicator() // loading
    this.emrService.addEMR(AppointmentId, File).subscribe({
      next: (data: any) => {
        console.log('in edit', data)
        this.getEMR(AppointmentId)
        this.EMRerrorMsg = 'File Successfully Uploaded!'

      }, error: (err) => {
        this.isLoading = false
        console.log(err);
        this.errMess = err.error
      },
      complete: () => {
        setTimeout(() => { // just wait 2.5 more secs
          this.ToggleLoadingIndicator() // loading
        }, 1000);
      }
    })
  }

  // public Uploading =false
  public ToggleLoadingIndicator() {
    if (this.isLoading) {
      this.isLoading = false
    }
    else {
      this.isLoading = true
    }
  }

}
