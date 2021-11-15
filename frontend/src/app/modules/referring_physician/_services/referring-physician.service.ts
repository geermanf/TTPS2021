import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { ReferringPhysician } from '../_models/referring-physician.model';

@Injectable({
  providedIn: 'root'
})
export class ReferringPhysicianService extends TableService<ReferringPhysician> implements OnDestroy {
  API_URL = `${environment.apiUrl}/referring-physician`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}