import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { SampleBathes } from '../_model/sample-batches.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleBatchesService extends TableService<SampleBathes> implements OnDestroy {
  API_URL = `${environment.apiUrl}/sample_batches`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
  
  registerSampleBatcheProcess(batchedId: number, url: string): Observable<any> {
    
    return this.http.post(this.API_URL+'/'+batchedId+'/mark-as-processed', url);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

   

