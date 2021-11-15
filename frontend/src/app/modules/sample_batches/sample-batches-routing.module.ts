import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleBatchesListComponent } from './sample-batches-list/sample-batches-list.component';
import { SampleBatchesComponent } from './sample-batches.component';


const routes: Routes = [
  {
    path: '',
    component: SampleBatchesComponent,
    children: [
      {
        path: 'sample-batches',
        component: SampleBatchesListComponent,
      },
      { path: '', redirectTo: 'sample-batches', pathMatch: 'full' },
      { path: '**', redirectTo: 'sample-batches', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleBatchesRoutingModule {}
