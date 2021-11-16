import { AuthService } from 'src/app/modules/auth';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { StudyService } from '../../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { CrudOperation } from 'src/app/modules/shared/utils/crud-operation.model';

let $: any = jQuery;
@Component({
    selector: "app-consent-upload-modal",
    templateUrl: "./consent-upload-modal.component.html"
  })
 
  export class ConsentUploadModalComponent implements OnInit {
    constructor(public modal: NgbActiveModal,public authService: AuthService, private studyService: StudyService, private formBuilder: FormBuilder ) 
    {}
    @Input() idStudy: number;
    uploadForm: FormGroup;  
    @ViewChild('labelUpload')
    labelImport: ElementRef;


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
      const upload$ = this.studyService.uploadConsent(formData,this.idStudy).subscribe(response => {
        this.modal.close({status:CrudOperation.SUCCESS})
        });
      }
  
   }
    