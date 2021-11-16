import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { Diagnosis, Study, StudyList, TypeStudy } from '../_models/study.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Reservation } from '../study-list/components/shift-reservation-modal/shift-reservation-modal.component';
import { RegisterSample } from '../study-list/components/register-sample-modal/register-sample-modal.component';

@Injectable({
  providedIn: 'root'
})
export class StudyService extends TableService<Study> implements OnDestroy {
  API_URL = `${environment.apiUrl}/studies`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  downloadConsent(studyId: number): Observable<any> {
    return this.http.get(this.API_URL+'/'+studyId+'/download-consent',{responseType: 'blob'});
  }
  
  uploadConsent(formData: FormData, studyId: number): Observable<any> {
    return this.http.post(this.API_URL+'/'+studyId+'/signed-consent', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  
  uploadPaymentReceipt(formData: FormData, studyId: number): Observable<any> {
    return this.http.post(this.API_URL+'/'+studyId+'/payment-receipt', formData);
  }
  
  registerAppointment(studyId: number, reservation: Reservation): Observable<any> {
    return this.http.post(this.API_URL+'/'+studyId+'/register-appointment', reservation);
  }

  registerSample(studyId: number, registerSample: RegisterSample): Observable<any> {
    return this.http.post(this.API_URL+'/'+studyId+'/register-sample', registerSample);
  }
  
  registerPickupSample(studyId: number, picked_up_by: string): Observable<any> {
    return this.http.post(this.API_URL+'/'+studyId+'/register-sample-pickup', picked_up_by);
  }
  
  registerReport(studyId: number, result:string, report: string): Observable<any> {
    return this.http.post(this.API_URL+'/'+studyId+'/add-report', {result: result, report : report });
  }
  
}

@Injectable({
  providedIn: 'root'
})
export class TypeStudyService extends TableService<TypeStudy> implements OnDestroy {
  API_URL = `${environment.apiUrl}/type-studies`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService extends TableService<Diagnosis> implements OnDestroy {
  API_URL = `${environment.apiUrl}/presumptive_diagnoses`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

@Injectable({
  providedIn: 'root'
})
export class StudyListService extends TableService<StudyList> implements OnDestroy {
  API_URL = `${environment.apiUrl}/studies`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
   
}
