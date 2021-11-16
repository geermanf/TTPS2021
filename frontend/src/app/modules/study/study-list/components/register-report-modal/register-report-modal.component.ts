import { Component, Input} from "@angular/core";
import {
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { StudyService } from "../../../_services";
import { CrudOperation } from "src/app/modules/shared/utils/crud-operation.model";


@Component({
  selector: "app-register-report-modal",
  templateUrl: "./register-report-modal.component.html",
})

export class RegisterReportModalComponent  {
    @Input() idStudy: number;
    public editorContent:string;
    public result:string;
    public options: Object = {
      listAdvancedTypes: true,
      height: 500
    }
    constructor(
    private studyService: StudyService,
    public modal: NgbActiveModal) 
    { }
  
    
  save() {
    /*console.log(this.result);
    console.log(this.editorContent);
    console.log((this.result && this.editorContent));*/
    this.studyService.registerReport(this.idStudy,this.result,this.editorContent).subscribe(
      rpta => this.modal.close({status:CrudOperation.SUCCESS})
    )
  }
}
