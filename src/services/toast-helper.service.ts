import { Injectable } from '@angular/core';
import { ActiveToast, GlobalConfig, ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastrHelperService {

  public isProcessingObservable: Observable<boolean>;
  private isProcessingSubject: ReplaySubject<boolean> = new ReplaySubject(1);

  private toastrOptions: Partial<GlobalConfig> = { // when add this option to ToastrModule.forRoot the change not apply
    positionClass: 'toast-top-center',
    timeOut: 4000,
    tapToDismiss: true,
    closeButton: true,
    enableHtml: true
  };

  private extendTimeoutToastrOptions: Partial<GlobalConfig> = {
    positionClass: 'toast-top-center',
    timeOut: 6000,
    extendedTimeOut: 2000,
    tapToDismiss: true,
    closeButton: true,
    enableHtml: true
  };

  private customToastrOptions: Partial<GlobalConfig> = {
    positionClass: 'toast-top-center',
    disableTimeOut: true,
    tapToDismiss: true,
    closeButton: true,
    enableHtml: true,
    preventDuplicates: true
  };

  constructor(private toastr: ToastrService) {
    this.isProcessingObservable = this.isProcessingSubject.asObservable();
  }

  public updateIsProcessing(isProcessing: boolean): void {
    this.isProcessingSubject.next(isProcessing);
  }

  public hideSpinner(activeToast: ActiveToast<any>): void {
    this.toastr.remove(activeToast.toastId);
  }

  public hideAllToastrs(): void {
    this.toastr.clear();
  }

  public createSpinner(message: string): ActiveToast<any> {
    this.hideAllToastrs();
    return this.toastr.info(`${message}<img class="loader" src="/assets/fonts/spinners/spinner-ring-path.svg" alt="Loading ...">`, null, this.customToastrOptions);
  }

  public showSuccess(message: string, title?: string, timeOut?: number, tapToDismiss?: boolean): any {
    this.hideAllToastrs();
    if (!!timeOut) {
      this.toastrOptions.timeOut = timeOut;
    }
    if (!!tapToDismiss) {
      this.toastrOptions.tapToDismiss = tapToDismiss;
    }
    return this.toastr.success(message, title, this.toastrOptions);
  }

  public showWarning(message: string, title?: string, timeOut?: number, tapToDismiss?: boolean): any {
    this.hideAllToastrs();
    if (!!timeOut) {
      this.extendTimeoutToastrOptions.timeOut = timeOut;
    }
    if (!!tapToDismiss) {
      this.extendTimeoutToastrOptions.tapToDismiss = tapToDismiss;
    }
    return this.toastr.warning(message, title, this.extendTimeoutToastrOptions);
  }

  public showAlert(message: string, title?: string, timeOut?: number, tapToDismiss?: boolean): any {
    this.hideAllToastrs();
    if (!!timeOut) {
      this.extendTimeoutToastrOptions.timeOut = timeOut;
    }
    if (!!tapToDismiss) {
      this.extendTimeoutToastrOptions.tapToDismiss = tapToDismiss;
    }
    return this.toastr.error(message, title, this.extendTimeoutToastrOptions);
  }
}
