import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypeStudyListComponent } from './type-study-list/type-study-list.component';
import { TypeStudyComponent } from './type-study.component';

const routes: Routes = [
  {
    path: '',
    component: TypeStudyComponent,
    children: [
      {
        path: 'type-studies',
        component: TypeStudyListComponent,
      },
      { path: '', redirectTo: 'type-studies', pathMatch: 'full' },
      { path: '**', redirectTo: 'type-studies', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeStudyRoutingModule {}
