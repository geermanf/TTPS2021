import { Component, Input} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { StudyService } from "../../../_services";
import { ValidationErrors } from "src/app/modules/shared/validation-errors";
import { Patient } from "src/app/modules/patient/_models/patient.model";
import { Items } from "src/app/modules/shared/utils/items.model";

@Component({
  selector: "app-shift-reservation-modal",
  templateUrl: "./shift-reservation-modal.component.html",
})
export class ShiftReservationModalComponent  {
  @Input() id: number;
  isLoading$;
  formGroup: FormGroup;
  validationErrors: ValidationErrors = new ValidationErrors();
  public items_available_shift: Items<string, Patient>[]
  private subscriptions: Subscription[] = [];
  constructor(
    private studyService: StudyService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    config: NgbDatepickerConfig) 
    {}
  
  ngOnInit(): void {
    this.isLoading$ = this.studyService.isLoading$;
  }
}