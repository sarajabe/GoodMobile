export const FLOW_STATE = {
    STATE_DONE: 'DONE',
    STATE_PENDING: 'PENDING',
    STATE_CURRENT: 'CURRENT'
  };

export const FLOW_STEPS_IDS = {
    STEP_SIGN_IN: 'STEP_SIGN_IN',
    STEP_SHIPPING_ADDRESS: 'STEP_SHIPPING_ADDRESS',
    STEP_PAYMENT_VOUCHER: 'STEP_PAYMENT_VOUCHER',
    STEP_PAYMENT_CREDIT_CARD: 'STEP_PAYMENT_CREDIT_CARD',
    STEP_CHECKOUT: 'STEP_CHECKOUT',
    STEP_PLAN_SELECTION: 'STEP_PLAN_SELECTION'
  };

export interface IFlowIndicatorStep {
    state: string;
    pageTitle?: string;
    pageSubTitle?: string;
    pageDescription?: string;
    flowStepId: string;
    nextStepId?: string;
    nextAltStepId?: string;
    prevStepId?: string;
    title: string;
    isVisible?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
  }

export interface IFlowIndicator {
    steps: IFlowIndicatorStep[];
    hasShippingMode: boolean;
  }
