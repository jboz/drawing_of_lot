import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/user/user.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  constructor(private userService: UserService) {}

  public logout() {
    this.userService.disconnect();
  }

  ngOnInit() {}
}
