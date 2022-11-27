import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnChanges {
  @Input() id = '';
  @Input() question = '';
  @Input() isActive = false;
  public toggleActive(event): void {
      if (!!event) {
        event.preventDefault();
      }

      if (this.isActive) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.isActive) {
      this.initActiveState(changes.isActive.currentValue);
    }
  }

  private initActiveState(isActiveExteral): void {

    if (isActiveExteral) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }

}

