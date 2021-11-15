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
  selector: "app-register-sample-pickup-modal",
  templateUrl: "./register-sample-pickup-modal.html",
})

export class RegisterSamplePickupModalComponent  {
    @Input() idStudy: number;
    public picked_up_by: string;
    
    constructor(
    private studyService: StudyService,
    public modal: NgbActiveModal,
    ) 
    { }
  
  ngOnInit(): void {
    
  }
     
  save() {
    this.studyService.registerPickupSample(this.idStudy, this.picked_up_by).subscribe(
      rpta => this.modal.close({status:CrudOperation.SUCCESS})
    )
  }
}
