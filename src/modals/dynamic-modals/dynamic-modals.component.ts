import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { ContentfulService } from '../../services/contentful.service';
import { PlatformLocation } from '@angular/common';

export class DynamicModalContext extends BSModalContext {
  public message: string;
  public title: boolean;
  public btnText: string;
  public btnUrl?: string;
  public hasCloseLink?: boolean;
  public customClass?: string;
  public customHTML?: string;
  public contentfulModel? : string;
  public renderElementId?: string;
  public richTextId? : string;
  public cancelBtn?: boolean;
  public cancelText?: string;
  public noteText?: string;
}
@Component({
  selector: 'app-dynamic-modals',
  templateUrl: './dynamic-modals.component.html'
})
export class DynamicModalsComponent implements CloseGuard, ModalComponent<DynamicModalContext> {
  public context: DynamicModalContext;

  constructor(public dialog: DialogRef<DynamicModalContext>, private contentFulService: ContentfulService,
              private location: PlatformLocation) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
    if ( !!this.context.richTextId && !!this.context.contentfulModel && !!this.context.renderElementId) {
      this.contentFulService.getPopUpDescriptions(this.context.contentfulModel, this.context.renderElementId, this.context.richTextId);
    }
  }

  beforeClose(): boolean {
    if (document.body.classList.contains('modal-open')) {
      document.body.classList.remove('modal-open');
    }
    return false;
  }

  beforeDismiss(): boolean {
    return this.beforeClose();
  }

  closeDialog(): void {
    this.dialog.dismiss();
  }

  OK(): void {
    this.dialog.close(true);
  }
  cancel(): void{
    this.dialog.close(false);
    this.closeDialog();
  }
}

