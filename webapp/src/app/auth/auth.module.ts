import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';

@NgModule({
  declarations: [],
  imports: [AngularFirestoreModule.enablePersistence(), AngularFireAuthModule],
  providers: [AuthService, UserService]
})
export class AuthModule {}
