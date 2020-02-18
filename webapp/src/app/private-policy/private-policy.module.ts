import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PrivatePolicyComponent } from './private-policy.component';

@NgModule({
  declarations: [PrivatePolicyComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PrivatePolicyComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class PrivatePolicyModule {}
