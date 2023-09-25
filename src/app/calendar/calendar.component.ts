import { Component, OnInit } from '@angular/core';
// import $ from "jquery";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IPatient } from 'src/models/IPatient';
import { DoctorsService } from 'src/app/services/doctors.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
// import { PatientsService } from 'src/app/services/patients.service';
import { PatientDetailsService } from '../services/patient-details.service';
import { SettingsService } from '../services/settings.service';

// declare var $: any;  

// declare var $:JQueryStatic;


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public currentSelectedSlot = {
    StartTime: { hour: '', min: '' },
    day: '',
    date: '',
    consultationDuration: '',
    PatientID: 0,// not set yet 
    appointmentId: -1,
    PatientName: '',
    reservedOrNot: false,
  } // need to add resrved or not + date + id reseved to

  public currentDate = new Date(); // will contain the date of today
  public currentWeekDates: any[] = [] // will contain all this week dates
  public daysName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  public currentDayName = this.daysName[this.currentDate.getDay()]
  public currentDayDate = this.getWholeDateFormatTemp(this.currentDate)



  constructor(
    private settingsService: SettingsService,
    private appointmentsService: AppointmentsService,
    private patientsService: PatientDetailsService
  ) { }

  // public CurrentConsultationDuration:number= this.getConsultationDuration() // by default 60 until changing it

  public CurrentDaysOff: any = this.getDaysOff()   // will contain all days of

  // will contain current dragged cells

  // public numberOfDays =7 // so will create 7 columns
  // public consultationDuration= 60 // each session duration // in min 

  // public workingHours =8  //the working hours

  public startWork = this.toMin(6) // will start from ex. 6 in minutes for now

  public allWorkDuration = this.toMin(18) // 10 hours start from the startWork + allworkDuration 

  public allWorkHours: any = [] // will contain allworking hours for current week

  // public FillTable60=this.numSequence(60) // used to fill the table and the ids 
  // public FillTable40=this.numSequence(40) // used to fill the table and the ids 



  public FillTableNumbers: any[] = [] // for numbering first column  // will make it 60 as default



  public FillTableSun: any[] = []  // for Sunday 
  public FillTableMon: any[] = []  // for Monday
  public FillTableTue: any[] = []  // for Tuesday
  public FillTableWed: any[] = []  // for Wednesday
  public FillTableThu: any[] = []  // for Thursday
  public FillTableFri: any[] = []  // for Friday
  public FillTableSat: any[] = [] // for Saterday



  public CurrentConsultationDuration: number = 30 // by default 60 until changing it

  public consultationDurationObject = { // will contain all the consultation duration of current week
    sun: this.CurrentConsultationDuration,  // if the consultation duration is edited thus will edit in future only
    mon: this.CurrentConsultationDuration,
    tue: this.CurrentConsultationDuration,
    wed: this.CurrentConsultationDuration,
    thu: this.CurrentConsultationDuration,
    fri: this.CurrentConsultationDuration,
    sat: this.CurrentConsultationDuration,// so must change the height of the satuerday column 
    times: this.CurrentConsultationDuration // so must change the height of the satuerday column 
  }


  public getConsultationDuration() {
    this.settingsService.getconsultaionDuration().subscribe({
      next: (data: any) => {
        console.log('the constulationDuration', data)
        this.CurrentConsultationDuration = data.getDuration.time // will start applying any changes in the future only
        //  return data
      },
      complete: () => { // here will call the function that will change color them gray
        this.consultationDurationObject.sun = this.CurrentConsultationDuration  // if the consultation duration is edited thus will edit in future only
        this.consultationDurationObject.mon = this.CurrentConsultationDuration
        this.consultationDurationObject.tue = this.CurrentConsultationDuration
        this.consultationDurationObject.wed = this.CurrentConsultationDuration
        this.consultationDurationObject.thu = this.CurrentConsultationDuration
        this.consultationDurationObject.fri = this.CurrentConsultationDuration
        this.consultationDurationObject.sat = this.CurrentConsultationDuration

        this.consultationDurationObject.times = this.CurrentConsultationDuration

        console.log('the new', this.consultationDurationObject.sun)
        console.log('consultation duration in getCONS', this.CurrentConsultationDuration)  // if the);

        console.log('complete consultation duration')

        this.adjustHeight()

      }
    })
    // in case it fails
  }




  public async getWorkHours() {
    this.settingsService.getWorkingHours().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allWorkHours = data.newWorkingHours
        console.log(this.allWorkHours);

      },
      complete: () => { // here will call the function that will change color them gray
        this.FillTables()  // fill
        this.colorOutWorkHours() // then color the working hours
        //  console.log('thisssssss',this.FillTableSun)
      }

    })
    //  return ['aaa']
  }


  public colorOutWorkHours() {
    for (const currentItem of this.allWorkHours) {
      currentItem.workingHour.forEach((element: any) => {
        console.log(element);

        let startTime: number = this.ConvertAllToMin(parseInt(element.startTime.substring(0, 2)), parseInt(element.startTime.substring(3, 5)))  //first 2 digits
        let endTime: number = this.ConvertAllToMin(parseInt(element.endTime.substring(0, 2)), parseInt(element.endTime.substring(3, 5))) //first 2 digits
        let currentDay = this.FillTableSun
        switch (element.day) {
          case 'Sunday': currentDay = this.FillTableSun; break
          case 'Monday': currentDay = this.FillTableMon; break
          case 'Tuesday': currentDay = this.FillTableTue; break
          case 'Wednesday': currentDay = this.FillTableWed; break
          case 'Thursday': currentDay = this.FillTableThu; break
          case 'Friday': currentDay = this.FillTableFri; break
          case 'Saturday': currentDay = this.FillTableSat; break
        }


        for (const currentSlot of currentDay) {


          if (this.ConvertAllToMin(currentSlot.StartTime.hour, currentSlot.StartTime.min) >= startTime
            && this.ConvertAllToMin(currentSlot.StartTime.hour, currentSlot.StartTime.min) < endTime) {
            currentSlot.workHoursOrNot = true
          }

        }
      });
    }
  }



  public SendDetailsToEdit: any = {
    appointments: [], // array of all appointments
    patientId: 0,  // used to delete the patient appointment
    lastVisitDate: '', // i dont know the use of it till now
    patientName: '',
    phoneNumber: '',
    height: 0,
    gender: '',
    birthDate: ''
  }
  public SendCurrentWeekDetails: any = []
  public SendCurrentDate: any = {
    date: '',
    StartTime: { hour: '', min: '' }
  }

  public ReserveAppointment(currentSlot: any) {
    console.log('on click to display data')
    this.currentSelectedSlot = currentSlot
    if (!currentSlot.reservedOrNot) { // to avoid clicking on already reserved slots
      if (new Date(this.currentSelectedSlot.date) < new Date()) { // will pop up a msg indicate that you cant reserve in past
        // console.log('in the past')
        this.ErrorMsg = `Can't Reserve Appointment in The Past!`
        this.ErrorOrNot = false
        this.togglePopUpError('normal')
      }
      else { // will oepn the reserve normally and will allow you to reserve 
        this.togglePopUp('open')
      }

    }
    else { // i need to display the data of current slot
      console.log('current slotttttttttttttt', currentSlot)

      let currentDay = this.FillTableSun // as default only
      switch (currentSlot.day) {
        case 'sun': currentDay = this.FillTableSun; break
        case 'mon': currentDay = this.FillTableMon; break
        case 'tue': currentDay = this.FillTableTue; break
        case 'wed': currentDay = this.FillTableWed; break
        case 'thu': currentDay = this.FillTableThu; break
        case 'fri': currentDay = this.FillTableFri; break
        case 'sat': currentDay = this.FillTableSat; break
      }
      console.log('siwtch', currentDay)
      console.log(currentSlot);

      this.patientsService.getPatientByID(currentSlot.PatientID).subscribe({
        next: (data: any) => {
          console.log('--------');

          console.log('patient detilas', data)
          this.SendDetailsToEdit = data.getpatient
          this.SendCurrentWeekDetails = currentDay // all column day
          this.SendCurrentDate = currentSlot // date + startTime
        }, error: () => console.log('---'),

        complete: () => { // toggle and put the data
          console.log('send datails', this.SendDetailsToEdit)

          this.TogglePopUpEditPatient() // just open it
        }
      })


    }
  }

  public togglePopUp(state: string) {
    const popUpLayer = document.querySelector('.popUpLayer')
    popUpLayer?.classList.toggle('visible')
    const popUp = document.querySelector('.popUp')
    popUp?.classList.toggle('popUpClose')

    if (state == 'confirm') {
      setTimeout(() => {
        const confirmPage = document.querySelector('#confirmPage')
        confirmPage?.classList.toggle('displayNone')
        const searchPage = document.querySelector('#searchPage')
        searchPage?.classList.toggle('displayNone')
      }, 500);
    }


  }

  public getWholeDateFormat(dateInput: any, startTime: any) {
    let date = new Date(dateInput)
    let year = date.getFullYear()
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let day = String(date.getDate()).padStart(2, '0')
    let joinedDate = [day, month, year].join('/')

    let joinedTime = `${startTime.hour}:${startTime.min}`
    if (startTime.min.toString().length == 1 && startTime.hour.toString().length == 1) {  // in both
      joinedTime = `0${startTime.hour}:0${startTime.min}`
    }
    else if (startTime.min.toString().length == 1 && startTime.hour.toString().length == 2) { // append in min
      joinedTime = `${startTime.hour}:0${startTime.min}`
    }
    else if (startTime.min.toString().length == 2 && startTime.hour.toString().length == 1) { // append in min only
      joinedTime = `0${startTime.hour}:${startTime.min}`
    }

    let WholeDate = `${joinedDate} ${joinedTime}`
    console.log('the whole formattttttttttttttttttttttttttttt', WholeDate)
    return WholeDate
  }


  public getWholeDateFormatTemp(dateInput: any) {
    let date = new Date(dateInput)
    let year = date.getFullYear()
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let day = String(date.getDate()).padStart(2, '0')
    let joinedDate = [day, month, year].join('/')
    let WholeDate = `${joinedDate}`

    return WholeDate
  }

  public handleSubmit(InputPatient: any) {
    let WholeDate = this.getWholeDateFormat(this.currentSelectedSlot.date, this.currentSelectedSlot.StartTime)
    this.reserveAppointment(InputPatient._id, WholeDate, InputPatient)
  }

  public reserveAppointment(patientId: any, startTime: any, InputPatient: IPatient) {
    console.log(patientId, startTime, InputPatient, 'WHOLEEEEEEEE')
    this.appointmentsService.reserveAppointment(patientId, startTime).subscribe({
      next: async (data: any) => {
        // console.log('the dtaaaaaaaa',data)
        if (data.apiStatues) { // success thus u can reserve now
          console.log('successed in reservinggggggg')
          this.currentSelectedSlot.reservedOrNot = true // just enter the data or just select the user from the userlists
          this.currentSelectedSlot.PatientID = InputPatient.patientId // the number that will be entered
          this.currentSelectedSlot.PatientName = InputPatient.patientName
          this.getAppointments()
          this.togglePopUp('confirm')
          this.ToggleLoadingIndicator() // loading
          // window.location.reload()
        }
        else {
          console.log(data)
          alert('there is an error')
        }
      },
      complete: () => {
        setTimeout(() => { // wait until it reflected in 
          // console.log('all appoi NEW',this.AllAppointments)

          let currentDay = this.FillTableSun // as default only
          switch (this.currentSelectedSlot.day) {
            case 'sun': currentDay = this.FillTableSun; break
            case 'mon': currentDay = this.FillTableMon; break
            case 'tue': currentDay = this.FillTableTue; break
            case 'wed': currentDay = this.FillTableWed; break
            case 'thu': currentDay = this.FillTableThu; break
            case 'fri': currentDay = this.FillTableFri; break
            case 'sat': currentDay = this.FillTableSat; break
          }
          let currentSlotTemp = currentDay.find((currentSlot) => {
            console.log(currentSlot.StartTime)
            return currentSlot.StartTime.hour == this.currentSelectedSlot.StartTime.hour &&
              currentSlot.StartTime.min == this.currentSelectedSlot.StartTime.min
          })
          console.log(this.AllAppointments);

          if (this.AllAppointments) {
            let currentAppointment = this.AllAppointments.find((currentApp) => {

              let currentDateSlot = this.getWholeDateFormatTemp(currentApp.startTime)
              let currentSelectedDateSlot = this.getWholeDateFormatTemp(this.currentSelectedSlot.date)

              let currentSlotDateTemp = new Date(currentApp.startTime);
              let currentSlotDateTempHours = currentSlotDateTemp.getHours()
              let currentSlotDateTempMin = currentSlotDateTemp.getMinutes()
              let currentSlotTime = `${currentSlotDateTempHours}:${currentSlotDateTempMin}`

              let currentSelectedTimeSlot = `${this.currentSelectedSlot.StartTime.hour}:${this.currentSelectedSlot.StartTime.min}`

              if (currentDateSlot == currentSelectedDateSlot && currentSelectedTimeSlot == currentSlotTime)
                console.log('found it yaaaaaaaaay');
              return currentDateSlot == currentSelectedDateSlot && currentSelectedTimeSlot == currentSlotTime
            })
            if (currentAppointment) {
              currentSlotTemp.appointmentId = currentAppointment._id

            }
            this.ToggleLoadingIndicator() // here am done
          }
        }, 100); // just to insure allappointment will be fetched
      }
    }


    )
  }





  public deleteAppointment(AppointmentId: number, patientId: any, startTime: any) {
    this.appointmentsService.deleteAppointment(AppointmentId).subscribe({
      next: (data: any) => {
        console.log('data', data)
        if (data.actionCompleted) { // success thus u can reserve now
          console.log('successfully deleted')
          console.log('pateintId', patientId)
          this.reserveAppointmentForDelete(patientId, startTime)
        }
        else {
          alert('there is an error in delete')
        }
      },
      complete: () => { // here i will reserve the new appointment
        // this.reserveAppointmentForDelete(patientId,startTime)

      },
    })
  }


  public reserveAppointmentForDelete(patientId: any, startTime: any) {
    this.appointmentsService.reserveAppointment(patientId, startTime).subscribe({
      next: (data: any) => {
        if (data.actionCompleted) { // success thus u can reserve now
          //  alert('th')
          console.log('success switched')
          this.getAppointments() // to get the new values to be set in allappointments
        }
        else {
          alert('there is an error reserveAppointmentForDelete')
        }
      },
      complete: () => { // here i must first find the matching appointmnet to get the appId FROM IT
        setTimeout(() => { // wait until it reflected in 

          let currentSlotFromEvent = this.GlobalEvent.container.data[this.GlobalEvent.currentIndex]



          let currentAppointment = this.AllAppointments.find((currentApp) => {

            let currentDateSlot = this.getWholeDateFormatTemp(currentApp.startTime)
            let currentSelectedDateSlot = this.getWholeDateFormatTemp(currentSlotFromEvent.date)


            let currentSlotDateTemp = new Date(currentApp.startTime);
            console.log('ss' + ' ' + currentSlotDateTemp);

            let currentSlotDateTempHours = currentSlotDateTemp.getHours()
            let currentSlotDateTempMin = currentSlotDateTemp.getMinutes()
            let currentSlotTime = `${currentSlotDateTempHours}:${currentSlotDateTempMin}`

            let currentSelectedTimeSlot = `${currentSlotFromEvent.StartTime.hour}:${currentSlotFromEvent.StartTime.min}`

            if (currentDateSlot == currentSelectedDateSlot && currentSelectedTimeSlot == currentSlotTime)
              console.log('found it yaaaaaaaaay');
            return currentDateSlot == currentSelectedDateSlot && currentSelectedTimeSlot == currentSlotTime
          })
          // currentSlotTemp.appointmentId =currentAppointment.appointmentId
          currentSlotFromEvent.appointmentId = currentAppointment?.appointmentId

          this.ToggleLoadingIndicator()

        }, 100); // just to insure allappointment will be fetched

      }
    })
  }


  public toMin(time: number) {
    return time * 60
  }

  public multOf(time: number, day: string) {
    return this.startWork + time * this.consultationDurationObject[day as keyof typeof this.consultationDurationObject]
  }



  public convertToStringDate(DateInput: any) {
    var day = new Date(DateInput).getDate();
    var month = new Date(DateInput).getMonth() + 1;
    var year = new Date(DateInput).getFullYear();
    // console.log(year,'-',month,'-',day)

    let currentStringDate: string = `${year}-${month}-${day}`
    return currentStringDate
  }

  public addZero(number: any) {
    let currentNumber = number
    if (number.toString().length == 1) {
      currentNumber = `0${number}`
    }
    return currentNumber // as string
  }





  public numSequence(newConsultationDuration: number, Day: string, DateInput: any) { // this depedending on the consultation duration of the day 
    let tempArray = []
    for (let i = this.startWork; i < this.allWorkDuration + this.startWork; i += newConsultationDuration) {
      let remainingMin = i % 60
      let tempHours = Math.floor(i / 60)

      // console.log('tje fcking date',DateInput)
      // console.log('min', i);

      let DateInputTemp = new Date(DateInput)
      DateInputTemp.setMinutes(remainingMin)
      DateInputTemp.setHours(tempHours)
      DateInputTemp.setSeconds(0)
      // console.log(DateInputTemp);


      if (Day == 'times') {
        let NewHour = this.addZero(tempHours)
        let NewMin = this.addZero(remainingMin)
        let time = {
          StartTime: { hour: NewHour, min: NewMin }, // use this to get the time
          day: Day, // day name
          date: DateInputTemp, // will contain only the date right but the time wrong  
          consultationDuration: newConsultationDuration,
          PatientID: 0,// not set yet 
          PatientName: '',
          reservedOrNot: false,
          workHoursOrNot: false, // will indicate if this duration in range or not 
          daysOffOrNot: false,
          appointmentId: -1, // will set it to the appointment it
        } // need to add resrved or not + date + id reseved to
        tempArray.push(time)
      }
      else {
        let time = {
          StartTime: { hour: tempHours, min: remainingMin }, // use this to get the time
          day: Day, // day name
          date: DateInputTemp, // will contain only the date right but the time wrong  
          consultationDuration: newConsultationDuration,
          PatientID: 0,// not set yet 
          PatientName: '',
          reservedOrNot: false,
          workHoursOrNot: false, // will indicate if this duration in range or not 
          daysOffOrNot: false,
          appointmentId: -1, // will set it to the appointment it
        } // need to add resrved or not + date + id reseved to
        tempArray.push(time)
        // console.log('thee timeee', time);

      }

    }

    return tempArray

  }



  public ConvertAllToMin(hour: number, min: number) {
    return (hour * 60 + min)
  }
  public lastDegit() {
    return this.startWork + this.allWorkDuration + 1
  }

  public ShowCalender() { // will remove the class
    let loadingIndicator = document.querySelector('.calendar')
    this.isWait = false
    loadingIndicator?.classList.remove('HiddenUntilLoad')
  }

  public HideCalender() { // will add the class
    let loadingIndicator = document.querySelector('.calendar')
    this.isWait = true
    loadingIndicator?.classList.add('HiddenUntilLoad')
  }

  public ToggleLoadingIndicator() {
    if (this.isWait) {
      this.isWait = false
    }
    else {
      this.isWait = true
    }
  }


  public async adjustHeight() {
    console.log('consultation duration in adjust', this.CurrentConsultationDuration)  // if the);

    let height = 40 // the origianl height
    let padding = 22 // the original padding
    for (const day in this.consultationDurationObject) {
      let duration: any = this.consultationDurationObject[day as keyof typeof this.consultationDurationObject]
      let factor = 60 / duration
      let finalHeight = height / factor
      let finalPadding = padding / factor
      console.log('DURATONNNNNN', duration)  // if the);
      let tempClass: any = document.querySelectorAll(`.${day}`)

      for (const currentSlot of tempClass) { // slots in the same day
        currentSlot.style.height = finalHeight.toString() + 'px'
        currentSlot.style.paddingBottom = finalPadding.toString() + 'px'
        currentSlot.style.paddingTop = finalPadding.toString() + 'px'
      }


    }
    this.ShowCalender() // after it fully adjusted the height i can show the calender

  }


  public isWait: boolean = true

  async ngOnInit(): Promise<void> {


    this.getAllCurrentWeekDates(this.nextWeekIndex) //fisrt
    this.getConsultationDuration() // sec


    await this.getWorkHours() //third

    this.adjustHeight()
    await this.getAppointments() // sixth

  }
  public async getAllCurrentWeekDates(nextWeek: number) { // then fill the tables
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var today = new Date();
    const sameDayAfterWeek = new Date(today.setDate(today.getDate() + nextWeek))
    let currentIndexDay = sameDayAfterWeek.getDay() // will return number from 0 -> 7
    let tempArrayDates: any = []
    for (let i = 0; i < days.length; i++) {
      var today = new Date();
      const sameDayAfterWeek = new Date(today.setDate(today.getDate() + nextWeek)) //just reset it
      if (i < currentIndexDay) { // will take the diff
        const day = new Date(sameDayAfterWeek.setDate(sameDayAfterWeek.getDate() - (currentIndexDay - i)))
        tempArrayDates.push(day)
      }
      else if (i == currentIndexDay) {
        tempArrayDates.push(sameDayAfterWeek)
      }
      else { // will add
        const day = new Date(sameDayAfterWeek.setDate(sameDayAfterWeek.getDate() + (i - currentIndexDay)))
        tempArrayDates.push(day);
      }
    }
    this.currentWeekDates = [...tempArrayDates]
    // console.log(this.currentWeekDates)
  }

  public async FillTables() {
    console.log('in fill table')
    this.FillTableSun = this.numSequence(this.consultationDurationObject.sun, 'sun', this.currentWeekDates[0])  // for Sunday 
    this.FillTableMon = this.numSequence(this.consultationDurationObject.mon, 'mon', this.currentWeekDates[1])  // for Monday
    this.FillTableTue = this.numSequence(this.consultationDurationObject.tue, 'tue', this.currentWeekDates[2])  // for Tuesday
    this.FillTableWed = this.numSequence(this.consultationDurationObject.wed, 'wed', this.currentWeekDates[3])  // for Wednesday
    this.FillTableThu = this.numSequence(this.consultationDurationObject.thu, 'thu', this.currentWeekDates[4])  // for Thursday
    this.FillTableFri = this.numSequence(this.consultationDurationObject.fri, 'fri', this.currentWeekDates[5])  // for Friday
    this.FillTableSat = this.numSequence(this.consultationDurationObject.sat, 'sat', this.currentWeekDates[6])
    this.FillTableNumbers = this.numSequence(this.consultationDurationObject.sun, 'times', this.currentWeekDates[0])  // for numbering first column  // will make it 60 as default

  }


  public ErrorMsg: string = ``
  public ErrorOrNot: boolean = false
  public GlobalEvent: any = undefined // will contian the current event (from drag and drop)
  // public ConfirmMsg :string=''
  public drop(event: CdkDragDrop<any[]>) {
    this.GlobalEvent = event // so i can access it from anywhere
    console.log('pre', event.previousContainer.data)
    console.log('curre', event.container.data)
    if (event.previousContainer.data[0].consultationDuration == event.container.data[0].consultationDuration
      && (event.previousContainer != event.container || event.currentIndex != event.previousIndex)) {




      if (event.previousContainer.data[event.previousIndex].date < new Date()) { // to avoid chaning past sessions
        // alert('cant edit past sessions')
        this.ErrorMsg = `Can't Edit Slots in The Past!`
        this.ErrorOrNot = false
        this.togglePopUpError('normal')
      }
      else if (event.container.data[event.currentIndex].reservedOrNot) { // already reserved so cant overwrite it
        // alert('there is already reservation here')
        this.ErrorMsg = `There is already Reservation in This Slot!`
        this.ErrorOrNot = false
        this.togglePopUpError('normal')
      }

      else if (event.container.data[event.currentIndex].date < new Date()) { // cant edit to the past
        // alert('cant edit date to the past') // cant drag from or to the current day
        this.ErrorMsg = `Can't Edit Slots to The Past!`
        this.ErrorOrNot = false
        this.togglePopUpError('normal')
      }

      else if (event.container.data[event.currentIndex].daysOffOrNot) { // to avoid reserve in daysoff
        // alert('cant edit past sessions')
        this.ErrorMsg = `Can't Reserve Slots in Working Days Off!`
        this.ErrorOrNot = false
        this.togglePopUpError('normal')
      }


      else if (!event.container.data[event.currentIndex].workHoursOrNot) { // want to make reservation in outworkinghours
        // alert('cant edit to no workinghours')
        this.ErrorMsg = `Can't Edit Slots to Slots Out of Working Hours!`
        this.ErrorOrNot = false
        this.togglePopUpError('normal')
      }

      else {
        // alert('success')
        this.ErrorMsg = `You Will Reserve an Appointment for Patient 
            ${event.previousContainer.data[event.previousIndex].PatientName}, on Date 
            ${this.convertToStringDate(event.container.data[event.currentIndex].date)} at 
            ${this.addZero(event.container.data[event.currentIndex].StartTime.hour)}:${this.addZero(event.container.data[event.currentIndex].StartTime.min)}`
        this.ErrorOrNot = true
        this.togglePopUpError('confirm')


      }


    }
    else { // must never fire this error since the constulation duration wil only effect future slots
      // alert('not same duration failed or in place')

      // this.ErrorMsg = `Not Same Consultation Duration!`
      // this.ErrorOrNot = false
      // this.togglePopUpError('normal')

      // console.log('not the same consultation duration errorrr!!')
    }
    // event.container.data[event.currentIndex]= event.previousContainer.data[event.previousIndex]
    // this.FillTableThu[event.currentIndex]=this.FillTableSat[event.previousIndex]
    // console.log('thur', this.FillTableThu)
    // console.log('sat', this.FillTableSat)

    // if (event.previousContainer === event.container) {
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } 
    // else {
    //   transferArrayItem(
    //     event.previousContainer.data,
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex,
    //   );
    // }
  }


  public togglePopUpError(ErrorType: string) { // used to pop an error
    this.ToggleErrorMsg()
    // if (ErrorType == 'normal') { // will close it normaly
    //   setTimeout(() => { // to close it automatically
    //     this.RemoveErrorMsg()
    //   }, 150000);
    // }

  }

  public ToggleErrorMsg() {
    const popUpLayerError = document.querySelector('.popUpLayerError')
    popUpLayerError?.classList.toggle('visible')
    const popUpError = document.querySelector('.popUpError')
    popUpError?.classList.toggle('popUpCloseError')

  }


  public ToggleAddPatient() {
    console.log('am here man')
    const popUpLayerAddPatient = document.querySelector('.popUpLayerAddPatient')
    popUpLayerAddPatient?.classList.toggle('visible')

    const popUpAddPateint = document.querySelector('.popUpAddPateint')
    popUpAddPateint?.classList.toggle('popUpCloseAddPatient')

  }


  public RemoveErrorMsg() {
    const popUpLayerError = document.querySelector('.popUpLayerError')
    popUpLayerError?.classList.remove('visible')
    const popUpError = document.querySelector('.popUpError')
    popUpError?.classList.remove('popUpCloseError')
  }

  public handleConfirm() {
    console.log('in confrim')
    this.ChangeSlot(this.GlobalEvent)
    this.RemoveErrorMsg()
    this.ToggleLoadingIndicator()
  }

  public ChangeSlot(event: CdkDragDrop<any[]>) {
    //add to the new slot
    event.container.data[event.currentIndex].PatientID = event.previousContainer.data[event.previousIndex].PatientID // swap the data from prev to current
    event.container.data[event.currentIndex].reservedOrNot = true // make it reserved
    event.container.data[event.currentIndex].PatientName = event.previousContainer.data[event.previousIndex].PatientName // make it unreserved
    // event.container.data[event.currentIndex].appointmentId= event.previousContainer.data[event.previousIndex].appointmentId +1// make it unreserved // will be set in reserve
    /// musssssssssssssst fix the aboveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee///
    // must wait until the id is added to all appointments then retrive it as we did above

    let WholeDate = this.getWholeDateFormat(event.container.data[event.currentIndex].date, event.container.data[event.currentIndex].StartTime)


    // just open this if the apissssssss work ///////////////
    let DelteThisId = event.previousContainer.data[event.previousIndex].appointmentId
    console.log(DelteThisId);

    let AddThisPateintId = event.container.data[event.currentIndex].PatientID
    console.log('the sent appoitnmentId', DelteThisId)
    this.EditAppointmentDetails(DelteThisId, event.container.data[event.currentIndex].date, event.container.data[event.currentIndex].StartTime) // give it the previous appointmentId

    event.previousContainer.data[event.previousIndex].PatientID = 0 // reset the id
    event.previousContainer.data[event.previousIndex].reservedOrNot = false // make it unreserved
    event.previousContainer.data[event.previousIndex].PatientName = '' // make it unreserved
    event.previousContainer.data[event.previousIndex].appointmentId = -1 // make it unreserved
    console.log('the current New', event.container.data)
    console.log('the previo New', event.previousContainer.data)

  }



  public async getDaysOff() {
    this.settingsService.getDaysOff().subscribe({
      next: (data: any) => {
        console.log(data);

        this.CurrentDaysOff = data.getDayOff
        console.log(this.CurrentDaysOff);

      },
      complete: () => { // must here call the function that will display the days off
        this.colorDaysOff()
      },
    })
    return {} // in case fails
  }

  public colorDaysOff() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    console.log('Andrewwwwww');

    for (const currentItem of this.CurrentDaysOff) {

      let DayIndex = currentItem.day
      console.log(DayIndex);
      let DayName = DayIndex;
      // console.log('dayName',DayName)
      console.log('in days offfffffffffffffff');
      console.log(DayName);


      let currentDay = this.FillTableSun // as default only
      switch (DayName) {
        case 'Sunday': currentDay = this.FillTableSun; break
        case 'Monday': currentDay = this.FillTableMon; break
        case 'Tuesday': currentDay = this.FillTableTue; break
        case 'Wednesday': currentDay = this.FillTableWed; break
        case 'Thursday': currentDay = this.FillTableThu; break
        case 'Friday': currentDay = this.FillTableFri; break
        case 'Saturday': currentDay = this.FillTableSat; break
      }
      for (const currentSlot of currentDay) {
        currentSlot.daysOffOrNot = true // set the entire day as dayoff
      }
    }
  }



  public AllAppointments: any[] = []
  //done
  public async getAppointments() {
    this.appointmentsService.getAllAppointments().subscribe({
      next: (data: any) => {
        this.AllAppointments = data.getAppointment
        return data
      },
      complete: () => {
        this.colorReserved();
      }
    })
  }

  public PatientDetails: any = {}
  //done
  public async colorReserved() { // must be fixed
    console.log('this allappo', this.AllAppointments)
    for (const currentApp of this.AllAppointments) {
      this.patientsService.getPatientByID(currentApp.patientId._id).subscribe({
        next: (data: any) => {
          console.log(data);

          this.PatientDetails = data.getpatient
          console.log(this.PatientDetails);

          console.log('am working maaaaaaaan')
        },
        complete: () => {
          console.log(currentApp.date);
          console.log(currentApp.time);
          let i = 0;
          console.log(i += 1);
          console.log(new Date('04/20/2023'));

          // TO ENSRE IT GET THE NAME OF THE PATEINT
          let startTimeTemp = new Date(currentApp.date + " " + currentApp.time)
          console.log(startTimeTemp);
          // will return
          var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
          var dayName = days[startTimeTemp.getDay()];
          console.log(dayName);

          let currentDay = this.FillTableSun // as default only

          switch (dayName) {
            case 'sun': currentDay = this.FillTableSun; break
            case 'mon': currentDay = this.FillTableMon; break
            case 'tue': currentDay = this.FillTableTue; break
            case 'wed': currentDay = this.FillTableWed; break
            case 'thu': currentDay = this.FillTableThu; break
            case 'fri': currentDay = this.FillTableFri; break
            case 'sat': currentDay = this.FillTableSat; break
          }
          for (const currentSlot of currentDay) {
            const startTimeHour = startTimeTemp.getHours()
            console.log('andrew' + ' ' + startTimeHour);

            const startTimeMin = startTimeTemp.getMinutes()

            const AppointmentDate = this.getWholeDateFormatTemp(currentApp.date + ' ' + currentApp.time)

            const CurrentSlotDate = this.getWholeDateFormatTemp(currentSlot.date)


            if (currentSlot.StartTime.hour == startTimeHour && currentSlot.StartTime.min == startTimeMin
              && AppointmentDate == CurrentSlotDate) {
              console.log(currentSlot);


              currentSlot.PatientID = currentApp.patientId._id
              currentSlot.PatientName = this.PatientDetails.PatientName
              currentSlot.reservedOrNot = true
              currentSlot.appointmentId = currentApp._id
              console.log(currentSlot);

            }
            else {

            }
          }
        },
      })
    }
    this.getDaysOff()
  }

  public nextWeekIndex = 0

  public nextWeek() {
    this.nextWeekIndex += 7
    this.HideCalender()
    this.ngOnInit()
  }

  public previousWeek() {
    this.nextWeekIndex -= 7
    this.HideCalender()
    this.ngOnInit()
  }


  public nextMonth() {
    this.nextWeekIndex += 30
    this.HideCalender()
    this.ngOnInit()
  }

  public previousMonth() {
    this.nextWeekIndex -= 30
    this.HideCalender()
    this.ngOnInit()
  }

  public handleDeleteAppointment() {
    this.TogglePopUpEditPatient()
    this.ToggleLoadingIndicator()
    console.log('in delete appoint');
    console.log('send', this.SendDetailsToEdit)
    console.log('the currentslected', this.currentSelectedSlot)
    let PatientAppointments = this.AllAppointments

    for (const currentAppointment of PatientAppointments) {
      console.log(currentAppointment);

      let currentAppointmentNew: any = new Date(currentAppointment.date + ' ' + currentAppointment.time) // will return
      console.log(currentAppointmentNew)
      const startTimeHour = currentAppointmentNew.getHours()
      const startTimeMin = currentAppointmentNew.getMinutes()

      const AppointmentDate = this.getWholeDateFormatTemp(currentAppointment.date + ' ' + currentAppointment.time)
      const CurrentSlotDate = this.getWholeDateFormatTemp(this.currentSelectedSlot.date)

      if (this.currentSelectedSlot.StartTime.hour == startTimeHour &&
        this.currentSelectedSlot.StartTime.min == startTimeMin
        && AppointmentDate == CurrentSlotDate) {

        console.log('found the appointId', currentAppointment._id);
        let currentDay = this.FillTableSun
        switch (this.currentSelectedSlot.day) {
          case 'sun': currentDay = this.FillTableSun; break
          case 'mon': currentDay = this.FillTableMon; break
          case 'tue': currentDay = this.FillTableTue; break
          case 'wed': currentDay = this.FillTableWed; break
          case 'thu': currentDay = this.FillTableThu; break
          case 'fri': currentDay = this.FillTableFri; break
          case 'sat': currentDay = this.FillTableSat; break
        }
        for (const currentDaySlot of currentDay) {
          const currentDaySlotDate: any = this.getWholeDateFormatTemp(currentDaySlot.date)
          if (currentDaySlotDate == CurrentSlotDate &&
            currentDaySlot.StartTime.hour == this.currentSelectedSlot.StartTime.hour &&
            currentDaySlot.StartTime.min == this.currentSelectedSlot.StartTime.min
          ) {
            currentDaySlot.PatientID = 0 // reset the id
            currentDaySlot.reservedOrNot = false // make it unreserved
            currentDaySlot.PatientName = '' // make it unreserved
            currentDaySlot.appointmentId = -1 // make it unreserved
            console.log('in ifffff found the slot man')
            break
          }
        }
        this.deleteAppointmentNormal(currentAppointment._id)

      }
    }


  }

  public deleteAppointmentNormal(AppointmentId: number) {
    this.appointmentsService.deleteAppointment(AppointmentId).subscribe({
      next: (data: any) => {
        console.log('data', data)
      }, error: err => console.log(err),

      complete: () => { // here i will reserve the new appointment
        this.ToggleLoadingIndicator()

      },
    })
  }





  public TogglePopUpEditPatient() {
    console.log('in pop edit')
    // this.resetAll()
    const popUpLayerEditPatient = document.querySelector('.popUpLayerEditPatient')
    popUpLayerEditPatient?.classList.toggle('visible')

    const popUpEditPatient = document.querySelector('.popUpEditPatient')
    popUpEditPatient?.classList.toggle('popUpCloseEditPatient')
  }



  public handleEditPatientDetails(ConfrimedOrNot: boolean) {
    console.log('in parent Confrim', ConfrimedOrNot)
    if (ConfrimedOrNot) {
      this.TogglePopUpEditPatient() // will be done in parent
      this.ToggleLoadingIndicator() // start the loading
      this.colorReserved() // color them again
      setTimeout(() => {
        this.ToggleLoadingIndicator() // start the loading
      }, 100);
    }
  }


  public handleEditAppointmentDetails(ConfrimedOrNot: any) { // the currentPaient to edit
    console.log('in parent handleEditAppointmentDetails', ConfrimedOrNot)
    if (ConfrimedOrNot) {
      this.TogglePopUpEditPatient() // will be done in parent
      this.ToggleLoadingIndicator() // start the loading
      this.findSlotAndReset()
      this.getAppointments() // color them again
      setTimeout(() => {
        this.ToggleLoadingIndicator() // start the loading
      }, 100);
    }
  }

  public handleEditPatientVitals(ConfrimedOrNot: any) { // the currentPaient to edit
    console.log('in parent handleEditPatientVitals', ConfrimedOrNot)
    if (ConfrimedOrNot) {
      this.TogglePopUpEditPatient() // will be done in parent
      this.ToggleLoadingIndicator() // start the loading
      setTimeout(() => {
        this.ToggleLoadingIndicator() // start the loading
      }, 3000);
    }
  }

  public EditAppointmentDetails = (AppointmentId: any, date: any, time: any) => {
    console.log(date);
    console.log(AppointmentId);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();


    const formattedDate = `${day}/${month}/${year}`;

    let timer = time.hour.toString() + ':' + time.min.toString();

    this.appointmentsService.editAppointment(AppointmentId, formattedDate, timer).subscribe({
      next: (data: any) => {
        console.log(data)
        console.log('succ in edit appo');
        this.isWait = false;
        window.location.reload();
      }, error: (err => {
        console.log(err);

      })
    })


  }


  public EditPatientDetailsRespond = {
    actionCompleted: false,
    message: '',
    token: ''
  }

  public GlobalError = '' // that will be sent to the child










  public findSlotAndReset() {
    let currentDay = this.FillTableSun // as default only
    switch (this.currentSelectedSlot.day) {
      case 'sun': currentDay = this.FillTableSun; break
      case 'mon': currentDay = this.FillTableMon; break
      case 'tue': currentDay = this.FillTableTue; break
      case 'wed': currentDay = this.FillTableWed; break
      case 'thu': currentDay = this.FillTableThu; break
      case 'fri': currentDay = this.FillTableFri; break
      case 'sat': currentDay = this.FillTableSat; break
    }
    const CurrentSlotDate = this.getWholeDateFormatTemp(this.currentSelectedSlot.date)

    for (const currentDaySlot of currentDay) {
      const currentDaySlotDate: any = this.getWholeDateFormatTemp(currentDaySlot.date)
      console.log(currentDaySlot.StartTime.hour);
      console.log(this.currentSelectedSlot.StartTime.hour);

      if (currentDaySlotDate == CurrentSlotDate &&
        currentDaySlot.StartTime.hour == this.currentSelectedSlot.StartTime.hour &&
        currentDaySlot.StartTime.min == this.currentSelectedSlot.StartTime.min
      ) {
        currentDaySlot.PatientID = 0 // reset the id
        currentDaySlot.reservedOrNot = false // make it unreserved
        currentDaySlot.PatientName = '' // make it unreserved
        currentDaySlot.appointmentId = -1 // make it unreserved
        console.log('found ittttt and deleting it')
        break
      }
    }

  }







}


