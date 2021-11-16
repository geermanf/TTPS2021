import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TypeStudyComponent } from './type-study.component';
import { TypeStudyRoutingModule } from './type-study-routing.module';
import { TypeStudyListComponent } from './type-study-list/type-study-list.component';
import { EditTemplateModalComponent } from './type-study-list/component/edit-template-modal.component';

@NgModule({
  declarations: [
    TypeStudyComponent,
    TypeStudyListComponent,
    EditTemplateModalComponent
  ],
  imports: [
    CommonModule,
    TypeStudyRoutingModule,
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
    TypeStudyListComponent, EditTemplateModalComponent
  ],
  exports: [ FroalaEditorModule, FroalaViewModule],


  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class TypeStudyModule {}
