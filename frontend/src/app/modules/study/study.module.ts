import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditStudyModalComponent } from './study-list/components/edit-study-modal/edit-study-modal.component';
import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { StudyListComponent } from './study-list/study-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    StudyComponent,
    StudyListComponent,
    EditStudyModalComponent,
  ],
  imports: [
    CommonModule,
    StudyRoutingModule,
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
    EditStudyModalComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class StudyModule {}
