import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientDetailsService {


  public baseUrl: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }



  public getAllPaitents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients`);
  }
  public getPaitientDetails(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients/${id}`)
  }
  public getAllDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/allDoctors`)
  }
  public getDoctorById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/Doctor/${id}`)
  }
  public getAllAppointments(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllAppointmentForPatient/${id}`)
  }
  public getAllAppointmentsForDoctor(dId: any, pId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllAppointmentForDoctor/${dId}/${pId}`)
  }
  public searchPatient(search: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/patients/search`, { searchTerm: search })
  }

  public addNewPatient(NewPatient: any) { // used to get user by Id to get more info about him
    return this.http.post<any>(`${this.baseUrl}/addPatient`, NewPatient);
  }

  public getPatientByID(ID: number) { // used to get user by Id to get more info about him
    return this.http.get(`${this.baseUrl}/patients/${ID}`)
  }

  public editPatient(CurrentPatient: any, PatientId: any) {
    console.log(CurrentPatient);

    return this.http.post<any>(`${this.baseUrl}/editPatient/${PatientId}`, CurrentPatient);
  }

}

