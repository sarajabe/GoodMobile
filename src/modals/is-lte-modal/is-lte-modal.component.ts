import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CloseGuard, DialogRef, ModalComponent } from 'ngx-modialog-7';
import { BSModalContext } from 'ngx-modialog-7/plugins/bootstrap';
import { PlatformLocation } from '@angular/common';

export class IsLteModalContext extends BSModalContext {
  public title: string;
  public customClass?: string;
}

@Component({
  selector: 'app-is-lte-modal',
  templateUrl: './is-lte-modal.component.html',
})
export class IsLteModalComponent implements OnInit, CloseGuard, ModalComponent<IsLteModalContext>{
  public lteOptionsForm: FormGroup;
  public selectedOption : any;
  public context: IsLteModalContext;
  constructor(public dialog: DialogRef<IsLteModalContext>, private location: PlatformLocation) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    location.onPopState(() => this.dialog.close());
  }

  ngOnInit(): void {
    this.lteOptionsForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
  }
  public checkCoverage(){
    if (!!this.lteOptionsForm.valid) {
      this.selectedOption = this.lteOptionsForm.get('option').value;
      if (this.selectedOption === 'Yes') {
       this.selectedOption = true;
      }
      else if (this.selectedOption === 'No'){
        this.selectedOption = false;
      }
      else{
        this.selectedOption = null;
      }
      this.dialog.close(this.selectedOption);
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
}
