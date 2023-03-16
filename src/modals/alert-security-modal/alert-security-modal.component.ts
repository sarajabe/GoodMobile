import { Component, Inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class AlertSecurityModalContext {
    public title: string;
    public secondaryBtn?: string;
    public primaryBtn?: string;
    public timer?: boolean;
    public customClass?: string;
    public customHTML?: string;
}

@Component({
    selector: 'app-alert-security-modal',
    templateUrl: './alert-security-modal.component.html'
})
export class AlertSecurityModalComponent {
    public context: any;
    public seconds: any = 0;
    public minutes: any = 0;
    public timeLeft = 300000; // 5 Minutes
    public interval: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<AlertSecurityModalContext>, private location: PlatformLocation) {
        location.onPopState(() => { this.beforeDismiss(); this.dialog.close(); });
        this.context = data;
        this.timer();
        this.refreshInterval();
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

    closeDialog(res?): void {
        this.beforeDismiss();
        this.dialog.close(res);
    }

    OK(): void {
        this.closeDialog(true);
    }
    cancel(): void {
        this.closeDialog('logout');
    }
    timer(): void {
        this.seconds = Math.floor(this.timeLeft / 1000);
        this.minutes = Math.floor(this.seconds / 60);
        this.minutes %= 60;
        this.seconds %= 60;
        this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
    }
    refreshInterval(): void {
        this.interval = setInterval(() => {
            this.timeLeft = this.timeLeft - 1000;
            if (this.timeLeft > 0) {
                this.timer();
            } else if (this.timeLeft === 0) {
                this.closeDialog('logout');
                this.stopTimer();
                this.timeLeft = 300000; // 5 Minutes
            }
        }, 1000);
    }
    stopTimer() {
        clearInterval(this.interval);
    }
}
