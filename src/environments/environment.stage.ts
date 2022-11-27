// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const ENV_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB8Y2KSaZFGgNLwkWJBfWliFf3S7Ga6-PM",
  authDomain: "ztar-product-goodwill-prod.firebaseapp.com",
  projectId: "ztar-product-goodwill-prod",
  storageBucket: "ztar-product-goodwill-prod.appspot.com",
  messagingSenderId: "559235482007",
  appId: "1:559235482007:web:38036872606101518fc4d2",
  measurementId: "G-3P5F039PK5"
};

export const ENDPOINT_URL = 'https://gm-stage.ztarmobile.io';
export const ACP_CALLBACK_URL =  'https://gm-stage.ztarmobile.io';
export const ENV_ENDPOINT_URL: string = '';
export const BFF_ENDPOINT_URL = 'http://bff-stage-1.goodmobile.org' ;
export const CUSTOMER_CARE_NUMBER: string = '8008408515';
export const CAPTCHA_SITE_ID = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; //this is the testing key for protractor
export const INVISIBLE_CAPTCHA_ID = '6LfbeMQZAAAAAK_0SgkpKWCjDyYCwzp2AdTwr8Nk';
export const BUILD_VERSION = require('../../package.json').version ;
export const BUILD_DATE = JSON.stringify((new Date()).toISOString());
export const GEOCODE_API_KEY = 'AIzaSyBLEp1LJrBqnCibrCdjkptaOB66y68B-aU';
export const CONTENTFUL = {
  spaceId: 'nf2nindv74ag',
  token: '4H2KlEJCD-Nw76Voi1BJDNdnNX3u0ymvzD8TxgoSXLw',
  environment: 'production'
};
export const ZMP_G2G_BFF_ENDPOINT_URL = 'https://g2g-bff-5zxbrbyvaq-uc.a.run.app';
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
