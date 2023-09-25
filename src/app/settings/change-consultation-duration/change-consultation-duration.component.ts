import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
@Component({
  selector: 'app-change-consultation-duration',
  templateUrl: './change-consultation-duration.component.html',
  styleUrls: ['./change-consultation-duration.component.css']
})
export class ChangeConsultationDurationComponent implements OnInit {

  cosultaionForm: FormGroup = this.fb.group({
    time: ['', [Validators.required, Validators.min(10)]]
  })

  mins: number = 0
  res: any
  isLoading: boolean = true
  constructor(private fb: FormBuilder, private consultService: SettingsService, private router: Router, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.getDuration();
  }

  public getDuration() {
    this.consultService.getconsultaionDuration().subscribe({
      next: (data => {
        console.log(data);

        this.mins = data.getDuration.time

      }),
      complete: () => {
        setTimeout(() => {
          this.isLoading = false
        }, 200);

      }

    })
  }
  public setDuration() {
    this.consultService.setconsultaionDuration(this.cosultaionForm.value).subscribe({
      next: (data => {
        console.log('the data', data)

      }), error: (err => console.log(err)),
      complete: () => window.location.reload()

    })
  }





}
