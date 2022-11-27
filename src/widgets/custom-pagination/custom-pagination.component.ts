import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PaginationControlsDirective, PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent implements OnChanges {
  @Input() config: PaginationInstance;
  @Input() circle: boolean;
  @Output() configChange: EventEmitter<number> = new EventEmitter();
  @ViewChild('paginationApi') paginationApi: PaginationControlsDirective;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.config) {
      this.config = changes.config.currentValue;
    }
  }

  public setCurrentPage(pageNumber): void {
    this.config.currentPage = pageNumber;
    this.configChange.emit(pageNumber);
  }

  public previousPage(isFirstPage): void {
    if (!isFirstPage) {
      this.setCurrentPage(--this.config.currentPage);
    }
  }

  public nextPage(lastPage): void {
    if (!lastPage) {
      this.setCurrentPage(++this.config.currentPage);
    }
  }

}
