import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { BaseModel } from '../../../../_metronic/shared/crud-table';
import { QueryParamsModel } from './query-models/query-params.model';
import { QueryResultsModel } from './query-models/query-results.model';


// Why not use MatTableDataSource?
/*  In this example, we will not be using the built-in MatTableDataSource because its designed for filtering,
	sorting and pagination of a client - side data array.
	Read the article: 'https://blog.angular-university.io/angular-material-data-table/'
**/
export class BaseDataSource implements DataSource<BaseModel> {
  entitySubject = new BehaviorSubject<any[]>([]);
  hasItems = true; // Need to show message: 'No records found'

  // Loading | Progress bar
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;
  isPreloadTextViewed$: Observable<boolean> = of(true);

  // Paginator | Paginators count
  paginatorTotalSubject = new BehaviorSubject<number>(0);
  paginatorTotal$: Observable<number>;
  subscriptions: Subscription[] = [];

  constructor() {
    //this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();

    //// subscribe hasItems to (entitySubject.length==0)
    //const hasItemsSubscription = this.paginatorTotal$.pipe(
    //  distinctUntilChanged(),
    //  skip(1)
    //).subscribe(res => this.hasItems = res > 0);
    //this.subscriptions.push(hasItemsSubscription);

    this.loading$ = this.loadingSubject.asObservable();
    this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    this.paginatorTotal$.subscribe(res => this.hasItems = res > 0);
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    // Connecting data source
    return this.entitySubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    // Disconnect data source
    this.entitySubject.complete();
    this.paginatorTotalSubject.complete();
    this.subscriptions.forEach(sb => sb.unsubscribe());
    this.loadingSubject.complete();
  }

  baseFilter(entities: any[], queryParams: QueryParamsModel, filtrationFields: string[] = []): QueryResultsModel {
    // Filtration
    let entitiesResult = this.searchInArray(entities, queryParams.filter, filtrationFields);

    // Sorting
    // start
    if (queryParams.sortField) {
      entitiesResult = this.sortArray(entitiesResult, queryParams.sortField, queryParams.sortOrder);
    }
    // end

    // Paginator
    // start
    const totalCount = entitiesResult.length;
    const initialPos = queryParams.pageNumber * queryParams.pageSize;
    entitiesResult = entitiesResult.slice(initialPos, initialPos + queryParams.pageSize);
    // end

    const queryResults = new QueryResultsModel();
    queryResults.items = entitiesResult;
    queryResults.totalCount = totalCount;
    return queryResults;
  }

  sortArray(incomingArray: any[], sortField = '', sortOrder = 'asc'): any[] {
    if (!sortField) {
      return incomingArray;
    }

    let result: any[] = [];
    result = incomingArray.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortOrder === 'asc' ? -1 : 1;
      }

      if (a[sortField] > b[sortField]) {
        return sortOrder === 'asc' ? 1 : -1;
      }

      return 0;
    });
    return result;
  }

  searchInArray(incomingArray: any[], queryObj: any, filtrationFields: string[] = []): any[] {
    const result: any[] = [];
    let resultBuffer: any[] = [];
    const indexes: number[] = [];
    let firstIndexes: number[] = [];
    let doSearch = false;

    filtrationFields.forEach(item => {
      if (item in queryObj) {
        incomingArray.forEach((element, index) => {
          if (element[item] === queryObj[item]) {
            firstIndexes.push(index);
          }
        });
        firstIndexes.forEach(element => {
          resultBuffer.push(incomingArray[element]);
        });
        incomingArray = resultBuffer.slice(0);
        resultBuffer = [].slice(0);
        firstIndexes = [].slice(0);
      }
    });

    Object.keys(queryObj).forEach(key => {
      const searchText = queryObj[key].toString().trim().toLowerCase();
      if (key && !_.includes(filtrationFields, key) && searchText) {
        doSearch = true;
        try {
          incomingArray.forEach((element, index) => {
            const _val = element[key].toString().trim().toLowerCase();
            if (_val.indexOf(searchText) > -1 && indexes.indexOf(index) === -1) {
              indexes.push(index);
            }
          });
        } catch (ex) {
          console.log(ex, key, searchText);
        }
      }
    });

    if (!doSearch) {
      return incomingArray;
    }

    indexes.forEach(re => {
      result.push(incomingArray[re]);
    });

    return result;
  }

  searchStringInArray(incomingArray: any[], queryObj: any, filtrationFields: string[] = []): any[] {
    const result: any[] = [];
    const indexes: number[] = [];
    let doSearch = false;


    Object.keys(queryObj).forEach(key => {
      const searchText = queryObj[key].toString().trim().toLowerCase();
      if (key && searchText) {
        doSearch = true;
        try {
          incomingArray.forEach((element, index) => {
            const _val = element[key].toString().trim().toLowerCase();
            if (_val.indexOf(searchText) > -1 && indexes.indexOf(index) === -1) {
              indexes.push(index);
            }
          });
        } catch (ex) {
          console.log(ex, key, searchText);
        }
      }
    });

    if (!doSearch) {
      return incomingArray;
    }

    indexes.forEach(re => {
      result.push(incomingArray[re]);
    });

    return result;
  }
}
