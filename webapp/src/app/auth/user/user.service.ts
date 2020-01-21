import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { DEFAULT_USER, User } from './user.model';

@Injectable()
export class UserService {
  constructor(private fireauth: AngularFireAuth, private db: AngularFirestore) {}

  public get user$(): Observable<User> {
    return this.fireauth.user.pipe(
      filter(user => !!user),
      mergeMap(user =>
        this.db
          .doc<User>(`users/${user.uid}`)
          .valueChanges()
          .pipe(map(userData => ({ ...DEFAULT_USER, ...user, ...userData })))
      )
    );
  }

  public disconnect() {
    return this.fireauth.auth.signOut();
  }

  public updateUser(data: User) {
    return this.user$.pipe(
      take(1),
      mergeMap(user => this.db.doc<User>(`users/${user.uid}`).set({ ...data, uid: user.uid }, { merge: true }))
    );
  }

  public updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const data = {
      uid: user.uid,
      email: user.email
    } as User;

    if (user.displayName) {
      data.displayName = user.displayName;
    }
    if (user.photoURL) {
      data.photoURL = user.photoURL;
    }
    if (user.phoneNumber) {
      data.phoneNumber = user.phoneNumber;
    }

    return this.db.doc(`users/${user.uid}`).set(data, { merge: true });
  }
}
