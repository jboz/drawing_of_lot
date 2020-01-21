import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { GroupListComponent } from './group-list.component';

@NgModule({
  declarations: [GroupListComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forChild([
      {
        path: '',
        component: GroupListComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class GroupListModule {}
