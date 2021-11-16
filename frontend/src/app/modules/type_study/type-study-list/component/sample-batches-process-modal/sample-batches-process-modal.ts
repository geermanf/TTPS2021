import { AuthService } from 'src/app/modules/auth';
import {  Component,  Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import 'material-icons/iconfont/material-icons.css';
import { CrudOperation } from 'src/app/modules/shared/utils/crud-operation.model';
import { SampleBatchesService } from '../../../_service';

let $: any = jQuery;
@Component({
    selector: "app-consent-upload-modal",
    templateUrl: "./sample-batches-process-modal.html"
  })
 
  export class SampleBatchesModalProcessComponent {
    constructor(public modal: NgbActiveModal, private sampleBatchesService: SampleBatchesService) 
    {}
    @Input() batched_number: number;
    public url:string;

    process(): void {
        this.sampleBatchesService.registerSampleBatcheProcess(this.batched_number,this.url).subscribe(
            rpta => this.modal.close({status:CrudOperation.SUCCESS})
        )
    };
       }
    