import { Component, Input, OnInit} from "@angular/core";
import {
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { CrudOperation } from "src/app/modules/shared/utils/crud-operation.model";
import { TypeStudyService } from "../../_service/type-study.service";


@Component({
  selector: "app-edit-template-modal",
  templateUrl: "./edit-template-modal.component.html",
})

export class EditTemplateModalComponent implements OnInit {
    @Input() typeStudyId: number;
    @Input() template: string;
    public editorContent:string;
    public options: Object = {
      listAdvancedTypes: true,
      height: 500
    }
    constructor(
    private typeStudyService: TypeStudyService,
    public modal: NgbActiveModal) 
    { }
    
    ngOnInit(): void {
        this.editorContent = this.template;
    }
  
    
  save() {
      this.typeStudyService.updateTemplatee(this.typeStudyId, this.editorContent).subscribe(
          rpta =>  this.modal.close({status:CrudOperation.SUCCESS})
      );
  }
}
