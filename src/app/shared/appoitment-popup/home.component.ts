import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DoctorsService } from 'src/app/services/doctors.service';
import { IPatient } from 'src/models/IPatient';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { PatientDetailsService } from 'src/app/services/patient-details.service';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  @Input() Date: any = '' // date + time
  @Input() Day: any = '' // day name 
  @Input() Duration: any = '' // to toggle if this is true 
  @Output() onClick: EventEmitter<IPatient> = new EventEmitter<IPatient>()
  public Confirm(Patient: IPatient) {
    this.onClick.emit(Patient); // the value passed from the child
  }



  CurrentSelected: any
  isLoading = true;
  consultationDuration: any
  public disabledButton: boolean = true // by default the button is disabled until it select an input from dropdown
  public notFound = false // default is false until we search and find 0 matches (length==0) 

  public AllPatients: [] = [] // will contain all the patients here
  public AllSearchResults: any // will contain all patients searched on (temped array)

  constructor(
    // private doctorsService: DoctorsService,
    private patientsService: PatientDetailsService,
    private appointmentsService: AppointmentsService,
    private doctorsServices: SettingsService,
  ) { }

  ngOnInit(): void {
    this.getAllPatients()
    this.ToggleDropDown()
    this.getConsultationDuration();
  }
  public getAllPatients() {
    this.patientsService.getAllPaitents().subscribe({
      next: (data: any) => {
        console.log('the data', data)
        this.AllPatients = data.patients
        this.AllSearchResults = data.patients
      }
    })
  }


  // public getAppointments() {
  //   this.appointmentsService.getAllAppointments().subscribe({
  //     next: (data: any) => {
  //       console.log('all apointments', data)
  //     }
  //   })
  // }

  public getConsultationDuration() {
    this.doctorsServices.getconsultaionDuration().subscribe({
      next: (data: any) => {
        console.log('the constulationDuration', data)
        this.consultationDuration = data.getDuration
        this.isLoading = false;
      }
    })
  }

  // public getWorkHours() {
  //   this.doctorsServices.getWorkingHours().subscribe({
  //     next: (data: any) => {
  //       console.log('the working hours', data)
  //     }
  //   })
  // }

  public getDaysOff() {
    this.doctorsServices.getDaysOff().subscribe({
      next: (data: any) => {
        console.log('all days off', data)
      }
    })
  }

  public Logout() {
    localStorage.removeItem('currentDoctor')
  }





  public setSelected = (selected: any) => { // WILL TAKE THE ENTIRE SELECTED PATIENT OBJECT 
    console.log(selected);

    this.CurrentSelected = { ...selected }
    this.putValueInInput(this.CurrentSelected.PatientName)
    console.log('the currentslecte', this.CurrentSelected)
    this.EnableButton() // will be enable only if he selected a value from the dropdown // writing the name is not enough

  }

  public DisableButton = () => {
    this.disabledButton = true
  }

  public EnableButton = () => {
    this.disabledButton = false
  }

  public putValueInInput(name: string): void {
    const input: any = document.querySelector('.input')
    input.value = name
    this.ToggleDropDown()
  }

  public ToggleDropDown = () => {
    const dropDown: any = document.querySelector('#dropDown')
    dropDown.classList.toggle('vertical-menu-closed')
  }
  public OpenDropDown = () => {
    const dropDown: any = document.querySelector('#dropDown')
    // console.log(dropDown.classList)
    dropDown.classList.remove('vertical-menu-closed')
  }


  public async searchResult() {
    console.log('aaaaaaaaaaaaaaaaaaaaa');

    this.resetSelectedPatient()
    this.OpenDropDown()
    const input: any = document.querySelector('.input')
    console.log(input.value);

    await this.patientsService.searchPatient(input.value).subscribe({
      next: (data: any) => {
        console.log('the search result', data)
        this.AllSearchResults = [...data]
      }, error: (err) => {
        this.notFound = true
        console.log(err);
        this.AllSearchResults = null
      },

      complete: () => {
        if (this.AllSearchResults.length == 0) {
          this.notFound = true
          console.log('in true')
        }
        else {
          this.notFound = false
          console.log('in false')
        }
      }


    })
  }



  public resetSelectedPatient(): void {
    this.CurrentSelected = { // reset it
      patientId: 0,
      patientName: '',
      phoneNumber: 0,
      birthDate: '',
      height: 0,
      gender: '',
      appointments: [], // make model for it
      lastVisitDate: ''
    }
    this.DisableButton();
  }

  public TogglePopUp(event: any) {
    console.log(event);
    let currentID = event.id
    if (currentID == 'exitSearch') {
      const popUpLayer = document.querySelector('.popUpLayer')
      popUpLayer?.classList.toggle('visible')

      const popUp = document.querySelector('.popUp')
      popUp?.classList.toggle('popUpClose')

    }

    else if (currentID == 'exitConfirm' || currentID == 'confirm' || currentID == 'cancel') {
      const popUpLayer = document.querySelector('.popUpLayer')
      popUpLayer?.classList.toggle('visible')

      const popUp = document.querySelector('.popUp')
      popUp?.classList.toggle('popUpClose')

      setTimeout(() => {
        this.GoNextPage()
      }, 500);


    }

    else if (currentID == 'calenderButton') {
      const popUpLayer = document.querySelector('.popUpLayer')
      popUpLayer?.classList.toggle('visible')

      const popUp = document.querySelector('.popUp')
      popUp?.classList.toggle('popUpClose')



    }



  }

  public GoNextPage() {
    const confirmPage = document.querySelector('#confirmPage')
    confirmPage?.classList.toggle('displayNone')
    const searchPage = document.querySelector('#searchPage')
    searchPage?.classList.toggle('displayNone')
  }

  public openAddPatient() {
    this.SwitchToAddPatient()
    this.ToggleAddPatient()
  }



  public SwitchToAddPatient() {
    const popUpLayer = document.querySelector('.popUpLayer')
    popUpLayer?.classList.toggle('visible')

    const popUp = document.querySelector('.popUp')
    popUp?.classList.toggle('popUpClose')

  }


  public ToggleAddPatient() {
    const popUpLayerAddPatient = document.querySelector('.popUpLayerAddPatient')
    popUpLayerAddPatient?.classList.toggle('visible')

    const popUpAddPateint = document.querySelector('.popUpAddPateint')
    popUpAddPateint?.classList.toggle('popUpCloseAddPatient')

  }

  public getFrom(currentDate: any) {
    let tempDate = new Date(currentDate)

    return `${this.addZero(tempDate.getHours())}:${this.addZero(tempDate.getMinutes())}`
  }


  public getTo(currentDate: any) {
    let tempDate = new Date(currentDate)
    if (!this.isLoading) {
      tempDate.setMinutes(tempDate.getMinutes() + this.consultationDuration.time)

    }

    return `${this.addZero(tempDate.getHours())}:${this.addZero(tempDate.getMinutes())}`
  }

  public addZero(number: any) {
    let currentNumber = number
    if (number.toString().length == 1) {
      currentNumber = `0${number}`
    }
    return currentNumber // as string
  }








}
