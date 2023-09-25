import { Injectable } from '@angular/core';
import { IAppointment } from 'src/models/IAppointment';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {



  constructor(
    private http: HttpClient

  ) { }

  public BaseUrl: string = 'http://localhost:3000'


  public getAllAppointments() {
    return this.http.get(`${this.BaseUrl}/getAllAppointmentForDoctor`)
  }

  public reserveAppointment(patientId: any, time: any) {
    console.log(time);

    return this.http.post(`${this.BaseUrl}/addAppointment`, { patientId, time })
  }

  public addAppointment(doctorId: any, time: any) {
    console.log(time);

    return this.http.post(`${this.BaseUrl}/addAppointmentForPatient`, { doctorId, time })
  }

  public deleteAppointment(AppointmentId: number) {
    return this.http.delete<any>(`${this.BaseUrl}/deleteAppointment/${AppointmentId}`)
  }

  public editAppointment(appointmentId: any, date: any, time: any) {
    return this.http.post<any>(`${this.BaseUrl}/editAppointment/${appointmentId}`, { date, time })
  }


  // for vitals

  public getVitals(appoitnmentId: any, patientId: any): Observable<any> { // used to get user by Id to get more info about him
    return this.http.get(`${this.BaseUrl}/getVitals/${appoitnmentId}/${patientId}`);
  }

  public editVitals(appointmentId: any, patientId: any, AllVitals: any) { // used to get user by Id to get more info about him
    return this.http.post<any>(`${this.BaseUrl}/addVitals/${appointmentId}/${patientId}`, AllVitals);
  }



  //for EMR

  public getEMR(AppoitnmentId: any) { // uto get EMR
    return this.http.get(`${this.BaseUrl}/getEmr/${AppoitnmentId}`);
  }

  public addEMR(AppoitnmentId: any, name: any) { // to set the emr by sending a file format
    console.log('servce');
    console.log(File);
    console.log(AppoitnmentId);


    return this.http.post<any>(`${this.BaseUrl}/addEmr/${AppoitnmentId}`, name);
  }

  public deleteEMR(DocumentId: any) {
    return this.http.delete<any>(`${this.BaseUrl}/deleteEmr/${DocumentId}`, {});
  }


}
