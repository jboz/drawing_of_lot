import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../auth/user/user.service';
import { Group } from '../domain/group.model';
import { GroupService } from '../domain/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  displayedColumns = ['name', 'actions'];

  groups$: Observable<Group[]> = this.groupService.groups$;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  public logout() {
    this.userService.disconnect();
  }

  edit(group: Group) {
    this.router.navigate(['/groups', group.id]);
  }

  remove(group: Group) {
    this.groupService.remove(group);
  }

  create() {
    this.router.navigate(['/groups', this.groupService.generateId()]);
  }
}
