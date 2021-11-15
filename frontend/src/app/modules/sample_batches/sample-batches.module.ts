import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import { SampleBatchesComponent } from './sample-batches.component';
import { SampleBatchesRoutingModule } from './sample-batches-routing.module';
import { SampleBatchesListComponent } from './sample-batches-list/sample-batches-list.component';


@NgModule({
  declarations: [
    SampleBatchesComponent,
    SampleBatchesListComponent
  ],
  imports: [
    CommonModule,
    SampleBatchesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    SharedModule,
    MatDatepickerModule,
    MatIconModule
   
  ],
  entryComponents: [
    SampleBatchesListComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class SampleBatchesModule {}
