import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DEFAULT_USER, User } from './user.model';

@Injectable()
export class UserService {
  constructor(private fireauth: AngularFireAuth, private db: AngularFirestore) {}

  public get user$(): Observable<User> {
    return this.fireauth.user.pipe(
      filter(user => !!user),
      map(user => ({ ...DEFAULT_USER, ...user }))
    );
  }

  public disconnect() {
    return this.fireauth.auth.signOut();
  }

  public async updateUserData(user: firebase.User): Promise<void> {
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
    data.lastConnection = new Date().toLocaleString();

    return this.db.doc(`users/${data.uid}`).set(data, { merge: true });
  }
}
