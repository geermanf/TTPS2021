import { Injectable } from '@angular/core';
import * as toastr from "toastr";
import swal from 'sweetalert2';

@Injectable()
export class NotifyService {

  toastInfo(message: string, title?: string, options?: any): void {
    toastr.info(message, title, options)
  }

  toastSuccess(message: string, title?: string, options?: any): void {
    toastr.success(message, title, options);
  }

  toastWarn(message: string, title?: string, options?: any): void {
    toastr.warning(message, title, options);
  }

  toastError(message: string, title?: string, options?: any): void {
    toastr.error(message, title, options);
  }

  alertInfo(message: string, title?: string) {
    return swal.fire({
      title: title,
      text: message,
      icon: 'info',
    })
  }

  alertSuccess(message: string, title?: string) {
    return swal.fire({
      title: title,
      text: message,
      icon: 'success'
    })
  }

  alertWarn(message: string, title?: string) {
    return swal.fire({
      title: title,
      text: message,
      icon: 'warning'
    })
  }

  alertError(message: string, title?: string) {
    return swal.fire({
      title: title,
      text: message,
      icon: 'error'
    })
  }

  alertInputText(message: string, title?: string, placeholder?: string, callback?: (result: any) => void) {
    return swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      input: 'text',
      inputPlaceholder: placeholder,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe completar el campo'
        }
      }
    }).then(function (isConfirmed) {
      callback && callback(isConfirmed);
    });
  }

  alertConfirm(message: string, title?: string, callback?: (result: any) => void) {
    this.alertConfirmCustomButtons(message, 'Aceptar', 'Cancelar', title, callback);
  }

  alertConfirmOK(message: string, title?: string, callback?: (result: any) => void) {
    this.alertConfirmOkButtons(message, 'Aceptar', title, callback);
  }


  alertConfirmCustomButtons(message: string, _confirmButtonText: string, _cancelButtonText: string, title?: string, callback?: (result: any) => void) {

    return swal.fire(
      {
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-save sweet-icon-save"></i>' + _confirmButtonText,
        cancelButtonText: '<i class="fa fa-times sweet-icon-cancel"></i>' + _cancelButtonText,
        confirmButtonColor: "#0081B5",
        cancelButtonColor: "#d7dae7",
        buttonsStyling: false,
        customClass: {
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class',
        }
      }

    ).then(function (isConfirmed) {
      callback && callback(isConfirmed);
    });
  }

  alertConfirmOkButtons(message: string, _confirmButtonText: string, title?: string, callback?: (result: any) => void) {

    return swal.fire(
      {
        title: title,
        text: message,
        icon: 'success',
        confirmButtonText: _confirmButtonText,
      }

    ).then(function (isConfirmed) {
      callback && callback(isConfirmed);
    });
  }

  alertInputCheckbox(message: string, title?: string, placeholder?: string, callback?: (result: any) => void) {
    return swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      input: 'checkbox',
      inputPlaceholder: placeholder
    }).then(function (isConfirmed) {
      callback && callback(isConfirmed);
    });
  }
}
