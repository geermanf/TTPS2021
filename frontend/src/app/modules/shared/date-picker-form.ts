import { Component, Injectable, Input } from "@angular/core";
import { ControlContainer, FormGroup, FormGroupDirective } from "@angular/forms";
import { ValidationErrors } from "./validation-errors";

@Component({
  selector: 'app-date-picker-form',
  templateUrl: './date-picker-form.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

@Injectable()
export class DatePickerFormComponent {
    @Input() placeholder = '';
    @Input() type: string = "text";
    @Input() name: string = "";
    @Input() valid: boolean = true;
    @Input() required: boolean = true;
    @Input() requiredFem: boolean = false;
    @Input() minlength: boolean = false;
    @Input() maxLength: boolean = false;
    @Input() email: boolean = false;

    @Input() formGroup: FormGroup;
    validationErrors: ValidationErrors = new ValidationErrors();

  constructor() {}

    // helpers for View
    isControlValid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.valid && (control.dirty || control.touched);
    }
  
    isControlInvalid(controlName: string): boolean {
      const control = this.formGroup.controls[controlName];
      return control.invalid && (control.dirty || control.touched);
    }
  
    controlHasError(validation, controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.hasError(validation) && (control.dirty || control.touched);
    }
  
    isControlTouched(controlName): boolean {
      const control = this.formGroup.controls[controlName];
      return control.dirty || control.touched;
    }
}