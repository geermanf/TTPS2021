import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { Diagnosis, Study, StudyList, TypeStudy } from '../_models/study.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

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
