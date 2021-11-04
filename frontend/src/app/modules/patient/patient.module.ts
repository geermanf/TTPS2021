import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditPatientModalComponent } from './patient-list/components/edit-patient-modal/edit-patient-modal.component';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { DeleteModalComponent } from './patient-list/components/delete-patient-modal/delete-modal.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PatientComponent,
    PatientListComponent,
    DeleteModalComponent,
    EditPatientModalComponent,
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    SharedModule,
    MatDatepickerModule
  ],
  entryComponents: [
    DeleteModalComponent,
    EditPatientModalComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class PatientModule {}
