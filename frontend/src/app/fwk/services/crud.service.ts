import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ADto, FilterDTO, ItemDto, PagedListResultDto } from '../models/base.model';
import { isMoment } from 'moment';
import { QueryParamsModel } from '../_base/crud';

export interface Service {
  endpoint: string;
}

@Injectable()
export abstract class CrudService<T extends ADto> implements Service {

  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  endpoint: string;

  constructor(protected http: HttpClient) {
  }

  getParams(filter: FilterDTO) {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(function (item) {
        if (filter[item] !== null) {
          if (isMoment(filter[item])) {
            params = params.set(item, new Date(filter[item].toDate().getTime() - (filter[item].toDate().getTimezoneOffset() * 60000)).toJSON());
          } else if (filter[item] instanceof Date) {
            params = params.set(item, new Date(filter[item].getTime() - (filter[item].getTimezoneOffset() * 60000)).toJSON());
          }
          else if(filter[item] instanceof Array) {
            for (const id of filter[item]) {
              params = params.append(item, id);
            }
          }
          else {
            params = params.set(item, filter[item]);
          }
        }
      });
    }

    return params;
  }

  list(filter: FilterDTO): Observable<PagedListResultDto<T>> {
    const params = this.getParams(filter);
    return this.http.get<PagedListResultDto<T>>(this.endpoint + '/List', { params: params });
  }

  get(id): Observable<T> {
    return this.http.get<T>(this.endpoint + '?PrimaryKey=' + id);
  }

  getItems(filter: FilterDTO): Observable<ItemDto[]> {
    const params = this.getParams(filter);
    return this.http.get<ItemDto[]>(this.endpoint + '/Items', { params: params });
  }

  add(data: T): Observable<any> {
    return this.http.post<any>(this.endpoint, data);
  }

  update(data: T): Observable<any> {
    return this.http.put<any>(this.endpoint, data);
  }

  delete(id): Observable<any> {
    return this.http.delete<any>(this.endpoint + '?PrimaryKey=' + id);
  }

  downloadPdf(filter: FilterDTO): Observable<any> {
    const params = this.getParams(filter);
    return this.http.get(this.endpoint + '/GetUserReportPdf', { params: params,  responseType: 'blob' });
  }

  downloadExcel(filter: FilterDTO): Observable<any> {
    const params = this.getParams(filter);
    return this.http.get(this.endpoint + '/GetUserReportExcel', { params: params, responseType: 'blob' });
  }
}
