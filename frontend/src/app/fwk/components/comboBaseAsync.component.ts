import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injectable, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select'
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ADto, FilterDTO, ItemDto } from '../models/base.model';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'combo-box-base-async',
  template: '<div>ComboBoxBaseAsyncComponent</div>'
})

@Injectable()
export abstract class ComboBoxBaseAsyncComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  public Items: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public searchFilterCtrl: FormControl = new FormControl();
  protected unsubscriber = new Subject<void>();

  @Input() selectedItem: string = undefined;
  @Output() selectedItemChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  @Input() emptyText = '';
  @Input() placeholder = '';
  @Input() isRequired: boolean = false;
  @Input() DisplayName = '';
  @Input() allowNullable: boolean = true;
  @Input() groupfield: string;
  @Input() IsDisabled = false;
  @Input() searchOnDemand = true;
  @Input() searchSince3Characters = false;
  @Input() zeroIsValidValue = false;
  @Input() notUseFormFieldControl = false;

  protected isLoaded = false;

  errorStateMatcher: ErrorStateMatcher;

  protected cdr: ChangeDetectorRef;
  isInizialazedDefaultItem: boolean = false;

  control: NgControl;

  onChange = (rating: any) => { };
  onTouched = () => { };
  onFocus() { };

  isLoading = false;
  protected innerValue: any = '';

  public data: any[];

  constructor(protected injector: Injector) {
    this.cdr = injector.get(ChangeDetectorRef);
  }

  ngAfterViewInit(): void {

    this.data = [];
    this.data.push(this.getNullItem());
    this.Items.next(this.data);
    if (!this.value) {
      this.value = this.innerValue = 0;
    }
    this.onFocus();

  }

  InitializeDefaultItem(): void {
  }

  InitializeNullItem(): void {
  }

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v == null)
      v = 0;

    if (v !== this.innerValue) {
      this.innerValue = v;
      if (v == 0)
        this.onChange(null);
      else
        this.onChange(v);
    }
  }

  protected GetFilter(): any {
    var f = {
      FilterText: this.searchFilterCtrl.value
    };
    return f;
  }

  public filterItems() {

    if (!this.data) {
      return;
    }
    // get the search keyword
    let search = this.searchFilterCtrl.value;
    if (!search) {
      this.Items.next(this.mapData(this.data.slice()));
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    var f = this.mapData(this.data.filter(e => e.Description.toLowerCase().indexOf(search) > -1));

    this.Items.next(f);
  }

  mapData(value: Array<any>): Array<any> {
    if (this.groupfield) {
      return this.transform(value, this.groupfield);
    }
    return value;
  }

  writeValue(value: any): void {
    var self = this;
    if (value != this.innerValue) {
      this.innerValue = value;

      if (!this.isInizialazedDefaultItem) {
        if (value == null || value == '') {
          this.InitializeNullItem();
        }
        else {
          this.InitializeDefaultItem();
        }

        this.isInizialazedDefaultItem = true;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

    this.IsDisabled = isDisabled;
  }

  getNullItem() {
    const item = new ItemDto();
    item.Id = 0;
    item.Description = this.emptyText;
    return item;
  }

  ngOnInit(): void {
    try {
      this.control = this.injector.get(NgControl);
      this.errorStateMatcher = new InstantErrorStateMatcher(this.control);
    }
    catch { }

    this.Items.next([]);

    setTimeout(() => this.onSearch(), 0);

    let selft = this;

    this.searchFilterCtrl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.unsubscriber)
      )
      .subscribe(() => {

        if (this.searchSince3Characters) {
          if (this.searchFilterCtrl.value.length > 2) {
            setTimeout(() => this.getItems(), 0);
          } else if (!selft.innerValue) {
            this.onSearch();
          }
        } else {
          this.filterItems();
        }
      });
  }

  onSearch(): void {

  }

  getItems(): void {
    if (this.data) {
      this.Items.next(this.data.slice())
    }
    else {
      this.Items.next([]);
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  transform(value: Array<any>, field: string): Array<any> {

    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }

  protected detectChanges(): void {
    try {
      if (this.cdr) {
        this.cdr.detectChanges();
      }
    } catch (e) {

    }
  }
}

@Component({
  selector: 'combo-box-async',
  template: '<div>ComboBoxAsync</div>',
})
export abstract class ComboBoxAsync<T extends ADto> extends ComboBoxBaseAsyncComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  isLoading = false;

  constructor(
    protected service: CrudService<T>,
    protected injector: Injector) {
    super(injector);
  }

  IsValidValue(value: any) {
    return this.value || (this.zeroIsValidValue && this.value == 0);
  }

  InitializeNullItem(): void {
    var result = [];
    result.push(this.getNullItem());
    this.Items.next(result);
    this.data = result;
    this.isLoading = false;
    this.detectChanges();
  }

  InitializeDefaultItem(): void {
    if (this.searchOnDemand && this.IsValidValue(this.value)) {
      var self = this;
      this.isLoading = true;

      var f = new FilterDTO();
      f.Id = this.value;

      this.service.getItems(f).pipe(takeUntil(this.unsubscriber)).subscribe(result => {

        this.Items.next(result);
        this.data = result;
        self.isLoading = false;

        this.detectChanges();
      });
    }
  }

  onSearch(): void {
    if (!this.searchOnDemand) {
      this.getItems();
    }
    else {

      this.Items.next([]);
      this.data = [];
      this.data.push(this.getNullItem());
    }
  }

  onFocus() {

    setTimeout(() => { this.searchOnOpen(); }, 500);
  }

  searchOnOpen() {
    if (this.searchOnDemand && !this.searchSince3Characters && !this.isLoaded) {
      this.getItems();
    }
  }

  getItems(): void {
    var self = this;
    this.isLoading = true;
    this.service.getItems(this.GetFilter()).pipe(takeUntil(this.unsubscriber)).subscribe(result => {
      if (this.allowNullable) {
        result.unshift(this.getNullItem());
      }
      this.Items.next(result);
      this.data = result;
      self.isLoading = false;

      this.isLoaded = true;

      this.detectChanges();
    });
  }
}

export class InstantErrorStateMatcher implements ErrorStateMatcher {

  private innerControl: NgControl;

  constructor(innerControl: NgControl) {
    this.innerControl = innerControl;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.innerControl && this.innerControl.invalid && (this.innerControl.dirty || this.innerControl.touched);
  }
}
