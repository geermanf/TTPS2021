import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injectable, Injector, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BaseAppComponent } from '../../../fwk/components/base.app.component';
import { ADto, FilterDTO, ViewMode } from '../../../fwk/models/base.model';
import { CrudService } from '../../../fwk/services/crud.service';
import { LoaderConfigProvider } from '../../_base/detail/loader-config-provider';



@Component({
  selector: 'detail-component',
  template: '<div></div>'
})
export abstract class DetailComponent<T extends ADto> extends BaseAppComponent implements IDetailComponent, OnInit, OnDestroy, AfterViewInit {

  CreateLoader() {
		this.loaderConfig = LoaderConfigProvider.getLoaderConfig();
	}

  viewMode: ViewMode = ViewMode.Undefined;
  presetViewMode: ViewMode = ViewMode.Undefined;

  viewModes = ViewMode;

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  viewLoading = false;
  loadingAfterSubmit = false;
  loaderConfig: NgxUiLoaderConfig;
  loadingOnInit = true;
  takeRouteParams = true;
  generateBreadcrumbs = true;
  showDtoEmitEvent = false;

  @ViewChild('detailForm', { static: false }) detailForm: NgForm;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterSaveEvent: EventEmitter<T> = new EventEmitter<T>();
  icon: string;
  title: string;
  page: string;
  moduleAction: string;
  moduleName: string

  public id;
  public step;
  filter: FilterDTO = new FilterDTO();
  public isTableLoading = false;
  advancedFiltersAreShown = false;
  public detail: T;
  active = false;
  closeOnSave = false;
  protected element: ElementRef;

  //protected subheaderService: SubheaderService;
  protected detailFB: FormBuilder;
  mainForm: FormGroup;
  protected router: Router;
  protected route: ActivatedRoute;
  ngxService: NgxUiLoaderService;
  protected cdr: ChangeDetectorRef;
  public unsubscriber = new Subject();
  public saveId: boolean = false;
  public idSaved: any;

  constructor(
    protected service: CrudService<T>,
    injector: Injector,
    //protected store: Store<AppState>,
    viewMode: ViewMode = null
  ) {
    super(injector);

    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);

    this.CreateLoader();

    this.element = injector.get(ElementRef);

    //this.subheaderService = injector.get(SubheaderService);
    this.detail = {} as T;
    this.detailFB = injector.get(FormBuilder);

    if (viewMode)
      this.viewMode = viewMode;

    this.createForm();

    this.ngxService = injector.get(NgxUiLoaderService);
    this.loading$ = this.loadingSubject.asObservable();
    this.cdr = injector.get(ChangeDetectorRef);

