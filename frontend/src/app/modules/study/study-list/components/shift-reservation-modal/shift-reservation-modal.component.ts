import { Component, Input} from "@angular/core";
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { AppointmentService } from "src/app/modules/appointments/_service/appointment.service";
import { Appointment } from "src/app/modules/appointments/_models/appointment.model";
import { StudyService } from "../../../_services";
import { CrudOperation } from "src/app/modules/shared/utils/crud-operation.model";

export interface Reservation {
  date_appointment: string,
  description: string
}

@Component({
  selector: "app-shift-reservation-modal",
  templateUrl: "./shift-reservation-modal.component.html",
})

export class ShiftReservationModalComponent  {
  @Input() idStudy: number;
  isLoading$;
  date_reservation: NgbDateStruct;
  public selected_shift: string
  shifts: string[]
  public shift_reservation: Appointment[];  
  public description: string='';
  public available_shift: string[];
  constructor(
    private appointmentService: AppointmentService,
    private studyService: StudyService,
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
        this.available_shift = appointments.filter(shift=> shift.patient === null).map(shift => shift.start +'-'+shift.end);
        this.shift_reservation = appointments.filter(shift=> shift.patient !== null);
      }
    )
  }
  
  save() {
    const datetime_reservation = this.date_reservation.year+ '-' + this.date_reservation.month +'-'+this.date_reservation.day+'T'+this.selected_shift.substr(0,5)+':00' ;
    
    this.studyService.registerAppointment(this.idStudy, {date_appointment: datetime_reservation, description:this.description}).subscribe(
      rpta => this.modal.close({status:CrudOperation.SUCCESS})
    )
  }
}
