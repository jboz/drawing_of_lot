import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from './user/user.model';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private userService: UserService) {}

  public get user$(): Observable<User> {
    return this.userService.user$;
  }

  public signOutUser() {
    return this.fireauth.auth.signOut();
  }
}
