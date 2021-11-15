import { Component, Input} from "@angular/core";
import {
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { StudyService } from "../../../_services";
import { CrudOperation } from "src/app/modules/shared/utils/crud-operation.model";

export interface RegisterSample {
    ml_extracted: number,
    freezer_number: number
}

@Component({
  selector: "app-register-sample-modal",
  templateUrl: "./register-sample-modal.html",
})

export class RegisterSampleModalComponent  {
    @Input() idStudy: number;
    public ml_extracted: number;
    public freezer_number: number;
    
    constructor(
    private studyService: StudyService,
    public modal: NgbActiveModal,
    ) 
    { }
  
  ngOnInit(): void {
    
  }
     
  save() {
    this.studyService.registerSample(this.idStudy, {ml_extracted: this.ml_extracted, freezer_number:this.freezer_number}).subscribe(
      rpta => this.modal.close({status:CrudOperation.SUCCESS})
    )
  }
}
