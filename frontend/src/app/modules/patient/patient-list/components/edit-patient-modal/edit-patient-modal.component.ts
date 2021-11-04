import { Component, Injectable, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { of, Subscription } from "rxjs";
import { catchError, finalize, first, tap } from "rxjs/operators";
import { Patient } from "../../../_models/patient.model";
import { PatientService } from "../../../_services";
import {
  CustomAdapter,
  CustomDateParserFormatter,
  getDateFromString,
} from "../../../../../_metronic/core";
import { ValidationErrors } from "src/app/modules/shared/validation-errors";

const EMPTY_PATIENT = Patient.getEmpty();

@Component({
  selector: "app-edit-patient-modal",
  templateUrl: "./edit-patient-modal.component.html",
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class EditPatientModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  patient: Patient;
  formGroup: FormGroup;
  validationErrors: ValidationErrors = new ValidationErrors();

  private subscriptions: Subscription[] = [];
  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    config: NgbDatepickerConfig
  ) {
    // customize default values of datepickers used by this component tree
    config.minDate = { year: 1900, month: 1, day: 1 };
    let now = new Date();
    config.maxDate = { year: now.getFullYear(), month: 12, day: 31 };
  }
  ngOnInit(): void {
    this.isLoading$ = this.patientService.isLoading$;
    this.loadPatient();
  }

  loadPatient() {
    if (!this.id) {
      this.patient = EMPTY_PATIENT;
      this.loadForm();
    } else {
      const sb = this.patientService
        .getItemById(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(EMPTY_PATIENT);
          })
        )
        .subscribe((patient: Patient) => {
          this.patient = patient;
          var date = new Date(this.patient.birth_date);
          this.patient.birth_date = { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear()};
          this.loadForm();
        });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      first_name: [
        this.patient.first_name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      last_name: [
        this.patient.last_name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      email: [
        this.patient.email,
        Validators.compose([Validators.required, Validators.email]),
      ],
      username: [
        this.patient.username,
        Validators.compose([Validators.required]),
      ],
      dni: [
        this.patient.dni,
        Validators.compose([
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(9),
        ]),
      ],
      birth_date: [
        this.patient.birth_date,
        Validators.compose([Validators.required]),
      ],
      clinical_history: [
        this.patient.clinical_history,
        Validators.compose([Validators.maxLength(255)]),
      ],
      health_insurance_number: [this.patient.health_insurance_number],
    });
  }

  save() {
    let patient = new Patient();
    this.patient = patient.prepare(this.formGroup.value);
    if (this.patient.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.patientService
      .update(this.patient)
      .pipe(
        tap(() => {
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.patient);
        })
      )
      .subscribe((res) => (this.patient = res));
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.patient.is_active = true;
    const sbCreate = this.patientService
      .create(this.patient)
      .pipe(
        tap(() => {
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.patient);
        })
      )
      .subscribe((res: Patient) => (this.patient = res));
    this.subscriptions.push(sbCreate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}