import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public baseUrl: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  public setWorkingHours(data: Observable<any>): Observable<any> {
    return this.http.post(`${this.baseUrl}/addWorkingHours`, data)
  }
  public getWorkingHours(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getWorkingHours`)
  }
  public getWorkingHoursForPatient(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getWorkingHours/${id}`)
  }
  public getconsultaionDurationForPatient(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDuration/${id}`)
  }
  public getWorkingHoursByDay(day: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/getWorkingHoursByDate/${day}`)
  }
  public getconsultaionDuration(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDuration`)
  }
  public setconsultaionDuration(data: Observable<any>): Observable<any> {
    return this.http.post(`${this.baseUrl}/addDuration`, data)
  }
  public setDaysOff(data: Observable<any>): Observable<any> {
    return this.http.post(`${this.baseUrl}/addDayOff`, data)
  }
  public getDaysOff(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDayOff`)
  }
}
