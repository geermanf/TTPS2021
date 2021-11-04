import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';

import { PatientComponent } from './patient.component';

const routes: Routes = [
  {
    path: '',
    component: PatientComponent,
    children: [
      {
        path: 'patients',
        component: PatientListComponent,
      },
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: '**', redirectTo: 'patients', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
