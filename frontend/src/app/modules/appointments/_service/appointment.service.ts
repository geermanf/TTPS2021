//http://0.0.0.0:8000/api/v1/appointments/
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Appointment } from '../_models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService extends TableService<Appointment> implements OnDestroy {
  API_URL = `${environment.apiUrl}/appointments`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getAppointments(date: string): Observable<Appointment[]> {
    return this.http.post<Appointment[]>(this.API_URL, date);
  }
}
