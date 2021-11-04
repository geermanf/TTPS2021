import { Component, Injectable, Input } from "@angular/core";
import { ControlContainer, FormGroup, FormGroupDirective } from "@angular/forms";
import { ValidationErrors } from "./validation-errors";

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

@Injectable()
export class InputFormComponent {
    @Input() placeholder = '';
    @Input() type: string = "text";
    @Input() name: string = "";
    @Input() valid: boolean = true;
    @Input() required: boolean = true;
    @Input() minlength: boolean = false;
    @Input() maxLength: boolean = false;
    @Input() email: boolean = false;
    @Input() validationMinlength: number = 3;
    @Input() validationMaxLength: number = 50;

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