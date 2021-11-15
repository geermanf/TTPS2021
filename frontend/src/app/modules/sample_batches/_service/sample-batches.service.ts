import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { SampleBathes } from '../_model/sample-batches.model';

@Injectable({
  providedIn: 'root'
})
export class SampleBatchesService extends TableService<SampleBathes> implements OnDestroy {
  API_URL = `${environment.apiUrl}/sample_batches`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

   

