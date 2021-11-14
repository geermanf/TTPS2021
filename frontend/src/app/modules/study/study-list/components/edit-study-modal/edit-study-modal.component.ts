import { Component, Injectable, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { of, Subscription } from "rxjs";
import { catchError, finalize, first, tap } from "rxjs/operators";
import { Diagnosis, Study, StudyList, StudyState, TypeStudy } from "../../../_models/study.model";
import { StudyService } from "../../../_services";
import {
  CustomDateParserFormatter,
} from "../../../../../_metronic/core";
import { ValidationErrors } from "src/app/modules/shared/validation-errors";
import { PatientService } from "src/app/modules/patient/_services";
import { Patient } from "src/app/modules/patient/_models/patient.model";
import { Items } from "src/app/modules/shared/utils/items.model";
import { stringify } from "querystring";
import { DiagnosisService, StudyListService, TypeStudyService } from "../../../_services/study.service";
import { ReferringPhysicianService } from "src/app/modules/referring_physician/_services";
import { ReferringPhysician } from "src/app/modules/referring_physician/_models/referring-physician.model";

const EMPTY_STUDY = Study.getEmpty();

@Component({
  selector: "app-edit-study-modal",
  templateUrl: "./edit-study-modal.component.html",
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class EditStudyModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  study: Study;
  formGroup: FormGroup;
  validationErrors: ValidationErrors = new ValidationErrors();
  public itemsPatients: Items<string, Patient>[]
  public itemsTypeStudy: Items<string, TypeStudy>[]
  public itemsReferringPhysician: Items<string, ReferringPhysician>[]
  public itemsDiagnosis: Items<string, Diagnosis>[]
  private subscriptions: Subscription[] = [];
  public studyState: typeof StudyState = StudyState;
  constructor(
    private studyService: StudyService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    config: NgbDatepickerConfig,
    private patientService: PatientService,
    private typeStudyService: TypeStudyService,
    private referringPhysicianService: ReferringPhysicianService,
    private diagnosisService: DiagnosisService,
    private studyListService: StudyListService, 
    
  ) {
    // customize default values of datepickers used by this component tree
    config.minDate = { year: 1900, month: 1, day: 1 };
    let now = new Date();
    config.maxDate = { year: now.getFullYear(), month: 12, day: 31 };
  }
  ngOnInit(): void {
    this.isLoading$ = this.studyService.isLoading$;
    this.loadStudy();
    this.patientService.fetch();
    this.typeStudyService.fetch();
    this.referringPhysicianService.fetch();
    this.diagnosisService.fetch();
    this.diagnosisService.items$.subscribe(diagnosis => 
      this.itemsDiagnosis = diagnosis.map(diagnosisItem => { return  {name: diagnosisItem.name ,value: diagnosisItem };})
    )

    this.referringPhysicianService.items$.subscribe(referringPhysicians => 
      this.itemsReferringPhysician = referringPhysicians.map(referringPhysicianItem => { return  {name: referringPhysicianItem.first_name +', ' + referringPhysicianItem.last_name,value: referringPhysicianItem };})
    )
    this.typeStudyService.items$.subscribe(typeStudies => 
      this.itemsTypeStudy = typeStudies.map(typeStudyItem => { return  {name: typeStudyItem.name, value: typeStudyItem};})
      )
    this.patientService.items$.subscribe(patients => 
      this.itemsPatients = patients.map(patientItem => { return  {name: patientItem.first_name +', ' + patientItem.last_name, value: patientItem };})
      )
  }

  loadStudy() {
    if (!this.id) {
      this.study = EMPTY_STUDY;
      this.loadForm();
    } else {
      const sb = this.studyListService
        .getItemById(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(EMPTY_STUDY);
          })
        )
        .subscribe((study: StudyList) => {
          this.study = EMPTY_STUDY;
          this.study.id = study.id;
          this.study.referring_physician_id =study.referring_physician.id;
          this.study.patient_id =study.patient.id;
          this.study.presumptive_diagnosis_id =study.presumptive_diagnosis.id;
          this.study.type_study_id =study.type_study.id;
          this.study.budget = study.budget;
          this.study.current_state = study.current_state;
          this.loadForm();
        });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
       this.formGroup = this.fb.group({
      referring_physician: [
        this.study.referring_physician_id,
        Validators.compose([Validators.required]),
      ],
      patient: [
        this.study.patient_id,
        Validators.compose([Validators.required]),
      ],
      type_study: [
        this.study.type_study_id,
        Validators.compose([Validators.required]),
      ],
      presumptive_diagnosis: [
        this.study.presumptive_diagnosis_id,
        Validators.compose([Validators.required]),
      ],
      budget: [
        this.study.budget,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(9),
        ])
      ]
    });
  }

  save() {
    let study = new Study();
    study.id = this.study.id;
    this.study = study.prepare(this.formGroup.value);
    if (this.study.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.studyService
      .update(this.study)
      .pipe(
        tap(() => {
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.study);
        })
      )
      .subscribe((res) => (this.study = res));
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.studyService
      .create(this.study)
      .pipe(
        tap(() => {
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.study);
        })
      )
      .subscribe((res: Study) => (this.study = res));
    this.subscriptions.push(sbCreate);
  }
  getSelectedItem(items: Items<string, any>[], id: number){
      return items.find(it=> it.value.id == id);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}