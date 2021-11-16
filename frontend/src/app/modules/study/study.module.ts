import { AngularEditorModule } from '@kolkov/angular-editor';
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
import {MatIconModule} from '@angular/material/icon';
import { PaymentUploadModalComponent } from './study-list/components/payment-upload-modal/payment-upload-modal.component';
import { ShiftReservationModalComponent } from './study-list/components/shift-reservation-modal/shift-reservation-modal.component';
import { RegisterSampleModalComponent} from './study-list/components/register-sample-modal/register-sample-modal.component';
import { RegisterSamplePickupModalComponent } from './study-list/components/register-sample-pickup-modal/register-sample-pickup-modal';
import { RegisterReportModalComponent } from './study-list/components/register-report-modal/register-report-modal.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [
    StudyComponent,
    StudyListComponent,
    EditStudyModalComponent,
    ConsentUploadModalComponent,
    PaymentUploadModalComponent,
    ShiftReservationModalComponent,
    RegisterSampleModalComponent,
    RegisterSamplePickupModalComponent,
    RegisterReportModalComponent
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
    MatIconModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
    
  ],
  entryComponents: [
    EditStudyModalComponent,
    ConsentUploadModalComponent,
    PaymentUploadModalComponent,
    ShiftReservationModalComponent,
    RegisterSampleModalComponent,
    RegisterSamplePickupModalComponent,
  ],
  exports: [ FroalaEditorModule, FroalaViewModule],


  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class StudyModule {}
