// Angular
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

import { NotifyService } from '../../../../fwk';
import { AuthService } from 'src/app/modules/auth';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {

  private notShowError: boolean;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;


  constructor(private router: Router)
  {

  }

  // intercept request and add token
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // tslint:disable-next-line:no-debugger
    // modify request

    this.notShowError = false;
    const authData = JSON.parse(
      localStorage.getItem(this.authLocalStorageToken)
    );
    // let authData = this.authService.getAuthFromLocalStorage()

    if (authData) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authData?.access_token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {

          }
        },
        error => {
          if (error.status === 401 || error.status == 403) {
            this.router.navigateByUrl('/authentication/login');
            this.notShowError = true;
          }
          let errorWasShown = false;
          let erroObjet: any;
          if (error.status == 400) {
            if (erroObjet) {
              for (let i in erroObjet.errors) {
                console.log(i, erroObjet.errors[i].join(','));
                // this.notifyService.toastError(erroObjet.errors[i].join(', '), erroObjet.message ?? "Error");
                errorWasShown = true;
              }
            }
          }
          if (!errorWasShown && !this.notShowError) {
            // this.notifyService.toastError("A ocurrido un error, comuniquese con el administrador.", "Error");
          }

          if (erroObjet && erroObjet.DeveloperMessage) {
            console.log('erroObjet', erroObjet);
            console.log('DeveloperMessage', erroObjet.DeveloperMessage);
          }
        }
      )
    );
  }
}
