import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mergeMap, take, tap } from 'rxjs/operators';
import { Group, Member } from 'src/app/domain/group.model';
import { GroupService } from 'src/app/domain/group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    group: this.fb.group({ name: ['', Validators.required] }),
    member: this.fb.group({ label: [''] })
  });

  group$: Observable<Group>;
  members$: Observable<Member[]>;

  private groupSubscription: Subscription;

  constructor(private fb: FormBuilder, private groupService: GroupService, private route: ActivatedRoute, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.group$ = this.route.params.pipe(
      mergeMap(params => this.groupService.group$(params['groupId'])),
      tap(group => this.form.get('group').patchValue(group))
    );
    this.members$ = this.group$.pipe(mergeMap(group => this.groupService.members$(group)));

    this.groupSubscription = this.form
      .get('group')
      .get('name')
      .valueChanges.pipe(debounceTime(2000), distinctUntilChanged())
      .pipe(mergeMap(newName => this.group$.pipe(map(group => ({ ...group, name: newName })))))
      .subscribe(group => this.groupService.save(group));
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
  }

  addMember() {
    this.group$
      .pipe(take(1))
      .pipe(
        mergeMap(group => this.groupService.addMember$(group, { ...this.form.get('member').value } as Member)),
        tap(() => {
          this.form.get('member').patchValue({ label: '' });
          this.form.get('member').reset();
        })
      )
      .subscribe();
  }

  deleteMember(member: Member) {
    this.group$.pipe(take(1)).subscribe(group => this.groupService.deleteMember(group, member));
  }

  random() {
    this.members$
      .pipe(
        take(1),
        map(members => members[_.random(0, members.length - 1)])
      )
      .subscribe(member =>
        this._snackBar.open(member.label, 'X', {
          duration: 5000
        })
      );
  }
}
