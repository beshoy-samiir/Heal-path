import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-add-days-off',
  templateUrl: './add-days-off.component.html',
  styleUrls: ['./add-days-off.component.css']
})
export class AddDaysOffComponent implements OnInit {

  res: any

  daysOffForm: FormGroup = this.fb.group({
    day: ['', Validators.required],
  });
  constructor(private fb: FormBuilder,
    private dayOff: SettingsService) { }

  ngOnInit(): void {
  }

  public setDay() {
    this.dayOff.setDaysOff(this.daysOffForm.value).subscribe({
      next: (data => {
        console.log(data);
      }
      ),
      error: (err => console.log(err)),
      complete: () => window.location.reload()
    })
  }

}







