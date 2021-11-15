// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';

import { EditStudyModalComponent } from './components/edit-study-modal/edit-study-modal.component';
import { StudyListService, StudyService } from '../_services/study.service';
import { StudyState } from '../_models/study.model';
import { ConsentUploadModalComponent } from './components/consent-upload-modal/consent-upload-modal.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { CrudOperation } from '../../shared/utils/crud-operation.model';
import { PaymentUploadModalComponent } from './components/payment-upload-modal/payment-upload-modal.component';
import { ShiftReservationModalComponent } from './components/shift-reservation-modal/shift-reservation-modal.component';
let $: any = jQuery;
@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
})
export class StudyListComponent
  implements
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  public studyState: typeof StudyState = StudyState;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public studyListService: StudyListService,
    public studyService: StudyService
  ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.studyListService.fetch();
    this.grouping = this.studyListService.grouping;
    this.paginator = this.studyListService.paginator;
    this.sorting = this.studyListService.sorting;
    const sb = this.studyListService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      type: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }
    this.studyListService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.studyListService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.studyListService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.studyListService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditStudyModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) =>
      {
        this.studyListService.fetch();
        if (result.status === CrudOperation.SUCCESS) {
          $.notify({
            title: '<strong>Registro exitoso.</strong>',
            message: 'Se ha registrado correctamente el estudio'
          }, {
            type: 'success'
          }),
        () => { }
      }
      }).catch((res) => {});;
  }

  uploadConsent(idStudy: number) {
    const modalRef = this.modalService.open(ConsentUploadModalComponent, { size: 'xl',keyboard: false});
    modalRef.componentInstance.idStudy = idStudy;
    modalRef.result.then((result) =>
      {
        this.studyListService.fetch();
        if (result.status === CrudOperation.SUCCESS) {
          $.notify({
            title: '<strong>Registro exitoso.</strong>',
            message: 'Se ha registrado correctamente el consentimiento firmado'
          }, {
            type: 'success'
          }),
        () => { }
      }
      }).catch((res) => {});
  }

  uploadPaymentReceipt(idStudy: number) {
    const modalRef = this.modalService.open(PaymentUploadModalComponent, { size: 'xl',keyboard: false});
    modalRef.componentInstance.idStudy = idStudy;
    modalRef.result.then((result) =>
        this.studyListService.fetch()
        ,
        () => { }
      ).catch((res) => {});
  }
  
  showShiftReservation(idStudy: number) {
    const modalRef = this.modalService.open(ShiftReservationModalComponent, { size: 'xl',keyboard: false});
    modalRef.componentInstance.idStudy = idStudy;
    modalRef.result.then((result) =>
        this.studyListService.fetch()
        ,
        () => { }
      ).catch((res) => {});
  }

}
