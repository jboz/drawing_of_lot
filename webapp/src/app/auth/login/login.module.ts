import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { LoginComponent } from './login.component';

const firebaseUiAuthConfig = {
  signInFlow: 'redirect',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: true,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ],
  signInSuccessUrl: '/',
  // tosUrl: '/',
  // privacyPolicyUrl: '/',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FirebaseUIModule.forRoot(firebaseUiAuthConfig), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginModule {}
