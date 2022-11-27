import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IUser, IUserPlan, UserPlansService } from '@ztarmobile/zwp-service-backend';
import { Subscription } from 'rxjs';
import { ModalHelperService } from 'src/services/modal-helper.service';
import { ToastrHelperService } from '../../services/toast-helper.service';
import { PhonePipe } from '../pipes/phone.pipe';
// import { ModalHelper } from '../../services/modal-helper.service';

@Component({
  selector: 'app-activated-plan-selector',
  templateUrl: './activated-plan-selector.component.html',
  styleUrls: ['./activated-plan-selector.component.scss']
})
export class ActivatedPlanSelectorComponent implements OnInit, OnDestroy, OnChanges {

  @Input() user: IUser;
  @Input() selectedPlan: IUserPlan;
  @Input() disabled: boolean;
  @Input() showOnlyDropdown: boolean;
  @Input() cannotUpdatePlan: boolean;
  @Output() userPlanSelected: EventEmitter<IUserPlan> = new EventEmitter();

  public userPlans: IUserPlan[];
  private selectedPlanObserver: Subscription;
  private plansObserver: Subscription;

  constructor(private userPlansService: UserPlansService,
              private modalHelper: ModalHelperService,
              private toastHelper: ToastrHelperService) {

  }

  ngOnInit(): void {
    this.plansObserver = this.userPlansService.userPlans.subscribe((plans) => {
      this.filterUserPlans(plans);
      // The following line to keep selected plan selected even after it changed
      if (!!this.selectedPlan) {
        this.setSelectedPlan(this.selectedPlan);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.planSelectorSettings) {
      this.filterUserPlans(this.userPlans);
    }
    if (!!changes.selectedPlan && !!changes.selectedPlan.currentValue && changes.selectedPlan.currentValue !== changes.selectedPlan.previousValue) {
      this.setSelectedPlan(changes.selectedPlan.currentValue);
    }
  }

  ngOnDestroy(): void {
    if (!!this.selectedPlanObserver) {
      this.selectedPlanObserver.unsubscribe();
    }
    if (!!this.plansObserver) {
      this.plansObserver.unsubscribe();
    }
  }

  public getSelectorTitle(plan: IUserPlan): string {
    let title = '';
    if (!!plan.mdn) {
      const mdn: string = (new PhonePipe()).transform(plan.mdn);
      title = !!plan.portInRequestNumber ? `PortIn for ${mdn}` : (!!plan.canceled ? `${mdn} - Canceled` : mdn);
    } else {
      title = `${plan.title} - `;
      if (!!plan.planDevice) {
        title = title + ((plan.planDevice.marketingName || plan.planDevice.model) || 'Unknown Device');
      } else if (!!plan.planExpectedDevice) {
        title = title + plan.planExpectedDevice.title;
      } else {
        title = title + 'No Device';
      }
    }
    return title;
  }

  public setSelectedPlan(event: IUserPlan): void {
    if (!!this.cannotUpdatePlan) {
      // eslint-disable-next-line no-console
      console.info('can\'t set Selected plan', event);
    } else {
      this.userPlanSelected.emit(event);
    }
  }

  public planCompare(plan1: IUserPlan, plan2: IUserPlan): boolean {
    return !!plan1 && !!plan2 ? plan1.id === plan2.id : plan1 === plan2;
  }

  public addActivatedAccount(): void {
    this.modalHelper.showAddActivatedNumberModal().result.then((result) => {
      if (!!result) {
        this.userPlansService.bffAddUserPlanMDN(result).then((userPlanId) => {
          this.userPlansService.selectUserPlan(userPlanId);
          this.modalHelper.showInformationMessageModal('Number successfully added!', 'Your activated number has been successfully added to your account.', 'Done',
            null, true, 'successful-activation-modal');
        }, (error) => this.toastHelper.showAlert(error.error.message));
      }
    }).catch((error) => {/* ignored */
    });
  }

  private filterUserPlans(plans): void {
    if (!!plans) {
      let filteredPlans = plans;
      filteredPlans = filteredPlans.filter((plan) => !!plan.mdn);
      this.userPlans = filteredPlans;
    }
  }

}
