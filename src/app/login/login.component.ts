import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = false;


  constructor(public afAuth: AngularFireAuth, private router: Router, private formBuilder: FormBuilder, private firebase: FirebaseService) {
              }

  ngOnInit() {
    this.error = false;
    this.afAuth.authState.subscribe(d => console.log(d));

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  logout() {
    this.afAuth.auth.signOut();
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    return this.firebase.logIn(this.f.username.value, this.f.password.value)
    .then(() => {
          this.router.navigate(['admin-panel']);
        },
        error => {
            console.log(error);
            this.router.navigate(['/login']);
            this.error = true;
        });
  }

}
