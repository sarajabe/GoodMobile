/* eslint-disable @typescript-eslint/naming-convention */

export const ROUTE_URLS = {
  // eslint-disable @typescript-eslint/naming-convention
  PARAMS: {
    REFERENCE_PAGE: 'refPage',
    PRODUCT_ID: 'productId',
    PHONE_ID: 'phoneId',
    CATEGORY_ID: 'categoryId',
    USER_PLAN_ID: 'userPlanId',
    SELECTED_PLAN: 'selectedPlan',
    PHONE_NUMBER: 'phoneNumber',
    ACTIVATE_SIM_CARD: 'activateSimCard',
    UPDATE_PLAN: 'updatePlan',
    FAQ_QUESTION_ID: 'questionId',
    REFERRAL_ID: 'referralCode',
    USER_ORDER_ID: 'orderId',
    DATA_SETUP_LANDING: 'dataSetupLanding',
    INTERNATIONAL_CALL_LANDING: 'rates',
    PLAN_ADD_ON_ID: 'planAddonId',
    PHONE_OS: 'os',
    SELECTED_PLAN_ID: 'selectedPlanID',
    PLAN_ID_FROM_EMAIL: 'planIDFromEmail',
    AUTO_RENEW: 'autoRenew',
    PAYMENT_METHOD: 'paymentMethod',
    NEW_PURCHASE: 'newPurchase',
    UTM_SOURCE: 'utm_source',
    UTM_MEDIUM: 'utm_medium',
    UTM_CAMPAIGN: 'utm_campaign',
    UTM_CONTENT: 'utm_content',
    NETWORK: 'network',
    PHONE_PURCHASE: 'phonePurchase'
  },
  HOME: 'home',
  BRING_PHONE: 'bring-your-phone',
  WIFI_CALLING: 'wifi-calling-use-a-wifi-network-to-make-calls',
  HD_VOICE: 'get-better-voice-quality-with-hd-voice-volte',
  EBB: 'emergency-broadband-benefit',
  ACP: 'affordable-connectivity-program',
  POSTER_ACP: 'ACP',
  POSTER_ACP_SMALL: 'acp',
  PLANS: 'plans',
  DATA_SETUP: 'data-setup',
  CHECK_PHONE: 'check-phone',
  ACP_DETAILS_LONG: 'free-cellphone-service-through-a-government-assistance-program-under-the-affordable-connectivity-program',
  LEGAL: {
    PRIVACY_POLICY: 'support/privacy-policy',
    TERMS_AND_CONDITIONS: 'support/terms-and-conditions',
    OPEN_INTERNET: 'support/open-internet',
    PRIVACY_NOTICE: 'support/privacy-notice',
    BROADBAND: 'support/broadband',
    UNLOCKING_POLICY: 'support/unlocking-policy',
    INTERNATIONAL_TERMS_AND_CONDITIONS: 'support/international-calling-terms-and-conditions',
    INTERNATIONAL_PRIVACY_POLICY: 'support/international-calling-privacy-notice',
    EULA: 'support/eula'
  },
  LOGIN: 'login'
};
export const OFFERS_ROUTE_URLS = {
  BASE: 'offers',
  UPGRADE_OFFER: 'upgrade-offer',
  CONFIRM_UPGRADE: 'upgrade-confirmation'
};
export const LOGIN_ROUTE_URLS = {
  PARAMS: {
    NEXT_PAGE: 'nextPage',
    EMAIL: 'email',
    OOB_CODE: 'oobCode',
    MODE: 'mode'
  },
  BASE: 'user',
  WELCOME: 'welcome',
  SIGN_UP: 'sign-up',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  ACP_SIGNUP: 'acp-signup'
};
export const ACCOUNT_ROUTE_URLS = {
  PARAMS: {
    NEXT_PAGE: 'nextPage',
    INTERNATIONAL_CALLING: 'internationalCalling',
    CHANGE_ADDON: 'changeAddon',
    ORDER_ID: 'id',
    TICKET_NUMBER: 'ticketNumber',
    FROM_DETAILS: 'fromDetails',
    PLAN_ID: 'planId',
    STORE_PICKUP: 'storePickup',
    ITEM_ID: 'itemId'
  },
  BASE: '/account',
  NAME: 'account',
  PENDING_ACTIVATIONS: 'pending-activations',
  USAGE: 'usage',
  SUMMARY: 'summary',
  CANCEL_PLAN: 'cancel-plan',
  USER_CANCEL_PLAN_FEEDBACK: 'cancel-plan/feedback',
  PAYMENTS: 'payments',
  MANAGE_DEVICES: 'manage-devices',
  SETTINGS: 'settings',
  PAY_AND_RENEW: 'pay-and-renew',
  PLAN_ADD_ONS: 'plan-addons',
  PHONE_DETAILS: 'phone-details',
  ORDERS: 'orders',
  ACP_APPLICATION: 'acp-application',
  REPORT_ISSUE: 'orders/report-issue',
  ORDER_NOT_RECIEVED: 'orders/report-issue/order-not-recieved',
  RETURN_DEVICE: 'orders/report-issue/return-device',
  EDIT_ADDRESS: 'orders/report-issue/edit-address',
  WRONG_ITEMS: 'orders/report-issue/wrong-items',
  SOMETHING_ELSE: 'orders/report-issue/something-else',
  RMA: 'orders/return-device',
  RETUREN_REASON: 'reason',
  CHANGE_OF_MIND: 'reason/change-of-mind',
  RETURN_FORM: 'return-form',
  CONFIRMATION: 'orders/confirmation',
  LOGIN: 'login',
  FORGET_PASSWORD: 'forgot-password',
  SIGNUP: 'sign-up',
  REFER_FRIEND: 'refer-a-friend',
  PAYMENTS_RECEIPT_DETAILS: 'payments/receipt-details',
  ORDERS_RECEIPT_DETAILS: 'orders/receipt-details',
  ORDER_DETAILS: 'orders/details',
  ESIM_SETUP: 'esim/setup'
};
export const SHOP_ROUTE_URLS = {
  BASE: '/shop',
  NAME: 'shop',
  PLAN_DETAILS: 'plan-details',
  CUSTOMIZE_PLAN: '',
  CHECKOUT: 'checkout',
  PLACE_ORDER: 'checkout/order',
  PLANS_AND_FEATURES: 'plans',
  PLANS_SHOP: 'plans/:id/details',
  CHANGE_PLANS_SHOP: 'plans/change/:id/details',
  CHECKOUT_RESULTS: 'checkout-results',
  CHECK_PHONE: 'check-phone',
  CHANGE_SUMMARY: 'change-summary',
  CHECKOUT_SHORT: 'checkout',
  CART: 'cart',
  PHONES: {
    MAIN: '',
    TYPE: 'phones',
    MODEL: 'phones/model',
    DETAILS: 'phones/details',
    SELECT_LINE: 'associate-line',
    CHECK_COVERAGE: 'phones/select/check-coverage',
    ADD_STEPS: 'phones/select'
  },
  PARAMS: {
    CHANGE_NEXT_CYCLE: 'nextCycle',
    TOP_UP_PLAN: 'topUpPlan',
    ADD_ON_PLAN: 'addOnPlan',
    ORDER_SIM: 'orderSim',
    SUCCESSFUL_PURCHASE: 'successfulPurchase',
    MDN: 'mdn',
    REFERRAL_CODE: 'referralCode',
    PHONE_PURCHASE: 'phonePurchase',
    REPLACE_PLAN: 'replacePlan',
    STORE_PICKUP: 'storePickup',
  },
};

