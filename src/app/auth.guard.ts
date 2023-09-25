import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {

  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('currentDoctor');
    const splitedToken = token!.split(".")[1]
    const atb = JSON.parse(atob(splitedToken));
    if (atb.role == 'Doctor') {
      return true
    }
    else {
      this.router.navigate(['/patient/login'])
      localStorage.removeItem('currentDoctor')
      setTimeout(() => {
        window.location.reload()
      }, 5);
      return false
    }
  }



}
