import { Component, Injector } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'base-app-component',
  template: '<div></div>'
})
export abstract class BaseAppComponent {

  //localization: LocalizationService;
  permissionsService: NgxPermissionsService
  notify: NotifyService;

  constructor(injector: Injector, ) {
    //this.localization = injector.get(LocalizationService);
    this.permissionsService = injector.get(NgxPermissionsService);
    this.notify = injector.get(NotifyService);
  }


  s(key: string): string {
    return "";
  }
}
