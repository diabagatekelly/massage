import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    fullPath;

    private _defaultCenterColl = 'philly';
    private _eStoreColl = 'store';

    constructor(private _http: HttpClient, public afAuth: AngularFireAuth,
                private storage: AngularFireStorage, private afs: AngularFirestore) { }

    createEmployees(data) {
        // const id = this.afs.createId();
        // const emp = { id, name };
        // const docRef = this.afs.collection('employees').doc(emp.id);
        // return docRef.set({
        //     ...data,
        //     _id: id,
        // });
        return new Promise<any>((resolve, reject) => {
            this.afs
                .collection('employees')
                .add(data);
    });
}

    getEmployees() {
         return this.afs.collection('employees').snapshotChanges();
        // return this.afs.collection('employees', ref =>
        //     ref
        //         .orderBy('name')
        // ).snapshotChanges();
      }

      updateWorking(data, docId) {
          console.log(data);
          return this.afs
            .collection('employees')
            .doc(docId)
            .set({
                info: {
                    working: data,
                }
            }, { merge: true });
     }

      updateEmployees(data: any, docId) {
          console.log(data, data.info.name, data.info.bio);
          if ((data.info.name === '' || data.info.name === null) && data.info.bio !== '') {
          console.log('bio no name');
          return this.afs
            .collection('employees')
            .doc(docId)
            .set({
                info: {
                    bio: data.info.bio,
                }
            }, {merge: true});
          }
          if (data.info.name !== '' && (data.info.bio === '' || data.info.bio === null)) {
         console.log('name no bio');
         return this.afs
            .collection('employees')
            .doc(docId)
            .set({
                info: {
                    name: data.info.name
                }
            }, {merge: true});
          }
          if (data.info.name !== '' && data.info.bio !== '') {
            console.log('bio and name');
            return this.afs
               .collection('employees')
               .doc(docId)
               .set({
                   info: {
                       name: data.info.name,
                       bio: data.info.bio
                   }
               }, {merge: true});
             }
     }

     setProductPic(filePath, coll, docId?) {
        console.log('I am running');
        console.log(coll);
        const ref = this.storage.ref(filePath);
        this.fullPath = ref.getDownloadURL();
        this.fullPath.subscribe((downloadURL) => {

            // Now create the Firestore entry
            this.afs.collection(coll).doc(docId).set({
                FileURL: downloadURL,
            }, {merge: true});
        });
    }

     deleteEmployees(data) {
        return this.afs
            .collection('employees')
            .doc(data.payload.doc.id)
            .delete();
     }

    // getConfig() {
    //     return environment.social;
    // }

    checkIfUserSignedIn() {
        return this.afAuth.authState;
    }

    getUser(): Promise<any> {
        return this.afAuth.authState.pipe(take(1)).toPromise();
      }

    // function to send emails using a PHP API
    // sendEmail(messageData) {
    //     const httpOptions = {
    //         headers: new HttpHeaders({ 'Content-Type': 'application/X-www-form-urlencoded' })
    //     };
    //     return this._http.post(environment.emailAPI, messageData, httpOptions);
    // }

    // sign-up page - create a new user
    // createUser(formData) {
    //     if (environment.database == 'firebase') {
    //         return this.afAuth.auth.createUserWithEmailAndPassword(formData.value.email, formData.value.password);
    //     }
    //     if (environment.database == 'SQL') {
    //         // need to call SQL API here if a SQL Database is used
    //     }
    // }

    // login page - login with FB/GOOGLE/EMAIL, if formData is passed, this means is user is using email/password login
    login(loginType, formData?) {
        if (formData) {
            return this.afAuth.auth.signInWithEmailAndPassword(formData.email, formData.password);
        } else {
            let loginMethod;
            if (loginType === 'GOOGLE') { loginMethod = new firebase.auth.GoogleAuthProvider(); }

            return this.afAuth.auth.signInWithRedirect(loginMethod);
        }
    }

    logout() {
        window.localStorage.removeItem('displayName');
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('picture');
        window.localStorage.removeItem('center');
        window.localStorage.removeItem('token');
        return this.afAuth.auth.signOut();
    }

    // method to retreive firebase auth after login redirect
    redirectLogin() {
        return this.afAuth.auth.getRedirectResult();
    }

    //////////// firebase eStore funcitons START ///////////////
    get timestamp() {
        const d = new Date();
        return d;
        // return firebase.firestore.FieldValue.serverTimestamp();
    }
    timestampMinusDays(filter) {
        const d = new Date();
        d.setDate(d.getDate() - filter);
        return d;
    }
    getCollectionURL(coll) {
        coll = 'employees';
        return coll;
    }

    setExistingDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp;
        const docRef = this.afs.collection(coll).doc(docId);
        return docRef.set(({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
            deconste_flag: 'N'
        }), { merge: true });
    }

    getAdminPortal(coll?: string) {
        if (!coll || coll === 'admins') { coll = this._eStoreColl; }
        return this.getDoc(coll, this.afAuth.auth.currentUser.uid);
    }
    // set product functions start
    getProduct(coll: string, docId: string) {
        coll = 'employees';
        return this.getDoc(coll, docId);
    }
    setProduct(coll: string, formData: any, docId?: string) {
        coll = this._eStoreColl + '/' + this._defaultCenterColl + '/' + coll;
        console.log(coll);
        return this.setNewDoc(coll, formData);
    }
    deconsteProductPic(coll, docId?) {
        coll = this._eStoreColl + '/' + this._defaultCenterColl + '/' + coll;
        const docRef = this.afs.collection(coll).doc(docId);
        return docRef.set({
            path: null
        }, {merge: true});
    }
    getProducts(coll: string) {
        return this.afs.collection(this.getCollectionURL(coll), ref =>
            ref.where('deconste_flag', '==', 'N')
                .orderBy('name')
        ).valueChanges();
        // return this.afs.collection(this.getCollectionURL(coll), ref =>
        //     ref.where('deconste_flag', '==', 'N')
        //         .orderBy('name', 'desc')
        // )
        //     .snapshotChanges().map(actions => {
        //         return actions.map(a => {
        //             const data = a.payload.doc.data();
        //             const id = a.payload.doc.id;
        //             return { id, ...data };
        //         });
        //     });
    }
    getFilterProducts(coll: string, filters) {
        return this.afs.collection(this.getCollectionURL(coll), ref =>
        ref.where('deconste_flag', '==', 'N')
            .where('tags' , 'array-contains', filters)
            .orderBy('tags', 'desc')
    ).valueChanges();
    }
    deconsteProduct(coll, docId) {
        return this.deconsteDoc(this.getCollectionURL(coll), docId);
    }
    updateProduct(coll, formData) {
        return this.updateDoc(this.getCollectionURL(coll), formData._id, formData);
    }
    updateShoppingCart(coll: string, data) {
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp;
        const docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
        return docRef.set({
            ...data,
            author: this.afAuth.auth.currentUser.uid,
            authorName: this.afAuth.auth.currentUser.displayName,
            authorEmail: this.afAuth.auth.currentUser.email,
            authorPhoto: this.afAuth.auth.currentUser.photoURL,
            authorPhone: this.afAuth.auth.currentUser.phoneNumber,
            updatedAt: timestamp,
            createdAt: timestamp,
            deconste_flag: 'N',
        });
    }
    updateShoppingInterest(coll: string, data) {
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp;
        const docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
        return docRef.set({
            ...data,
            author: this.afAuth.auth.currentUser.uid,
            authorName: this.afAuth.auth.currentUser.displayName,
            authorEmail: this.afAuth.auth.currentUser.email,
            authorPhoto: this.afAuth.auth.currentUser.photoURL,
            authorPhone: this.afAuth.auth.currentUser.phoneNumber,
            updatedAt: timestamp,
            createdAt: timestamp,
            deconste_flag: 'N',
        });
    }
    getCart(coll: string) {
        return this.afs.collection(this.getCollectionURL(coll), ref =>
            ref.where('deconste_flag', '==', 'N')
                .where('author', '==', this.afAuth.auth.currentUser.uid)
                .orderBy('name', 'desc')
        ).valueChanges();
            // .snapshotChanges().map(actions => {
            //     return actions.map(a => {
            //         const data = a.payload.doc.data();
            //         const id = a.payload.doc.id;
            //         return { id, ...data };
            //     });
            // });
    }
    // helper functions
    getDoc(coll: string, docId: string) {
        return this.afs.collection(coll).doc(docId).valueChanges();
    }
    setNewDoc(coll: string, data: any, docId?: any) {
        const id = this.afs.createId();
        const item = { id, name };
        const timestamp = this.timestamp;
        const docRef = this.afs.collection(coll).doc(item.id);
        return docRef.set({
            ...data,
            _id: id,
            updatedAt: timestamp,
            createdAt: timestamp,
            deconste_flag: 'N',
            username: this.afAuth.auth.currentUser.displayName,
            useremail: this.afAuth.auth.currentUser.email
        });
    }
    updateDoc(coll: string, docId: string, data: any) {
        const timestamp = this.timestamp;
        const docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            ...data,
            updatedAt: timestamp,
            deconste_flag: 'N',
            username: this.afAuth.auth.currentUser.displayName,
            useremail: this.afAuth.auth.currentUser.email
        });
    }
    deconsteDoc(coll: string, docId: string) {
        const timestamp = this.timestamp;
        const docRef = this.afs.collection(coll).doc(docId);
        return docRef.update({
            updatedAt: timestamp,
            deconste_flag: 'Y',
            username: this.afAuth.auth.currentUser.displayName,
            useremail: this.afAuth.auth.currentUser.email
        });
    }
    getDocs(coll: string, filters?: any) {
            if (filters) {
                if (filters.name > '') {
                    return this.afs.collection(coll, ref =>
                        ref.where('name', '>=', filters.name)
                            .where('deconste_flag', '==', 'N')
                            .orderBy('name', 'desc')
                    ).valueChanges();
                        // .snapshotChanges().map(actions => {
                        //     return actions.map(a => {
                        //         const data = a.payload.doc.data();
                        //         const id = a.payload.doc.id;
                        //         return { id, ...data };
                        //     });
                        // });
                }
                if (filters.category > '') {
                    return this.afs.collection(coll, ref =>
                        ref.where('category', '>=', filters.category)
                            .where('deconste_flag', '==', 'N')
                            .orderBy('category', 'desc')
                    ).valueChanges();
                        // .snapshotChanges().map(actions => {
                        //     return actions.map(a => {
                        //         const data = a.payload.doc.data();
                        //         const id = a.payload.doc.id;
                        //         return { id, ...data };
                        //     });
                        // });
                } else {
                    const fromDt = new Date(filters.fromdt);
                    const toDt = new Date(filters.todt);
                    return this.afs.collection(coll, ref =>
                        ref.where('updatedAt', '>=', fromDt)
                            .where('updatedAt', '<', toDt)
                            .where('deconste_flag', '==', 'N')
                            .orderBy('updatedAt', 'desc')
                    ).valueChanges();
                        // .snapshotChanges().map(actions => {
                        //     return actions.map(a => {
                        //         const data = a.payload.doc.data();
                        //         const id = a.payload.doc.id;
                        //         return { id, ...data };
                        //     });
                        // });
                }
            } else {
                return this.afs.collection(coll, ref =>
                    ref.where('deconste_flag', '==', 'N')
                        .orderBy('name')
                        .orderBy('updatedAt', 'desc'))
                        .valueChanges();
                    // .snapshotChanges().map(actions => {
                    //     return actions.map(a => {
                    //         const data = a.payload.doc.data();
                    //         const id = a.payload.doc.id;
                    //         return { id, ...data };
                    //     });
                    // });
            }
    }
  }
