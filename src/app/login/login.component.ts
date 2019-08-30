import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure, FirebaseuiAngularLibraryService} from 'firebaseui-angular';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router: Router,
              private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService) {
                firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
              }

  ngOnInit() {
    this.afAuth.authState.subscribe(d => console.log(d));

    // const uiConfig = {
    //   signInSuccessUrl: '/admin-panel',
    //   signInOptions: [
    //     // Leave the lines as is for the providers you want to offer your users.
    //     firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //     firebase.auth.GoogleAuthProvider.PROVIDER_ID
    //   ],

    //   callbacks: {
    //     signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)
    //   }


      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      // tosUrl: '<your-tos-url>',
      // Privacy policy url/callback.
      // privacyPolicyUrl: function() {
      //   window.location.assign('<your-privacy-policy-url>');
      // }
//     };

//     this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);
//     this.ui.start('#firebaseui-auth', uiConfig);

//    onLoginSuccessful() {
//       console.log('sign-in successful');
// }
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    this.router.navigate(['admin-panel']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

}
