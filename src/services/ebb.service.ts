import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EbbManager {

  public activeStep: Observable<number>;
  public submitted: Observable<boolean>;
  public eligibilityCodeDescs: Observable<Array<{ code: string; description: string }>>;
  public codesSubject: ReplaySubject<Array<{ code: string; description: string }>> = new ReplaySubject<Array<{ code: string; description: string }>>(1);

  private stepReplySubject: ReplaySubject<number> = new ReplaySubject<number>(1);
  private submitClicked: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  constructor() {
    this.activeStep = this.stepReplySubject.asObservable();
    this.submitted = this.submitClicked.asObservable();
    this.eligibilityCodeDescs = this.codesSubject.asObservable();
  }

  public validateCurrentStep(stepNumber: number, submitClicked?): void {
    this.stepReplySubject.next(stepNumber);
    if(submitClicked){
      this.submitClicked.next(true);
    }
  }
}
