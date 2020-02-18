import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TermOfServiceComponent } from './term-of-service.component';

@NgModule({
  declarations: [TermOfServiceComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TermOfServiceComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class TermOfServiceModule {}
