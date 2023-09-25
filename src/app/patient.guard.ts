import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('currentDoctor');

    if (token) {
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
