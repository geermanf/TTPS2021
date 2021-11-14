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
import { ConsentUploadModalComponent } from './study-list/components/consent-upload-modal/consent-upload-modal.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';


@NgModule({
  declarations: [
    StudyComponent,
    StudyListComponent,
    EditStudyModalComponent,
    ConsentUploadModalComponent
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
    MatDatepickerModule,
    AngularFileUploaderModule
    
  ],
  entryComponents: [
    EditStudyModalComponent,
    ConsentUploadModalComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class StudyModule {}
