import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
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
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: GroupListComponent
      },
      {
        path: ':groupId',
        loadChildren: () => import('./group-edit/group-edit.module').then(mod => mod.GroupEditModule)
      }
    ])
  ],
  exports: [RouterModule]
})
export class GroupListModule {}
