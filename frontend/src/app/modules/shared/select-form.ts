import { AfterContentInit, AfterViewInit, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from "@angular/core";
import { ControlContainer, FormGroup, FormGroupDirective } from "@angular/forms";
import { Items } from "./utils/items.model";
import { ValidationErrors } from "./validation-errors";



@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

@Injectable()
export class SelectFormComponent {
    @ViewChild('selectItem') selectItem;
    @Input() placeholder = '';
    @Input() name: string = "";
    @Input() valid: boolean = true;
    @Input() required: boolean = true;
    @Input() formGroup: FormGroup;
    @Input() items: Items<string,any>[];
    public _selectedItem: Items<string, any>;;
    validationErrors: ValidationErrors = new ValidationErrors();
    public selected: Items<string, any>;
    constructor() {}
    
    

    @Input() set selectedItem(item: Items<string, any>) {
          this._selectedItem = item;
    }
  

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