export const PLANS_SHOP_ROUTE_URLS = {
  NEW_PLAN: 'new',
  CHANGE_PLAN: 'change',
  CHANGE_PLAN_ID: 'change/:id',
  DETAILS: 'details',
  DETAILS_ID: 'details/:id',
  BASE: '/plans',
  CHANGE_SUMMARY: 'change-summary',
};

export const PHONES_SHOP_ROUTE_URLS = {
  BASE: 'phones',
  MODEL: 'model',
  TYPE: 'apple/iPhones',
  DETAILS: 'apple/iPhones/:phoneId',
  SELECT_LINE: 'associate-line',
  CHECK_COVERAGE: 'check-coverage',
  ADD_STEPS: 'select',
  PARAMS: {
    CHANGE_PHONE: 'changePhone'
  }
};

export const SUPPORT_ROUTE_URLS = {
  BASE: '/support',
  NAME: 'support',
  FAQS: 'faqs',
  FAQS_CATEGORY: 'faqs/:category',
  FAQS_QUESTION_ID: 'faqs/:category/:id',
  SUPPORT_CARRIER: 'faqs/support/:carrier',
  SUPPORT_QUESTION: 'faqs/support/:carrier/:id',
  SUPPORT_CATEGORY: 'faqs/support',
  COVERAGE: 'coverage',
  LANDING_COVERAGE: 'best-wireless-coverage',
  CONTACT_US: 'contact',
  CONTACT_US_RESULTS: 'contact-us-results',
  HEARING_AID_COMPATIBILITY: 'hearing-aid-compatibility',
  DATA_SETUP: 'data-setup',
  // IPHONE: 'data-setup/ios',
  // IPHONE4G: 'data-setup/ios/4G',
  // IPHONE5G: 'data-setup/ios/5G',
  // ANDROID: 'data-setup/android',
  // ANDROID4G: 'data-setup/android/4G',
  // ANDROID5G: 'data-setup/android/5G',
  TMO_IPHONE: 'data-setup/tmo/ios',
  TMO_Android: 'data-setup/tmo/android',
  IPHONE_DATA_SETUP: 'iphone-data',
  CDMA_PROGRAMMING: 'cdma-programming',
  TERMS_AND_CONDITIONS: 'terms-and-conditions',
  TERMS_AND_CONDITIONS_CATEGORY: 'terms-and-conditions/:category',
  SITEMAP: 'sitemap',
  WHY_GM: 'why-GoodMobile',
  STORE_LOCATOR: 'store-locator',
  ABOUT_GM: 'about-GoodMobile',
  HOW_IT_WORKS: 'how-it-works',
  INTERNATIONAL_CALLING: 'international-calling',
  REFER_A_FRIEND: 'refer-a-friend',
  PRIVACY_NOTICE: 'privacy-notice',
  PARAMS: {
    TARGETID: 'targetId',
    NETWORKTYPE: 'networkType',
    NO_COVERAGE: 'noCoverage'
  },
};

