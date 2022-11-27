import { Component } from '@angular/core';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class CompatibilitySkipModalContext extends BSModalContext {
    public title: boolean;
    public hasCloseLink?: boolean;
    public customClass?: string;
    public notBeforeSkipping?:boolean;
}

@Component({
    selector: 'app-compatibility-skip-modal',
    templateUrl: './compatibility-skip-modal.component.html'
})
export class CompatibilitySkipModalComponent implements CloseGuard, ModalComponent<CompatibilitySkipModalContext> {
    public context: CompatibilitySkipModalContext;

    constructor(public dialog: DialogRef<CompatibilitySkipModalContext>, private location: PlatformLocation) {
        this.context = dialog.context;
        dialog.setCloseGuard(this);
        location.onPopState(() => this.dialog.close());
    }

    public skipModalOption(skipResult?): void {
        let selectedOption = '';

        if (!!skipResult) {
            selectedOption = 'eSim';
        } else if (skipResult === false) {
            selectedOption = 'physical';
        } else {
            selectedOption = 'checkDevice';
        }
        this.dialog.close(selectedOption);
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
}
