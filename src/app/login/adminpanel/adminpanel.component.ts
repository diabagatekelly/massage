import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import * as firebase from 'firebase';

export enum FormStatus {
  Initial,
  Pending,
  Success
}

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css'],
})
export class AdminpanelComponent implements OnInit, AfterViewInit, OnDestroy {
// Upload Task
task: AngularFireUploadTask;

// Progress in percentage
percentage: Observable<number>;

// Snapshot of uploading file
snapshot: Observable<any>;

// Uploaded File URL
UploadedFileURL: Observable<string>;

// Uploaded Image List
images: Observable<MyData[]>;

  downloadURL: Observable<string>;
  isHovering: boolean;
  error = false;

employees;
takeHostSelfie = false;
private querySubscription;
dataLoading = false;
profileUrl: Observable<string | null>;
myDocId;
updateDocId;
fullPath;
fileUrl;
empPic = '';

readonly FormStatus = FormStatus;
formStatus = FormStatus.Initial;

form = new FormGroup ({
  info: new FormGroup ({
  name: new FormControl('', [Validators.required]),
  bio: new FormControl(''),
  working: new FormControl('')
  })
});

status = false;


 // File details
 fileName: string;
 fileSize: number;



// tslint:disable-next-line:no-shadowed-variable
constructor(public afAuth: AngularFireAuth, private router: Router, private firebase: FirebaseService,
            private modalService: NgbModal, private storage: AngularFireStorage) {
            }

  ngOnInit() {
    this.getEmployees();
  }

  ngAfterViewInit() {
    this.getEmployees();
  }


startUpload(event: FileList) {
  const file = event.item(0);
  if (file.type.split('/')[0] !== 'image') {
      this.error = true;
      console.log('unsupporterd file type');
      return;
  } else {
      this.error = false;
  }
  const filePath = this.fileUrl + '/' + new Date().getTime();
  const fileRef = this.storage.ref(filePath);
  const task = this.storage.upload(filePath, file);
  this.percentage = task.percentageChanges();

  this.task = this.storage.upload(filePath, file);
  this.percentage = this.task.percentageChanges();
  this.querySubscription = this.task.snapshotChanges().pipe(
      finalize(() => {
          // this.downloadURL = fileRef.getDownloadURL();
          console.log('I am called');
          return this.firebase.setProductPic(filePath, this.fileUrl, this.myDocId);
      })
  ).subscribe();
}

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['admin']);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  submit(postData: {name: string, bio: string}) {
    this.dataLoading = true;
    this.firebase.createEmployees(postData).then(res => {
    console.log('im running');
  });
    this.dataLoading = false;
    this.form.reset();
    this.formStatus = FormStatus.Success;
}

getPic(emp) {
  const picId = emp.payload.doc.data().path;
  const ref = this.storage.ref(picId);
  this.profileUrl = ref.getDownloadURL();
}

uploadPic(emp) {
  this.myDocId = emp.payload.doc.id;
  this.fileUrl = 'employees';
  console.log(this.myDocId);
}

  getEmployees = () => {
    this.dataLoading = true;
    this.querySubscription = this.firebase.getEmployees()
    .subscribe(res => {
      this.dataLoading = false;
      this.employees = res;
      this.employees.sort((a, b) => {
        const nameA = a.payload.doc.data().info.name.toUpperCase();
        const nameB = b.payload.doc.data().info.name.toUpperCase();
        console.log(nameA, nameB);
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      console.log(this.empPic);
      console.log(this.employees);
      return this.employees;
    });
  }

  updateEmployees(data) {
    // this.formStatus = FormStatus.Success;
    // // this.form = this.employees;
    // const data = this.form.value;
    this.dataLoading = true;
    this.firebase.updateEmployees(data, this.updateDocId)
         .then(res => {
          this.dataLoading = false;
          this.formStatus = FormStatus.Success;
          console.log(res);
          this.form.reset(res);
         });
}

markWorking(postdata) {
  this.updateDocId = postdata.payload.doc.id;
  let workingStatus = postdata.payload.doc.data().info.working;
  workingStatus = !workingStatus;
  console.log(this.updateDocId);
  this.firebase.updateWorking(workingStatus, this.updateDocId);
}

  deleteEmployees = data => this.firebase.deleteEmployees(data);

  ngOnDestroy() {

    if (this.querySubscription) {
        this.querySubscription.unsubscribe();
    }
}
reloadComponent() {
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate(['/admin-panel']);
}
}
