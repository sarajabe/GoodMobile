import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class CompatibilitySkipModalContext {
    public title: boolean;
    public hasCloseLink?: boolean;
    public customClass?: string;
    public notBeforeSkipping?:boolean;
}

@Component({
    selector: 'app-compatibility-skip-modal',
    templateUrl: './compatibility-skip-modal.component.html'
})
export class CompatibilitySkipModalComponent  {
    public context: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<CompatibilitySkipModalContext>, private location: PlatformLocation) {
        this.context = data;
        location.onPopState(() => {this.beforeDismiss();this.dialog.close();});
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
        this.beforeDismiss();
        this.dialog.close();
    }
}
