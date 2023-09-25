import { Injectable } from '@angular/core';
import { IDoctor } from 'src/models/IDoctor';
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  public Login(enteredEmail: string, enteredPassword: string) { // used for login
    return this.http.post<any>(`http://andrew1234-001-site1.htempurl.com/api/Accounts/Login`,
      {
        Email: enteredEmail,
        Password: enteredPassword
      });
  }

  public Logout() {
    localStorage.removeItem('token') // once its removed it will redirect you to login
    this.router.navigate(['/login'])
  }



  public BaseUrl: string = 'http://andrew1234-001-site1.htempurl.com/api/Doctors'

  public getConsultationDuration() {
    return this.http.get(`${this.BaseUrl}/GetConsultationDuration`)
  }

  public getWorkHours() {
    return this.http.get(`${this.BaseUrl}/GetWorkHours`)
  }

  public getDaysOff() {
    return this.http.get(`${this.BaseUrl}/GetDaysOff`)
  }



}
