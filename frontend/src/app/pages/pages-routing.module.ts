import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'patients',
        loadChildren: () =>
          import('../modules/patient/patient.module').then(
            (m) => m.PatientModule
          ),
      },
      {
        path: 'studies',
        loadChildren: () =>
          import('../modules/study/study.module').then(
            (m) => m.StudyModule
          ),
      },
      {
        path: 'sample-batches',
        loadChildren: () =>
          import('../modules/sample_batches/sample-batches.module').then(
            (m) => m.SampleBatchesModule
          ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
