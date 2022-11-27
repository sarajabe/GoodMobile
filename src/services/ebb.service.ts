import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EbbManager {

  public activeStep: Observable<number>;
  public submitted: Observable<boolean>;
  private stepReplySubject: ReplaySubject<number> = new ReplaySubject<number>(1);
  private submitClicked: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  constructor() {
    this.activeStep = this.stepReplySubject.asObservable();
    this.submitted = this.submitClicked.asObservable();
  }

  public validateCurrentStep(stepNumber: number, submitClicked?): void {
    this.stepReplySubject.next(stepNumber);
    if(submitClicked){
      this.submitClicked.next(true);
    }
  }
}
