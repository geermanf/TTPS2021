import { AuthService } from 'src/app/modules/auth';
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { StudyService } from '../../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import 'material-icons/iconfont/material-icons.css';
import { CrudOperation } from 'src/app/modules/shared/utils/crud-operation.model';

let $: any = jQuery;
@Component({
    selector: "app-payment-upload-modal",
    templateUrl: "./payment-upload-modal.component.html"
  })
 
  export class PaymentUploadModalComponent implements OnInit {
    constructor(public modal: NgbActiveModal,public authService: AuthService, private studyService: StudyService, private formBuilder: FormBuilder ) 
    {}
    @Input() idStudy: number;
    uploadForm: FormGroup;  
    @ViewChild('labelUpload')
    labelImport: ElementRef;
    public isUploaded = false;

    ngOnInit(): void {
      this.uploadForm = this.formBuilder.group({
        file: ['']
      });
    };
    onFileSelected(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0]
        if (file) {
          this.labelImport.nativeElement.innerText = file.name;
          this.uploadForm.get('file').setValue(file);
        }
      }
    }
    
    upload() {
        const formData = new FormData();
        formData.append('file', this.uploadForm.get('file').value);
        const upload$ = this.studyService.uploadPaymentReceipt(formData,this.idStudy).subscribe(response => {
        // this.modal.close({status:CrudOperation.SUCCESS})
        this.isUploaded = true;
        });
      }
  
    downloadConsent() {
        this.studyService.downloadConsent(this.idStudy).subscribe(blobConsent => {
        const fileURL = URL.createObjectURL(blobConsent);
        window.open(fileURL, '_blank');
        });
        this.modal.close({status:CrudOperation.SUCCESS})
    }
  }
    