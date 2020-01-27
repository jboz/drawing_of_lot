import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService) {
    // firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  ngOnInit() {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.userService.updateUserData(signInSuccessData.authResult.user);
  }
}
