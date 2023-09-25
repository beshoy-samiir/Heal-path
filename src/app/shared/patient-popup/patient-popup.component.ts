import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientDetailsService } from 'src/app/services/patient-details.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-popup',
  templateUrl: './patient-popup.component.html',
  styleUrls: ['./patient-popup.component.css']
})
export class PatientPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private patientService: PatientDetailsService,
    private fb: FormBuilder,

  ) { }
  patientId: any;
  patientDetails: any;
  isLoading: any;
  public currentDate = new Date();
  public Genders = ['Male', 'Female']


  PatientDetailsForm: FormGroup = this.fb.group({
    PatientNameEdit: ['aaa', [Validators.required]],
    PhoneNumberEdit: ['', [Validators.required, Validators.minLength(11), Validators.pattern('[0-9]+')]], // min of 8 chars do i need to display error if less than that??
    HeightEdit: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[0-9]+')]], // min of 8 chars do i need to display error if less than that??
    GenderEdit: ['', [Validators.required]],// min of 8 chars do i need to display error if less than that??
    BirthdateEdit: ['04/24/2023', [Validators.required]],// min of 8 chars do i need to display error if less than that??
  });

  ngOnInit(): void {
    this.patientId = this.data;
    console.log(this.patientId);
    this.showPatient(this.patientId.data)
    console.log(this.PatientDetailsForm.value);

  }
  showPatient(id: any) {
    this.patientService.getPaitientDetails(id).subscribe({
      next: (data => {
        console.log(data)
        this.patientDetails = data.getpatient
        this.isLoading = false;

      }),
      error: (err => console.log(err)),
      complete: () => {
        const birthdate = new Date(this.patientDetails.BirthDate);
        this.PatientDetailsForm.controls['PatientNameEdit'].setValue(this.patientDetails.PatientName);
        this.PatientDetailsForm.controls['GenderEdit'].setValue(this.patientDetails.Gender);
        this.PatientDetailsForm.controls['HeightEdit'].setValue(this.patientDetails.Height);
        this.PatientDetailsForm.controls['PhoneNumberEdit'].setValue(this.patientDetails.PhoneNumber);
        this.PatientDetailsForm.controls['BirthdateEdit'].setValue(birthdate);

      }
    })
  }
  public CurrentPatientDetailsForm = { // will fill this 
    PatientNameEdit: "",
    PhoneNumberEdit: "",
    BirthdateEdit: "",
    HeightEdit: 0,
    GenderEdit: ""
  }
  public onDate(event: any): void {
    // this.PatientDetailsForm.controls['BirthdateEdit'].setValue(event.value)  
    console.log('the event', event.value)

  }

  public HandleEditPatientDetails = (buttonId: any) => {
    // console.log('the id',buttonId)
    if (buttonId == 'submitEditPatient') {
      console.log(this.PatientDetailsForm)


      if (this.PatientDetailsForm.status == 'VALID') { // must now check in my database for the user


        let PatientName = this.PatientDetailsForm.controls['PatientNameEdit'].value
        let PhoneNumber = this.PatientDetailsForm.controls['PhoneNumberEdit'].value
        let Height = this.PatientDetailsForm.controls['HeightEdit'].value
        let Gender = this.PatientDetailsForm.controls['GenderEdit'].value
        let Birthdate = this.PatientDetailsForm.controls['BirthdateEdit'].value

        let date = new Date(Birthdate)
        console.log('date', date)
        let year = date.getFullYear()
        let month = String(date.getMonth() + 1).padStart(2, '0')
        let day = String(date.getDate()).padStart(2, '0')
        let finalBirthdate = [day, month, year].join('/')
        console.log(finalBirthdate);


        console.log(PatientName, PhoneNumber, Height, Gender, finalBirthdate)

        this.CurrentPatientDetailsForm.PatientNameEdit = PatientName
        this.CurrentPatientDetailsForm.HeightEdit = parseInt(Height)
        this.CurrentPatientDetailsForm.GenderEdit = Gender
        this.CurrentPatientDetailsForm.PhoneNumberEdit = PhoneNumber
        this.CurrentPatientDetailsForm.BirthdateEdit = finalBirthdate
        console.log('current created object ', this.CurrentPatientDetailsForm)
        // this.addNewPatient(this.CurrentPatientDetailsForm)

        let { PatientNameEdit, PhoneNumberEdit, BirthdateEdit, HeightEdit, GenderEdit } = this.CurrentPatientDetailsForm
        let CurrentPatientNew = {
          PatientName: PatientNameEdit,
          PhoneNumber: PhoneNumberEdit,
          Birthdate: BirthdateEdit,
          Height: HeightEdit,
          Gender: GenderEdit
        }
        // console.log(this.currentSelectedSlot.PatientId)

        this.EditPatientDetails(CurrentPatientNew, this.patientId.data)
      }

    }
  }

  public ToggleDropDownPatientDetails = () => {

    const dropDownEditPatient: any = document.querySelector('#dropDownEditPatient')
    dropDownEditPatient.classList.toggle('vertical-menu-closed')
  }
  public setSelectedPatientDetails = (gender: string) => { // WILL TAKE THE ENTIRE SELECTED PATIENT OBJECT 
    this.PatientDetailsForm.controls['GenderEdit'].setValue(gender)
    this.ToggleDropDownPatientDetails()
  }


  EditPatientDetails(CurrentPatientDetails: any, PatientId: any) {
    console.log('the input data', CurrentPatientDetails)
    this.patientService.editPatient(CurrentPatientDetails, PatientId).subscribe({
      next: (data: any) => {
        console.log(data);
        window.location.reload()
      }, error: (err => console.log(err))
    })
  }
}
