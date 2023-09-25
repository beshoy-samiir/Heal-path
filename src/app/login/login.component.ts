import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['a@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required]
  });
  token: any
  isLoading: boolean = true;
  errmessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: AuthService
  ) { }

  ngOnInit(): void {
  }
  loginSubmit() {
    if (this.loginForm.valid) {
      this.loginService.loginDoctor(this.loginForm.value).subscribe({
        next: (data => {
          console.log(data);

          if (data.apiStatues) {
            console.log('hi');
            console.log(data.data.token);

            this.token = localStorage.setItem("currentDoctor", data.data.token)
            setTimeout(() => {
              window.location.reload()
            }, 500)
            this.router.navigate(['/home'])
          }
        }),
        error: (err => {
          console.log(err)
          console.log(err.error);

          this.errmessage = err.error
          console.log(this.errmessage);

          this.router.navigate(['/login'])
        })
      })

    }
  }

}     
