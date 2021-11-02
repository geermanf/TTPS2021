import { ComponentFactoryResolver, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild, ChangeDetectorRef, Injectable, AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of, Subject, Subscription } from 'rxjs';
import { catchError, finalize, takeUntil, tap, filter } from 'rxjs/operators';
import { DetailComponent, IDetailComponent } from './detail-view/detail.component';
import { ADto, FilterDTO, ViewMode } from '../models/base.model';
import { CrudService } from '../services/crud.service';
import { warningError } from '../services/globalerror.service';
import { BaseAppComponent } from './base.app.component';
import * as _ from 'lodash';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SubheaderService } from '../../_metronic/partials/layout';
import { BaseDataSource, QueryParamsModel, QueryResultsModel } from '../_base/crud';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export class CrudDataSource extends BaseDataSource {
  constructor() {
    super();
  }
}

@Component({
  selector: 'base-crud-component',
  template: '<div></div>'
})
export abstract class BaseCrudComponent<T extends ADto, F extends FilterDTO> extends BaseAppComponent implements ICRUDComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() searchOnInit = true;

  protected cfr: ComponentFactoryResolver;
  protected cdr: ChangeDetectorRef;
  public filter: F;
  filterForm: FormGroup;
  protected detailFB: FormBuilder;
  list: T[] = [];

  title: string;

  allowAdd = false;
  allowDelete = false;
  allowModify = false;
  allowActive = false;
  allowDesactive = false;

  active = true;

  protected detailElement: IDetailComponent;
  protected parentDetailComponent: boolean;

  dataSource: CrudDataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  subheaderService: SubheaderService;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  protected unsubscriber = new Subject();
  protected router: Router;
  protected route: ActivatedRoute;
  protected http: HttpClient;

  constructor(
    protected service: CrudService<T>,
    injector: Injector
  )
  {
    super(injector);

    this.cfr = injector.get(ComponentFactoryResolver);
    this.subheaderService = injector.get(SubheaderService);
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.cdr = injector.get(ChangeDetectorRef);
    this.http = injector.get(HttpClient);

    this.detailFB = injector.get(FormBuilder);
    this.filter = {} as F;

    this.createFilterForm();

    try {
      this.parentDetailComponent = injector["view"].context instanceof DetailComponent;
    } catch { }
  }
  ngAfterViewInit(): void {

      if (this.searchOnInit) {
        setTimeout(() => this.onSearch(), 0);
      }
  }

  SetAllowPermission() {
    if (this.route.snapshot && this.route.snapshot.data && this.route.snapshot.data.permissions && this.route.snapshot.data.permissions["only"]) {
      if (this.route.snapshot.data.permissions["only"][0]) {
        const b = this.route.snapshot.data.permissions["only"][0].split(".");
        const key = b[0] + '.' + b[1] + '.' + b[2];

        this.permissionsService.hasPermission(key + '.Add').then(r => this.allowAdd = r);
        this.permissionsService.hasPermission(key + '.Update').then(r => this.allowModify = r);
        this.permissionsService.hasPermission(key + '.Delete').then(r => this.allowDelete = r);
        this.permissionsService.hasPermission(key + '.Activate').then(r => this.allowActive = r);
        this.permissionsService.hasPermission(key + '.Desactivate').then(r => this.allowDesactive = r);
      }
    }
  }

  createFilterForm(): void {
    //Example
    //this.filterForm = this.detailFB.group({
    //	filter1: [this.filter.filter1, Validators.required],
    //	filter2: [this.filter.filter2, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    //	filter3: [this.filter.filte3.description],
    //	filter4: [this.filter.filter4.condition.toString(), [Validators.required, Validators.min(0), Validators.max(1)]],
    //});
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }

  ngOnInit() {
    this.SetAllowPermission();

    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = this.getRangeLabel;

      // If the user changes the sort order, reset back to the first page.
      this.sort.sortChange.pipe(takeUntil(this.unsubscriber)).subscribe(() => (this.paginator.pageIndex = 0));

      /* Data load will be triggered in two cases:
      - when a pagination event occurs => this.paginator.page
      - when a sort event occurs => this.sort.sortChange
      **/
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => {
            this.onSearch();
          }),
          takeUntil(this.unsubscriber)
        )
        .subscribe();
    }

    // Set title to page breadCrumbs
    if (!this.parentDetailComponent)
      this.subheaderService.setTitle(this.title);

    // Init DataSource
    this.dataSource = new CrudDataSource();
    this.dataSource.entitySubject.pipe(takeUntil(this.unsubscriber)).subscribe(res => this.list = res);


  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(e => e.unsubscribe());
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  onView(row) {
    this.active = false;
    this.router.navigate(['./view'], { queryParams: { id: row.Id, viewMode: ViewMode.View }, relativeTo: this.route });
  }

  onEdit(row: T) {
    this.onEditID(row.Id);
  }

  onEditID(id) {
    if (!this.allowModify) {
      return;
    }
    this.active = false;
    this.router.navigate(['./edit'], { queryParams: { id: id }, relativeTo: this.route });
  }

  onCreate() {
    if (!this.allowAdd) {
      return;
    }

    this.router.navigate(['./add'], { relativeTo: this.route });
  }

  completedataBeforeSave(item: F): any { }

  onDelete(item: T) {
    if (!this.allowDelete) {
      return;
    }

    this.notify.alertConfirm('¿Está seguro de que desea eliminar el registro?', 'Confirmación', (a) => {
      if (a.value) {
        this.service.delete(item.Id)
          .pipe(takeUntil(this.unsubscriber))
          .subscribe(() => {
            this.onSearch();
            this.notify.toastSuccess('Registro eliminado correctamente');
          });
      }
    });
  }

  markAsTouched(controls) {
    Object.keys(controls).forEach(controlName => {
      if (controls[controlName] && controls[controlName].controls && controls[controlName].controls.length > 0) {

        const childControls = controls[controlName].controls;
        childControls.forEach(e => {
          if (e.controls) {
            this.markAsTouched(e.controls);
          }
        }
        );

      }
      controls[controlName].markAsTouched()
    });
  }

  onSearch() {
    if (this.filterForm) {

      if (this.filterForm.invalid) {
        const controls = this.filterForm.controls;
        this.markAsTouched(controls);

        this.notify.alertWarn('Existen campos inválidos.');

        return;
      }
      _.assign(this.filter, this.filterForm.value);

      this.completedataBeforeSave(this.filter);
    }

    if (this.paginator) {
      const queryParams = new QueryParamsModel(
        this.filterConfiguration(),
        this.sort?.direction,
        this.sort?.active,
        this.paginator?.pageIndex,
        this.paginator?.pageSize
      );
      this.Search(queryParams);
    }
    else {
      const queryParams = new QueryParamsModel(
        this.filterConfiguration(),
        this.sort?.direction,
        this.sort?.active
      );
      this.Search(queryParams);
    }
  }

  Search(queryParams: QueryParamsModel) {

    this.filter.PageSize = this.paginator?.pageSize || 10;
    this.filter.Page = this.paginator?.pageIndex + 1 || 1;

    this.manageSorting(queryParams);

    this.dataSource.loadingSubject.next(true);
    this.service.lastFilter$.next(queryParams);

    this.service.list(this.filter).pipe(
      tap(res => {
        this.dataSource.entitySubject.next(res.Items);
        this.dataSource.paginatorTotalSubject.next(res.TotalCount);
      }),
      catchError(err => of(new QueryResultsModel([], err))),
      finalize(() => this.dataSource.loadingSubject.next(false)),
      takeUntil(this.unsubscriber)
    ).subscribe();
  }

  manageSorting(queryParams: QueryParamsModel) {
    if (queryParams.sortField) {
      this.filter.Sort = queryParams.sortField + ' ' + queryParams.sortOrder;
    }
  }

  filterConfiguration() {
    return {};
  }

  getNewfilter(): F {
    const a: any = {};
    return a;
  }

  onClearFilter() {
    this.filterForm.reset();
    this.filter = this.getNewfilter();
    this.createFilterForm();
    this.onSearch();
  }

  subscriptions: Subscription[] = [];

  closeDialogRef(dialogRef: MatDialog) {
    dialogRef.closeAll();
  }

  attachToDialogRefEvents(dialogRef) {

    this.subscriptions.push(dialogRef.componentInstance.afterSaveEvent
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        dialogRef.close();
        this.onSearch();
      })
    );

    this.subscriptions.push(dialogRef.componentInstance.modalClose
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => dialogRef.close()));

    this.subscriptions.push(dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        dialogRef._containerInstance.dispose();
        dialogRef._containerInstance.detach();
      })
    );

    let loading = true;
  }


  /// permite obtener el file name desde el backend
  /// desde el Service se invoca con estas opciones http.get(url, { observe: 'response', responseType: 'blob' as 'json' });
  ///desde backend hay que enviar un header con la informacion en la key x-file-name y exponerla
  /// Ej net core:
  /// Response.Headers.Add("x-file-name", archivo.jpg);
  /// Response.Headers.Add("Access-Control-Expose-Headers", "x-file-name");
  downloadResponse(response: HttpResponse<any>, filename = response.headers.get('x-file-name')) {
    this.downloadBlob(response.body, filename);
  }

  downloadBlob(blob: any, filename: string) {
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  onDownloadPdf() {
    this.dataSource.loadingSubject.next(true);
    this.service.downloadPdf(this.filter).pipe(
      finalize(() => this.dataSource.loadingSubject.next(false)),
      takeUntil(this.unsubscriber)
    ).subscribe(blob => {
      this.downloadBlob(blob, this.title + "_" + this.getDateStringFormat() + ".pdf");
    });
  }

  onDownloadExcel() {
    this.dataSource.loadingSubject.next(true);
    this.service.downloadExcel(this.filter).pipe(
      finalize(() => this.dataSource.loadingSubject.next(false)),
      takeUntil(this.unsubscriber)
    ).subscribe(blob => {
      this.downloadBlob(blob, this.title + "_" + this.getDateStringFormat() + ".xlsx");
    });
  }

  private getDateStringFormat() {
    let dateTime = new Date();
    return dateTime.getDate().toString() + (dateTime.getMonth() + 1).toString() + dateTime.getFullYear().toString();
  }

}

export abstract class CrudComponent<T extends ADto> extends BaseCrudComponent<T, FilterDTO>
{
  constructor(protected service: CrudService<T>, injector: Injector) {
    super(service, injector);
  }

  getNewfilter(): FilterDTO {
    return new FilterDTO();
  }
}

export interface ICRUDComponent {
  onView(row);
  onCreate(row);
  onEdit(row);
  onDelete(row);
  onSearch();
}
