import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModalModule, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { InlineSVGModule } from "ng-inline-svg";
import { CRUDTableModule } from "src/app/_metronic/shared/crud-table";
import { DatePickerFormComponent } from "./date-picker-form";
import { InputFormComponent } from "./input-form";



@NgModule({
  declarations: [
    InputFormComponent,
    DatePickerFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  exports: [
    InputFormComponent,
    DatePickerFormComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class SharedModule {}
