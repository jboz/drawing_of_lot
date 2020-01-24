import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { UserService } from '../auth/user/user.service';
import { Group, Member } from './group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private userService: UserService, private db: AngularFirestore) {}

  public get groups$(): Observable<Group[]> {
    return this.userService.user$.pipe(
      mergeMap(user => this.db.collection<Group>(`/users/${user.uid}/groups`).snapshotChanges()),
      map(docs => docs.map(doc => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id })))
    );
  }

  public generateId() {
    return this.db.createId();
  }

  public group$(id: string): Observable<Group> {
    return this.userService.user$.pipe(
      mergeMap(user => this.db.doc<Group>(`/users/${user.uid}/groups/${id}`).snapshotChanges()),
      map(doc => ({ ...doc.payload.data(), id: doc.payload.id }))
    );
  }

  public save(group: Group) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap(user => this.db.doc<Group>(`/users/${user.uid}/groups/${group.id}`).set(group))
      )
      .subscribe();
  }

  public remove(group: Group) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap(user => this.db.doc<Group>(`/users/${user.uid}/groups/${group.id}`).delete())
      )
      .subscribe();
  }

  public members$(group: Group): Observable<Member[]> {
    return this.userService.user$.pipe(
      mergeMap(user => this.db.collection<Member>(`/users/${user.uid}/groups/${group.id}/members`).snapshotChanges()),
      map(docs => docs.map(doc => ({ ...doc.payload.doc.data(), id: doc.payload.doc.id })))
    );
  }

  public addMember$(group: Group, member: Member) {
    if (!member.label) {
      throw new Error('Member label is mandatory');
    }
    return this.userService.user$.pipe(
      take(1),
      mergeMap(user =>
        this.db.collection<Member>(`/users/${user.uid}/groups/${group.id}/members`).add({ ...member, id: this.generateId() })
      )
    );
  }

  public deleteMember(group: Group, member: Member) {
    return this.userService.user$
      .pipe(
        take(1),
        mergeMap(user => this.db.doc<Member>(`/users/${user.uid}/groups/${group.id}/members/${member.id}`).delete())
      )
      .subscribe();
  }
}