export const CHECKOUT_ROUTE_URLS = {
  NEW_CUSTOMER: 'customerinfo/new',
  EXISTING_CUSTOMER: 'customerinfo/existing',
  SHIPPING_SECTION: 'shipping',
  PAYMENT_SECTION: 'billing',
  PLACE_ORDER: 'order',
  NAME: 'checkout',
  BASE: '/checkout'
};

export const ACTIVATION_ROUTE_URLS = {
  PARAMS: {
    PORTIN_NUMBER: 'portIn',
    ACTIVATION_CODE: 'code',
    COMPATABILE: 'compatibile',
    NETWORK: 'network',
    ZIP_CODE: 'zipCode',
    ICCID: 'iccid',
    ESIM: 'eSim',
    ACTIVATION: 'activate'
  },
  BASE: '/activation',
  NAME: 'activation',
  CHECK_PHONE: 'check-phone',
  ACTIVATE_PLAN: 'activate-plan',
  ACTIVATE_SIM: 'activate-sim',
  CHOOSE_PLANS_PATH: 'choose-plan',
  CHOOSE_ACTIVATION_PATH: 'choose-activation',
  ACTIVATION_SUMMARY: 'summary',
  CHECK_PHONE_RESULT: 'check-phone/result',
  VERIFY_PHONE: '',
  REPLACE_SIM: 'replace-sim',
  SIM_CHECK: 'sim-check',
  No_SIM: 'no-sim'
};

export const MIGRATION_ROUTE_URLS = {
  BASE: '/migration',
  NAME: 'migration',
  SIM_RECEIVED: 'sim-received',
  CHECK_COMPATIBILITY: 'check-device',
  CONFIRM_DEVICE: 'confirm-device',
  COMPATIBLE_DEVIE: 'compatible-device',
  INCOMPATIBLE_DEVICE: 'incompatible-device',
  SUCCESS_ORDER: 'successful-order',
  PARAMS: {
    CONFIRMED: 'confirmed',
    ORDERED: 'ordered',
    DEVICE: 'id'
  }
};

export const DUPLICATE_PAYMENTS_ROUTE_URLS = {
  PARAMS: {
    ID: 'id'
  },
  BASE: '/attention',
  NAME: 'attention',
  PAYMENT_ATTENTION: 'check-payments',
  PAYMENTS_LIST: 'payments-list',
  CHANGE_PREFERRED_PAYMENT: 'change-preferred-payment'
};
export const ACP_ROUTE_URLS = {
  BASE: '/affordable-connectivity-program/application',
  NAME: 'affordable-connectivity-program/application',
  DETAILS: 'details',
  ENROLLMENT_NEW_LINE : 'enrollment/new-line',
  ENROLLMENT_EXISTING_LINE : 'enrollment/existing-line',
};