    this.presetViewMode = viewMode;
  }

  getSelector(): string {
    return this.element.nativeElement.tagName;
  }

  validateSave(): boolean {
    return true;
  }

  abstract getNewItem(): T;

  ngOnInit() {
    this.viewLoading = true;

    this.modalClose.pipe(takeUntil(this.unsubscriber)).subscribe(e => {
      this.goBack();
    })

    if (this.loadingOnInit) {
      this.setLoading(true);
    }

    this.route.queryParams.pipe(takeUntil(this.unsubscriber)).subscribe(params => {
      this.proccesParam(params);
    });
  }

  proccesParam(params: Params): void {
    let id;

    if(this.takeRouteParams) {
      if (params.step) {
        this.step = params.step;
      }
      if(params.id && this.isGuid(params.id)) {
        id = params.id;
      }
      else {
        id = + params.id;
      }
    }
    else {
      id = this.id;
    }

    if (id) {
      if (this.presetViewMode) {
        this.viewMode = this.presetViewMode;
      } else {
        this.viewMode = +params.viewMode ? +params.viewMode : ViewMode.Modify;
      }
      this.show(id);
    } else {
      this.showNew(this.getNewItem());
      this.initModel();
    }
  }

  initModel() {
    this.setLoading(false);

    if (this.generateBreadcrumbs)
      this.intBreadcrumbs();

    this.loadingAfterSubmit = false;
    this.viewLoading = false;
    this.detectChanges();
  }

  intBreadcrumbs() {
    //const last = this.subheaderService.breadCrumbsSubject.value[this.subheaderService.breadCrumbsSubject.value.length - 1];

    //if (!this.detail.Id) {
    //  this.subheaderService.setTitle('Nuevo ' + this.title);
    //  let bread = this.subheaderService.breadCrumbsSubject.value;
    //  let b = new BreadcrumbItemModel();
    //  b.title = 'Nuevo ' + this.title;
    //  bread.push(b);
    //  return;
    //}

    //if (this.viewMode === ViewMode.View) {
    //  this.subheaderService.setTitle('Ver ' + this.title);
    //  let bread = this.subheaderService.breadCrumbsSubject.value;
    //  let b = new BreadcrumbItemModel();
    //  b.title = 'Ver ' + this.title;
    //  bread.push(b);
    //  this.subheaderService.setBreadcrumbs(bread);
    //  return;
    //}

    //this.subheaderService.setTitle('Editar ' + this.title);
    //let bread = this.subheaderService.breadCrumbsSubject.value;
    //let b = new BreadcrumbItemModel();
    //b.title = 'Editar ' + this.title;
    //bread.push(b);
    //this.subheaderService.setBreadcrumbs(bread);
  }

  createChildForm(detail: T) { }

  createForm() {
    //this.mainForm = this.detailFB.group({
    //	Name: [this.detail.Name, Validators.required],
    //	mileage: [this.detail.mileage, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    //	description: [this.detail.description],
    //	condition: [this.detail.condition.toString(), [Validators.required, Validators.min(0), Validators.max(1)]],
    //});
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected saving(_saving: boolean): void {
    //if (_saving) {
    //  this.loaderConfig.text = "Guardando...";
    //}
    //else {
    //  this.loaderConfig.text = "Cargando...";
    //}

    this.setLoading(_saving);
  }

  protected setLoading(value: boolean): void {
    let loaderID = 'loaderdetail';
    if (this.loaderConfig) {
      loaderID = this.loaderConfig.masterLoaderId;
    }

    if (value) {
      this.ngxService.startLoader(loaderID);
    }
    else {
      this.ngxService.stopLoader(loaderID);
    }

    this.loadingSubject.next(value);

    try {
      this.cdr.detectChanges();
    } catch { }
  }

  allowSave(): boolean {
    if (this.viewMode === ViewMode.Add || this.viewMode === ViewMode.Modify) {
      return true;
    } else {
      return false;
    }
  }

  allowSaveAndContinue(): boolean {
    if (this.viewMode === ViewMode.Add || this.viewMode === ViewMode.Modify) {
      return true;
    } else {
      return false;
    }
  }

  allowCancel(): boolean {
    if (this.viewMode === ViewMode.Add || this.viewMode === ViewMode.Modify) {
      return true;
    } else {
      return false;
    }
  }

  allowReturn(): boolean {
    if (this.viewMode === ViewMode.View) {
      return true;
    } else {
      return false;
    }
  }

  allowUpdateExtraData(): boolean {
    if (this.viewMode === ViewMode.Modify) {
      return true;
    } else {
      return false;
    }
  }

  showExtraData(): boolean {
    if (this.viewMode === ViewMode.View || this.viewMode === ViewMode.Modify) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewChecked() {
    try {
      this.cdr.detectChanges();
    }
    catch { }
  }

  onSave(): void {
    this.closeOnSave = true;
    this.save();
  }

  markAsTouched(controls) {
    Object.keys(controls).forEach(controlName => {
      if (controls[controlName] && controls[controlName].controls && controls[controlName].controls.length > 0) {

        const childControls = controls[controlName].controls;
        childControls.forEach(e => {
            if(e.controls) {
              this.markAsTouched(e.controls);
            }
          }
        );

      }
      controls[controlName].markAsTouched()
    });
  }

  save(): void {


    if (this.detailForm && this.detailForm.form.invalid) {
      return;
    }

    if (this.mainForm) {

      if (this.mainForm.invalid) {
        const controls = this.mainForm.controls;
        this.markAsTouched(controls);

        this.notify.alertWarn('Existen campos inválidos.');

        return;
      }
      _.assign(this.detail, this.mainForm.getRawValue());
    }

    this.saving(true);

    this.completedataBeforeSave(this.detail);

    if (!this.validateSave()) {
      this.saving(false);
      return;
    }

    let response;

    response = this.runSaveAction();

    response.pipe(
      finalize(() => this.saving(false)),
      takeUntil(this.unsubscriber)
    )
      .subscribe((t) => {

        if (this.viewMode === ViewMode.Add && !this.saveId) {
          this.navigateAfterSave(t);
        }
        if (this.viewMode === ViewMode.Add && this.saveId)
          this.idSaved = t.Id;

        this.notify.toastSuccess('Guardado exitosamente');

        if (this.closeOnSave) {
          this.close();
        } else {
          this.viewMode = ViewMode.Modify;
        }

        this.afterSave(this.detail);
        this.closeOnSave = true;
        this.modalSave.emit(null);
      });
  }

  navigateAfterSave(t: any) {
    let url = this.router.url.replace('add', 'edit?id=' + t.Id.toString());

    this.router.navigateByUrl(url);
  }

  runSaveAction() {
    let response;
    if (this.viewMode === ViewMode.Add) {
      response = this.service.add(this.detail);
    }
    if (this.viewMode === ViewMode.Modify) {
      response = this.service.update(this.detail);
    }
    return response;
  }

  onSaveAndContinue(): void {
    this.closeOnSave = false;
    this.save();
  }

  onShown(): void {
    // $(this.nameInput.nativeElement).focus();
  }

  afterSave(detail: T): void {
    if (!this.closeOnSave) {
      this.active = false;
    }

    this.afterSaveEvent.emit(detail);
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(e => e.unsubscribe());

    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  show(id) {
    this.service.get(id).pipe(takeUntil(this.unsubscriber)).subscribe(result => {
      this.showDto(result);
      this.initModel();
    });
  }

  showNew(item: T) {
    if (this.detailForm) {
      this.detailForm.resetForm();
    }

    this.viewMode = ViewMode.Add;
    this.showDto(item)
  }

  showDto(item: T) {
    this.detail = item;

    this.createChildForm(item);
    this.completedataBeforeShow(item)

    if (this.mainForm)
      this.mainForm.patchValue(this.detail, { emitEvent: this.showDtoEmitEvent });

    this.active = true;
  }

  getDescription(item: T): string {

    if (item && item["Description"]) {
      return item["Description"];
    }
    return "";
  }

  completedataBeforeShow(item: T): any {
    if (this.viewMode === ViewMode.View) {
      (<any>Object).values(this.mainForm.controls).forEach(control => {
        control.disable();
      });
    }
  }

  completedataBeforeSave(item: T): any { }

  close(): void {
    this.active = false;
    this.viewMode = ViewMode.Undefined;
    this.modalClose.emit(true);
  }

  detectChanges(): void {
    try {
      this.cdr.detectChanges();
    } catch { }
  }

  subscriptions: Subscription[] = [];

  attachToDialogRefEvents(dialogRef) {

    //this.subscriptions.push(this.store.select(isLoggedOut).pipe(takeUntil(this.unsubscriber)).subscribe(
    //  (e) => {
    //    if (e) this.modalClose.emit(true);
    //  })
    //);

    this.subscriptions.push(dialogRef.componentInstance.afterSaveEvent
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        dialogRef.close();
      })
    );

    this.subscriptions.push(dialogRef.componentInstance.modalClose.pipe(takeUntil(this.unsubscriber)).subscribe(e => dialogRef.close()));

    this.subscriptions.push(dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        dialogRef._containerInstance.dispose();
        dialogRef._containerInstance.detach();
      })
    );

    let loading = true;

    //this.subscriptions.push(this.store.select(warningError).pipe(takeUntil(this.unsubscriber)).subscribe(
    //  () => {
    //    if (loading) {
    //      loading = false;
    //    } else {
    //      dialogRef.close();
    //    }
    //  })
    //);
  }

  //Use to validate if string is a Guid/Uiid
  isGuid(stringToTest) {
    if (stringToTest[0] === "{") {
        stringToTest = stringToTest.substring(1, stringToTest.length - 1);
    }
    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    return regexGuid.test(stringToTest);
  }

}

export interface IDetailComponent {
  //save();
  modalSave: EventEmitter<any>;
  modalClose: EventEmitter<any>;
  viewMode: ViewMode;
  show(id);
  showNew(item);
  active: boolean;
  close();
}
