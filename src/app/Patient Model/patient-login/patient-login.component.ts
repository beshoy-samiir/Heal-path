import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})
export class PatientLoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    PatientName: ['andrew saed', [Validators.required]],
    PhoneNumber: ['01272468377', Validators.required]
  });
  token: any
  isLoading: boolean = true;
  errmessage: any;
  patient: any
  patientID: any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: AuthService
  ) { }

  ngOnInit(): void {
  }
  loginSubmit() {
    console.log(this.loginForm.value);
    this.loginService.loginPatient(this.loginForm.value).subscribe({
      next: (data => {

        console.log(data);
        this.patient = data.data
        this.patientID = this.patient.patient
        if (data.apiStatues) {
          console.log('hi');
          console.log(data.data.token);

          this.token = localStorage.setItem("currentDoctor", data.data.token)
          this.router.navigate([`/patientdetail/${this.patientID._id}`])
          setTimeout(() => {
            window.location.reload()
          }, 100)
        }
      }),
      error: (err => {
        this.errmessage = err.error
        console.log(this.errmessage);

        console.log(err)
        this.router.navigate(['/patient/login'])
      })
    })


  }

}     
