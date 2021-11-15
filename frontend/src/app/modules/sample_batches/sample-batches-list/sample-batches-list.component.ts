import { SampleBatchesService } from '../_service/sample-batches.service';
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
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';

import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { CrudOperation } from '../../shared/utils/crud-operation.model';
import { SampleBatchesState } from '../_model/sample-batches.model';
import { SampleBatchesModalProcessComponent } from './component/sample-batches-process-modal/sample-batches-process-modal';
let $: any = jQuery;
@Component({
  selector: 'app-sample-batches-list',
  templateUrl: './sample-batches-list.component.html',
})
export class SampleBatchesListComponent
  implements
  OnInit,
  OnDestroy,
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
  public sampleBatchesState: typeof SampleBatchesState = SampleBatchesState;
  constructor(
    private fb: FormBuilder,
    public sampleBatchesService: SampleBatchesService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.sampleBatchesService.fetch();
    this.grouping = this.sampleBatchesService.grouping;
    this.paginator = this.sampleBatchesService.paginator;
    this.sorting = this.sampleBatchesService.sorting;
    const sb = this.sampleBatchesService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.sampleBatchesService.patchState({ filter });
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
    this.sampleBatchesService.patchState({ searchTerm });
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
    this.sampleBatchesService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.sampleBatchesService.patchState({ paginator });
  }

  process(batchesId: number) {
    
    const modalRef = this.modalService.open(SampleBatchesModalProcessComponent, { size: 'xl' });
    modalRef.componentInstance.batched_number = batchesId;
    modalRef.result.then((result) =>
      {
        this.sampleBatchesService.fetch();
        if (result.status === CrudOperation.SUCCESS) {
          $.notify({
            title: '<strong>Registro exitoso.</strong>',
            message: 'Se ha proceso correctamente el lote'
          }, {
            type: 'success'
          }),
        () => { }
      }
      }).catch((res) => {});
  }

}
