import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class BarCodeModalContext {
  public barcodeValue: string;
  public title: string;
  public message: string;
  public barCodeMessage?: string;
  public barCodeString?: string;
}

@Component({
  selector: 'app-bar-code-modal',
  templateUrl: './bar-code-modal.component.html',
  styleUrls: ['./bar-code-modal.component.scss']
})
export class BarCodeModalComponent implements OnInit {
  public context: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialogRef<BarCodeModalContext>) { 
    this.context = data;
  }

  ngOnInit(): void {
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

  public closeDialog(): void {
    this.beforeDismiss();
    this.dialog.close();
  }
}
