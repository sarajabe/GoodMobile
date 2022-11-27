import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FLOW_STATE, FLOW_STEPS_IDS, IFlowIndicator, IFlowIndicatorStep } from './flow-indicator';

@Component({
  selector: 'app-flow-indicator',
  templateUrl: './flow-indicator.component.html',
  styleUrls: ['./flow-indicator.component.scss']
})
export class FlowIndicatorComponent implements OnChanges, OnInit {
  @Input() flowSettings: IFlowIndicator;
  @Output() goToPage: EventEmitter<string> = new EventEmitter<string>();

  public flowSteps: IFlowIndicatorStep[];
  public FLOW_STATE = FLOW_STATE;
  public FLOW_STEPS_IDS = FLOW_STEPS_IDS;

  ngOnInit(): void {
    this.updateSteps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.flowSettings && !!changes.flowSettings.currentValue) {
      this.updateSteps(changes.flowSettings.currentValue);
    }
  }
  public classFromState(step: IFlowIndicatorStep): string {
    let cssClass = '';
    if (step.state === this.FLOW_STATE.STATE_CURRENT) {
      cssClass += 'current ';
    }
    if (step.state === this.FLOW_STATE.STATE_DONE) {
      cssClass += 'done ';
    }
    if (step.isFirst) {
      cssClass += 'first-bullet ';
    }
    if (step.isLast) {
      cssClass += 'last-bullet ';
    }
    return cssClass;
  }

  private updateSteps(changes?): void {
    if (!!this.flowSettings && !!this.flowSettings.steps) {
      if (!!changes) {
        this.flowSettings = changes;
        this.flowSteps = this.flowSettings.steps.filter((step) => !!step.isVisible);
      } else {
        this.flowSteps = this.flowSettings.steps.filter((step) => !!step.isVisible);
      }
    }
  }
}
