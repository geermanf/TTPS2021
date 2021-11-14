import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyListComponent } from './study-list/study-list.component';

import { StudyComponent } from './study.component';

const routes: Routes = [
  {
    path: '',
    component: StudyComponent,
    children: [
      {
        path: 'studies',
        component: StudyListComponent,
      },
      { path: '', redirectTo: 'studies', pathMatch: 'full' },
      { path: '**', redirectTo: 'studies', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudyRoutingModule {}
