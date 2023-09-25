import { Component, OnInit } from '@angular/core';
import { PatientDetailsService } from 'src/app/services/patient-details.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {
  doctors: any;
  workingHours: any;
  duration: any;
  start: any
  end: any
  docID: any
  workhours: any
  formatDate: any
  appoTime: any
  errMess: any
  selectedDate: any;
  constructor(
    private patientService: PatientDetailsService,
    private worikingHoursService: SettingsService,
    private appointmentService: AppointmentsService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllDoctors()
  }
  getAllDoctors() {

    this.patientService.getAllDoctors().subscribe({
      next: (data) => {
        console.log(data);
        this.doctors = data.data
      }, error: (err) => {
        console.log(err);

      }
    })
  }

  onSelectTime(startTime: any) {
    this.errMess = '';

    console.log(startTime.target.value);

    if (startTime.target.value != 'null') {

      this.appoTime = startTime.target.value;
    }
  }
  onSelectDoc(docId: any) {
    console.log(docId.target.value);
    this.docID = docId.target.value
    this.getConsultaionDuration(docId.target.value)
    this.getWorkingHours(docId.target.value)
  }
  onSelectDay(day: any, date: any) {
    this.errMess = '';

    console.log(day);
    const selectedDay = day

    const filteredHours = this.workingHours.workingHour.filter((e: any) => e.day == selectedDay)
    console.log(filteredHours);
    this.workhours = filteredHours;
    filteredHours.forEach((el: any) => {
      const today = new Date();
      const dayIndex = today.getDay();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDayIndex = daysOfWeek.indexOf(el.day);
      let difference = selectedDayIndex - dayIndex;
      console.log(difference);

      if (difference < 0) {
        difference += 7;
      } else if (difference == 0) {
        difference = 0
      }

      // const selectedDate = new Date(today.setDate(today.getDate() + difference));
      // const date = selectedDate.getDate();
      // const month = selectedDate.getMonth() + 1; // Note: JavaScript months are zero-based
      // const year = selectedDate.getFullYear();

      // const formattedDate = `${this.padZero(date)}/${this.padZero(month)}/${year}`;

      // console.log(formattedDate);
      this.formatDate = date
    });
    console.log(this.workhours);

  }
  padZero(value: number): string {
    this.errMess = '';

    return value.toString().padStart(2, '0');
  }

  getWorkingHours(id: any) {
    this.errMess = '';

    this.worikingHoursService.getWorkingHoursForPatient(id).subscribe({
      next: (data => {
        console.log(data);
        this.workingHours = data.data
      }), error: (err) => {
        console.log(err);

      }, complete: () => {
        this.uniqueDays
        this.getStartTime()
      }
    })
  }
  get uniqueDays() {
    this.errMess = '';

    return this.workingHours.workingHour.filter((day: any, index: any, self: any) => {
      return self.findIndex((d: any) => d.day === day.day) === index;
    });
  }
  getConsultaionDuration(id: any) {
    this.errMess = '';

    this.worikingHoursService.getconsultaionDurationForPatient(id).subscribe({
      next: (data => {
        console.log(data);
        this.duration = data.getDuration
        console.log(this.duration);

      }), error: (err) => {
        console.log(err);

      },
    })
  }
  getStartTime() {
    this.errMess = '';

    this.workingHours.workingHour.forEach((e: any) => {
      console.log(e);
      this.start = new Date(`1970-01-01T${e.startTime}:00Z`);
      this.end = new Date(`1970-01-01T${e.endTime}:00Z`);
      var numMeetings = Math.floor((this.end - this.start) / (this.duration.time * 60000));
      e.meetingTimes = []
      for (let i = 0; i < numMeetings; i++) {
        const startTime = new Date(this.start.getTime() + i * this.duration.time * 60000);
        const endTime = new Date(startTime.getTime() + this.duration.time * 60000);
        const meetingRange = {
          startTime: this.formatTime(startTime),
          endTime: this.formatTime(endTime)
        };
        e.meetingTimes.push(meetingRange);

      }
      console.log(e.meetingTimes);

    });
    console.log(this.workingHours);

  }
  formatTime(time: Date): string {
    return time.toISOString().substr(11, 5);
  }
  onSubmit() {
    this.errMess = '';

    const dateFormate = `${this.formatDate} ${this.appoTime}`
    this.appointmentService.addAppointment(this.docID, dateFormate).subscribe({
      next: (data) => {
        console.log(data);
        // window.location.reload()
      }, error: (err) => {
        console.log(err);
        this.errMess = err.error
      }
    })
  }
  exit() {
    this.dialogRef.closeAll()
  }
  todayDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  getDayyy(e: any) {
    this.errMess = '';

    const [years, months, days] = e.target.value.split('-');
    console.log(e.target.value);

    const reversedDateStrings = `${months}/${days}/${years}`;
    console.log(reversedDateStrings);

    this.selectedDate = reversedDateStrings;

    console.log(e.target.value);
    const dayDate = new Date(e.target.value)
    const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
    console.log(dayOfWeek);
    this.onSelectDay(dayOfWeek, this.selectedDate)
  }
}
