import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { PatientDetailsService } from 'src/app/services/patient-details.service';
// import { PatientsService } from 'src/app/services/patients.service';


@Component({
  selector: 'app-add-patient-pop-up',
  templateUrl: './add-patient-pop-up.component.html',
  styleUrls: ['./add-patient-pop-up.component.css']
})
export class AddPatientPopUpComponent implements OnInit {
  public currentDate = new Date()
  ShowConfirmOrNot: boolean = false
  constructor(
    private fb: FormBuilder,
    private patientsService: PatientDetailsService


  ) { }

  public ErrorMsg: any = {
    PatientName: '',
    PhoneNumber: '',
    Height: '',
    Gender: '',
    BirthDate: ''
  }

  CreatePatientForm: FormGroup = this.fb.group({
    PatientName: ['', [Validators.required]],
    PhoneNumber: ['', [Validators.required, Validators.minLength(11), Validators.pattern('[0-9]+')]], // min of 8 chars do i need to display error if less than that??
    Height: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[0-9]+')]], // min of 8 chars do i need to display error if less than that??
    Gender: ['Male', [Validators.required]],// min of 8 chars do i need to display error if less than that??
    BirthDate: ['', [Validators.required]],// min of 8 chars do i need to display error if less than that??
  });


  ngOnInit(): void {
    // this.ToggleDropDown()
  }





  public Genders = ['Male', 'Female']



  public onDate(event: any): void {
    this.RemoveLocalError('Birthdate')

    let Birthdate = event.value

    let date = new Date(Birthdate)
    let year = date.getFullYear()
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let day = String(date.getDate()).padStart(2, '0')
    let finalBirthdate = [day, month, year].join('/')
    this.CreatePatientForm.value.BirthDate = finalBirthdate
    console.log('the event', finalBirthdate)
    // this.getData(this.roomsFilter.date);
  }
  public RemoveLocalError = (prop: any) => {
    let AddErrorMsg: any = document.querySelector(`#${prop}Span`)
    AddErrorMsg.classList.remove('errorAdded')
  }


  public TogglePopUp() {
    const popUpLayerAddPatient = document.querySelector('.popUpLayerAddPatient')
    popUpLayerAddPatient?.classList.toggle('visible')

    const popUpAddPateint = document.querySelector('.popUpAddPateint')
    popUpAddPateint?.classList.toggle('popUpCloseAddPatient')
  }

  public TogglePopUpClose() {
    const popUpLayerAddPatient = document.querySelector('.popUpLayerAddPatient')
    popUpLayerAddPatient?.classList.toggle('visible')

    const popUpAddPateint = document.querySelector('.popUpAddPateint')
    popUpAddPateint?.classList.toggle('popUpCloseAddPatient')
  }



  public GoNextPage() {
    console.log('in nextttt')
    const confirmPageAddPatient = document.querySelector('#confirmPageAddPatient')
    confirmPageAddPatient?.classList.toggle('displayNoneAddPatient')
    const searchPageAddPatint = document.querySelector('#searchPageAddPatint')
    searchPageAddPatint?.classList.toggle('displayNoneAddPatient')
  }

  public ToggleDropDown = () => {
    const dropDownAddPatient: any = document.querySelector('#dropDownAddPatient')
    dropDownAddPatient.classList.toggle('vertical-menu-closed')
  }

  public FirstTimeToggle = () => {
    const dropDownAddPatient: any = document.querySelector('#dropDownAddPatient')
    dropDownAddPatient.classList.toggle('vertical-menu-closed')
  }

  public addNewPatient() {
    console.log(this.CreatePatientForm.value.BirthDate);

    this.patientsService.addNewPatient(this.CreatePatientForm.value).subscribe({
      next: (data: any) => {
        console.log(data)
        window.location.reload();
      }, error: (err => {
        console.log(err);

      })
    })


  }

}
