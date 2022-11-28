import { ApplicationRef, NgModuleRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

export const ENV_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAptY33QrKcYqKfgXBM-rato2FWV9kBZLc",
  authDomain: "ztar-product-goodwill-test.firebaseapp.com",
  databaseURL: "https://ztar-product-goodwill-test-default-rtdb.firebaseio.com",
  projectId: "ztar-product-goodwill-test",
  storageBucket: "ztar-product-goodwill-test.appspot.com",
  messagingSenderId: "704817574614",
  appId: "1:704817574614:web:7e40945d68d0417209cf77",
  measurementId: "G-1CXHJHJ7MQ"
};
export const ENDPOINT_URL = 'https://gm-test.ztarmobile.io';
export const ACP_CALLBACK_URL =  'https://gm-test.ztarmobile.io';
export const ENV_ENDPOINT_URL: string = '';
export const BFF_ENDPOINT_URL = 'http://bff-test-1.goodmobile.org' ;
export const CUSTOMER_CARE_NUMBER: string = '8008408515';
export const CAPTCHA_SITE_ID = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; //this is the testing key for protractor
export const INVISIBLE_CAPTCHA_ID = '6LfbeMQZAAAAAK_0SgkpKWCjDyYCwzp2AdTwr8Nk';
export const BUILD_VERSION = require('../../package.json').version ;
export const BUILD_DATE = JSON.stringify((new Date()).toISOString());
export const GEOCODE_API_KEY = 'AIzaSyBLEp1LJrBqnCibrCdjkptaOB66y68B-aU';
export const CONTENTFUL = {
  spaceId: 'nf2nindv74ag',
  token: '4H2KlEJCD-Nw76Voi1BJDNdnNX3u0ymvzD8TxgoSXLw',
  environment: 'master'
};
export const ZMP_G2G_BFF_ENDPOINT_URL = 'https://gm-node-bff-test-7l7gbelfja-uc.a.run.app';
export const environment: Environment = {
  production: false,
  showDevModule: true,

  /** Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @ param modRef
   * @ return {any}
   */
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any> {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const ng = (window as any).ng;
    enableDebugTools(cmpRef);
    (window as any).ng.probe = ng.probe;
    (window as any).ng.coreTokens = ng.coreTokens;
    return modRef;
  },
  ENV_PROVIDERS: []
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
