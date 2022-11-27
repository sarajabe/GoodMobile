import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhoneManagementService {

  public activeStep: Observable<number>;
  public selectedOption: Observable<string>;
  public selectedMdn: Observable<boolean>;
  public declinedTerms: Observable<boolean>;
  public validProcess: Observable<boolean>;
  public planFlow: Observable<boolean>;
  private stepReplySubject: ReplaySubject<number> = new ReplaySubject<number>(1);
  private optionReplySubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private validReplySubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private selectedMdnReplySubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private declinedTermsReplySubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private planFlowReplySubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor() {
    this.activeStep = this.stepReplySubject.asObservable();
    this.selectedOption = this.optionReplySubject.asObservable();
    this.validProcess = this.validReplySubject.asObservable();
    this.selectedMdn = this.selectedMdnReplySubject.asObservable();
    this.declinedTerms = this.declinedTermsReplySubject.asObservable();
    this.planFlow = this.planFlowReplySubject.asObservable();
  }

  public updateCurrentStep(stepNumber: number): void {
    this.stepReplySubject.next(stepNumber);
  }

  public updateSelectedLineOption(option: string): void {
    this.optionReplySubject.next(option);
  }
  public updateSelectedMdn(option: boolean): void {
    this.selectedMdnReplySubject.next(option);
  }
  public setDeclinedTerms(option: boolean): void {
    this.declinedTermsReplySubject.next(option);
  }
  public setProcessValidity(option: boolean): void {
    this.validReplySubject.next(option);
  }
  public setPlanFlow(planFLow: boolean): void {
    this.planFlowReplySubject.next(planFLow);
  }
}
