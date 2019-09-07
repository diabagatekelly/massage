import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';
import { timestamp } from 'rxjs/operators';

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
  dataLoading = false;
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

  constructor(private http: HttpClient, private firebase: FirebaseService) {}

  ngOnInit() {}

  get timestamp() {
    const d = new Date();
    return d;
    // return firebase.firestore.FieldValue.serverTimestamp();
}

  submit(postData: {name: string, email: string, phone: string, address: string, details: string, newsletter: boolean}) {
    this.formStatus = FormStatus.Pending;

    setTimeout(() => {
      this.dataLoading = true;
      const timestamp = this.timestamp;
      this.firebase.createContact(postData, timestamp).then(res => {
      console.log('im running');
    });
      this.dataLoading = false;
      this.formStatus = FormStatus.Success;
      this.form.reset();
    }, 3000)
    }
  }
