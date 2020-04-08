import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { MatSnackBarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: () => import('./group-list/group-list.module').then((mod) => mod.GroupListModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then((mod) => mod.LoginModule),
  },
  { path: 'private-policy', loadChildren: () => import('./private-policy/private-policy.module').then((mod) => mod.PrivatePolicyModule) },
  {
    path: 'term-of-service',
    loadChildren: () => import('./term-of-service/term-of-service.module').then((mod) => mod.TermOfServiceModule),
  },
  { path: '', redirectTo: '/groups', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
