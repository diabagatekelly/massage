import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export enum FormStatus {
  Initial,
  Success,
  Pending,
  Error
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  readonly FormStatus = FormStatus;
  formStatus = FormStatus.Initial;

  form = new FormGroup ({
    contact: new FormGroup ({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      address: new FormControl(''),
      details: new FormControl('')
    }),

    admin: new FormGroup ({
      lead: new FormControl(''),
      newsletter: new FormControl('')
    })


  });

  get emailIsInvalid() {
    return (this.form.controls.contact as FormArray).controls['email'].invalid
    && (this.form.controls.contact as FormArray).controls['email'].touched;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  submit(postData: {name: string, email: string, phone: string, details: string}) {
      console.log(postData);
      this.formStatus = FormStatus.Pending;

      if (this.form.valid) {
        setTimeout(() => { // simulate a async http call
          this.http.post('https://brc-developers-a4969.firebaseio.com/contact.json', postData).subscribe(
        responseData => {
          console.log(responseData);
        }
      );
          this.formStatus = FormStatus.Success;
          console.log(this.form.value);
          this.form.reset();
        }, 3000);
      } else {
        this.formStatus = FormStatus.Error;
      }
    }
  }
