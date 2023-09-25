import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl: string = 'http://localhost:3000'

  constructor(private http: HttpClient) {
  }


  public loginDoctor(data: Observable<any>): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data)
  }
  public loginPatient(data: Observable<any>): Observable<any> {
    return this.http.post(`${this.baseUrl}/loginPatient`, data)
  }
  public logOut(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Accounts/Signout`)
  }

}
