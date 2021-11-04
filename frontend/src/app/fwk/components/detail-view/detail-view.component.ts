// Angular
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
// Loading bar
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
// RxJS
import { Observable, Subscription } from 'rxjs';
import { LoaderConfigProvider } from '../../_base/detail/loader-config-provider';

@Component({
	selector: 'detail-view',
	templateUrl: './detail-view.component.html',
	exportAs: 'detailView',
	styleUrls: ["./detail-view.component.css"]
})
export class DetailViewComponent implements OnInit, AfterViewInit, OnDestroy {

	// Public properties
	@Input() extraButtons: TemplateRef<any>;
	@Input() extraDropdownButtons: TemplateRef<any>;
	@Input() loading$: Observable<boolean>;
	@Input() class: string;
	@Input() loaderText: string;
	@Input() headerText: string;
	@Input() detail;
	@Input() allowSave = true;
	@Input() allowSaveAndContinue = true;
	@Input() allowCancel = false;
	@Input() allowReturn = true;
	@Input() isPopup = false;
	@Input() isModal = false;
	@Input() customReturn = false;
	@Input() saveButtonText: string;
	@Input() allowUpdateExtraData = true;
	@Input() showExtraData = true;

	@Output() public save: EventEmitter<MouseEvent> = new EventEmitter();
	@Output() public close: EventEmitter<MouseEvent> = new EventEmitter();
	@Output() public customReturnEvent: EventEmitter<MouseEvent> = new EventEmitter();

	@Output() public saveAndContinue: EventEmitter<MouseEvent> = new EventEmitter();

	private subs: Subscription[] = [];

	@Input() loaderConfig: NgxUiLoaderConfig = this.CreateLoader();

	CreateLoader(): NgxUiLoaderConfig {
		return LoaderConfigProvider.getLoaderConfig();
	}

  constructor(private el: ElementRef, private ngxService: NgxUiLoaderService) {
    
	}

	ngOnInit() {
		if (this.isPopup) {
			//this.class = (this.class || '') + " width80"
		}

		if (!this.saveButtonText) {
			this.saveButtonText = "Guardar";
		}
	}

	ngAfterViewInit() {
		if (this.loading$) {
			this.subs.push(this.loading$.subscribe(e => this.showHideLoader(e)));
		}
	}

	showHideLoader(show: boolean): void {
		if (show) {
			this.ngxService.startLoader(this.loaderConfig.masterLoaderId)
		}
		else {
			this.ngxService.stopLoader(this.loaderConfig.masterLoaderId)
		}
	}

	onSave() {
		this.save.emit();
	}

	onClose() {
		this.close.emit();
	}

	executeCustomReturn() {
		this.customReturnEvent.emit();
	}

	onSaveAndContinue() {
		this.saveAndContinue.emit();
	}

	ngOnDestroy(): void {
		this.subs.forEach(e => e.unsubscribe());
	}
}
