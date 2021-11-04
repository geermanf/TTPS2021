import { DataSource } from "@angular/cdk/collections";
import { Observable, Subject, BehaviorSubject, combineLatest } from "rxjs";
import { switchMap, startWith, pluck, share } from "rxjs/operators";
import { indicate } from "./operators";
import { Page, Sort, PageRequest, PaginatedEndpoint } from "./page";

export interface SimpleDataSource<T> extends DataSource<T> {
  connect(): Observable<T[]>;
  disconnect(): void;
}

export interface PaginatedDataSource<T> extends SimpleDataSource<T> {
  sortBy: (s: Sort<T>) => void;
  fetch: (p: number) => void;
  page$: Observable<Page<T>>
  loading$: Observable<boolean>;
}

export function paginatedDataSource<T>(
  endpoint: PaginatedEndpoint<T>,
  initialSort: Sort<T>,
  pageSize = 20
): PaginatedDataSource<T> {
  const pageNumber = new Subject<number>();
  const loading = new Subject<boolean>();

  const sort = new BehaviorSubject<Sort<T>>(initialSort);
  const param$ = combineLatest([sort]);
  const page$ = param$.pipe(
    switchMap(([sort]) => pageNumber.pipe(
        startWith(0),
        switchMap(page => endpoint({ page, sort, size: pageSize })     .pipe(indicate(loading))
        )
      )
    ),
    share()
  );
  const fetch = (p: number) => pageNumber.next(p);
  const sortBy = (s: Sort<T>) => sort.next(s);
  return {
    sortBy,
    fetch,
    page$,
    connect: () => page$.pipe(pluck("content")),
    disconnect: () => undefined,
    loading$: loading.asObservable(),
  };
}
