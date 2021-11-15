import { Component, Input} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { ValidationErrors } from "src/app/modules/shared/validation-errors";
import { Patient } from "src/app/modules/patient/_models/patient.model";
import { Items } from "src/app/modules/shared/utils/items.model";
import { AppointmentService } from "src/app/modules/appointments/_service/appointment.service";
import { Appointment } from "src/app/modules/appointments/_models/appointment.model";

@Component({
  selector: "app-shift-reservation-modal",
  templateUrl: "./shift-reservation-modal.component.html",
})
export class ShiftReservationModalComponent  {
  @Input() idStudy: number;
  isLoading$;
  date_reservation: NgbDateStruct;
  selected_shift: string
  shifts: string[]
  public shift_reservation: Appointment[];  
  public items_available_shift: Items<string, Patient>[]
  constructor(
    private appointmentService: AppointmentService,
    public modal: NgbActiveModal,
    config: NgbDatepickerConfig,
    ) 
    {
      config.minDate = { year: 1900, month: 1, day: 1 };
      let now = new Date();
      config.maxDate = { year: now.getFullYear(), month: 12, day: 31 };
    }
  
  ngOnInit(): void {
    this.isLoading$ = this.appointmentService.isLoading$;
  }
  getReservation(date) {
    this.appointmentService.getAppointments(date.year+'-'+date.month+'-'+date.day).subscribe(
      appointments => {
        console.log(appointments);
      }
    )
  }

}