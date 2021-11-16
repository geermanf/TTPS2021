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
import { TypeStudyService } from '../_service/type-study.service';
import { EditTemplateModalComponent } from './component/edit-template-modal.component';
let $: any = jQuery;
@Component({
  selector: 'app-type-study-list',
  templateUrl: './type-study-list.component.html',
})
export class TypeStudyListComponent
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
    constructor(
    private fb: FormBuilder,
    public typeStudyService: TypeStudyService,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.typeStudyService.fetch();
    this.grouping = this.typeStudyService.grouping;
    this.paginator = this.typeStudyService.paginator;
    this.sorting = this.typeStudyService.sorting;
    const sb = this.typeStudyService.isLoading$.subscribe(res => this.isLoading = res);
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
    this.typeStudyService.patchState({ filter });
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
    this.typeStudyService.patchState({ searchTerm });
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
    this.typeStudyService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.typeStudyService.patchState({ paginator });
  }

  edit(typeStudyId: number, template:string) {
    
    const modalRef = this.modalService.open(EditTemplateModalComponent, { size: 'xl' });
    modalRef.componentInstance.typeStudyId = typeStudyId;
    modalRef.componentInstance.template = template;
    modalRef.result.then((result) =>
      {
        this.typeStudyService.fetch();
        if (result.status === CrudOperation.SUCCESS) {
          $.notify({
            title: '<strong>Registro exitoso.</strong>',
            message: 'Se ha modificado correctamente el template del consentimiento'
          }, {
            type: 'success'
          }),
        () => { }
      }
      }).catch((res) => {});
  }

}
