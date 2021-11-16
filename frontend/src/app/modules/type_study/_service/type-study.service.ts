import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TypeStudy } from '../_model/type-study.model';

@Injectable({
  providedIn: 'root'
})
export class TypeStudyService extends TableService<TypeStudy> implements OnDestroy { 
  API_URL = `${environment.apiUrl}/type-studies`;

  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  updateTemplatee(typeStudyId: number, template: string): Observable<any> {
    return this.http.put(this.API_URL+'/'+typeStudyId, template);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  
}

