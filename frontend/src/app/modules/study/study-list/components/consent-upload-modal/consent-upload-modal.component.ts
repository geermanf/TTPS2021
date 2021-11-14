import { AuthService } from 'src/app/modules/auth';
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import * as jQuery from 'jquery';
import 'bootstrap-notify';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
let $: any = jQuery;
@Component({
    selector: "app-consent-upload-modal",
    templateUrl: "./consent-upload-modal.component.html"
  })
 
  export class ConsentUploadModalComponent implements OnInit {
    constructor(public modal: NgbActiveModal,public authService: AuthService ) 
    {}
    afuConfig;  
    ngOnInit(): void {
        $.notify({
            title: '<strong>Operanción exitosa.</strong>',
            message: 'Se ha eliminado correctamente el vehiculo ' 
          }, {
            type: 'success'
          });

        this.afuConfig = {
            multiple: false,
            formatsAllowed: ".pdf",
            maxSize: "7",
            uploadAPI:  {
              url:`${environment.apiUrl}/`+'studies/1/signed-consent',
              method:"POST",
              headers: {
                "Content-Type" : "text/plain;charset=UTF-8",
                "Authorization" : `Bearer ${this.authService.getAuthFromLocalStorage().access_token}`
                 },
              responseType: 'application/json',
            },
            hideProgressBar: false,
            hideResetBtn: true,
            hideSelectBtn: false,
            fileNameIndex: false,
            replaceTexts: {
              selectFileBtn: 'Selecionar Consentimiento',
              uploadBtn: 'Subir',
              afterUploadMsg_success: 'El registro fue existo!',
              afterUploadMsg_error: 'Existió un error al intentar reguistrar el consentimiento !',
              sizeLimit: 'Límite de tamaño'
            }
    }
    
    
    };
    
    
    consentUploadSuccessfully(response){

    }

    loadStudy() {
    /*
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
      }*/
    }
     
    }
    