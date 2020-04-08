import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import random from 'lodash/random';
import { Observable } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { UserService } from '../auth/user/user.service';
import { Group, Member, Purpose } from './group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private userService: UserService, private db: AngularFirestore, private snackBar: MatSnackBar) {}

  public get groups$(): Observable<Group[]> {
    return this.userService.user$.pipe(
      mergeMap((user) => this.db.collection<Group>(`/users/${user.uid}/groups`).snapshotChanges()),
      map((docs) => docs.map((doc) => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id })))
    );
  }

  public generateId() {
    return this.db.createId();
  }

  public group$(id: string): Observable<Group> {
    return this.userService.user$.pipe(
      mergeMap((user) => this.db.doc<Group>(`/users/${user.uid}/groups/${id}`).snapshotChanges()),
      map((doc) => ({ ...doc.payload.data(), id: doc.payload.id }))
    );
  }

  public save(group: Group) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap((user) => this.db.doc<Group>(`/users/${user.uid}/groups/${group.id}`).set(group))
      )
      .toPromise();
  }

  public remove(group: Group) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap((user) => this.db.doc<Group>(`/users/${user.uid}/groups/${group.id}`).delete())
      )
      .toPromise();
  }

  public members$(group: Group): Observable<Member[]> {
    return this.userService.user$.pipe(
      mergeMap((user) => this.db.collection<Member>(`/users/${user.uid}/groups/${group.id}/members`).snapshotChanges()),
      map((docs) => docs.map((doc) => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id })))
    );
  }

  public addMember$(group: Group, member: Member) {
    if (!member.label) {
      throw new Error('Member label is mandatory');
    }
    return this.userService.user$.pipe(
      take(1),
      mergeMap((user) =>
        this.db.collection<Member>(`/users/${user.uid}/groups/${group.id}/members`).add({ ...member, id: this.generateId() })
      )
    );
  }

  public deleteMember(group: Group, member: Member) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap((user) => this.db.doc<Member>(`/users/${user.uid}/groups/${group.id}/members/${member.id}`).delete())
      )
      .toPromise();
  }

  public random(group: Group) {
    return this.members$(group)
      .pipe(
        take(1),
        map((members) => members[random(0, members.length - 1)]),
        tap((member) =>
          this.snackBar.open(member.label, 'X', {
            duration: 5000,
          })
        )
      )
      .toPromise();
  }

  public purposes$(group: Group): Observable<Purpose[]> {
    return this.userService.user$.pipe(
      mergeMap((user) => this.db.collection<Purpose>(`/users/${user.uid}/groups/${group.id}/purposes`).snapshotChanges()),
      map((docs) => docs.map((doc) => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id, group })))
    );
  }

  public purposeUses$(purpose: Purpose): Observable<Member[]> {
    return this.userService.user$.pipe(
      mergeMap((user) =>
        this.db.collection<Member>(`/users/${user.uid}/groups/${purpose.group.id}/purposes/${purpose.id}/uses`).snapshotChanges()
      ),
      map((docs) => docs.map((doc) => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id })))
    );
  }

  deletePurpose(purpose: Purpose) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap((user) => this.db.doc<Member>(`/users/${user.uid}/groups/${purpose.group.id}/purposes/${purpose.id}`).delete())
      )
      .toPromise();
  }
}
