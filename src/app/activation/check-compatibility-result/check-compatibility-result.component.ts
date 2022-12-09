import { AfterContentChecked, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { CART_TYPES, CustomizableMobilePlan, IDeviceCompatibilityV1, IUser, MobileCustomPlansService } from '@ztarmobile/zwp-service-backend';
import { takeWhile } from 'rxjs/operators';
import { ACCOUNT_ROUTE_URLS, ACTIVATION_ROUTE_URLS, LOGIN_ROUTE_URLS, SHOP_ROUTE_URLS } from 'src/app/app.routes.names';
import { MetaService } from 'src/services/meta-service.service';

@Component({
  selector: 'app-check-compatibility-result',
  templateUrl: './check-compatibility-result.component.html',
  styleUrls: ['./check-compatibility-result.component.scss']
})
export class CheckCompatibilityResultComponent implements OnDestroy, AfterContentChecked {
  public user: IUser;
  public cart: CustomizableMobilePlan;
  public zip: string;
  public CART_TYPES = CART_TYPES;
  public SHOP_ROUTE_URLS = SHOP_ROUTE_URLS;
  public ACTIVATION_ROUTE_URLS = ACTIVATION_ROUTE_URLS;
  public LOGIN_ROUTE_URLS = LOGIN_ROUTE_URLS;
  public ACCOUNT_ROUTE_URLS = ACCOUNT_ROUTE_URLS.PENDING_ACTIVATIONS;
  public network = 'att';
  public isLoggedIn = false;
  public isCompatibile = true;
  public hasNewPlan = false;
  public SUCCESS_BANNER_DESCS = {};
  public paramValue: string = '';
  public eSimCompatiple = false;
  public isAnyNetworkWithNoESim = false;

  private alive = true;

  constructor(private router: Router,
    private simpleAuthService: SimpleAuthService,
    private route: ActivatedRoute,
    private mobilePlansService: MobileCustomPlansService,
    private metaService: MetaService) {

    this.simpleAuthService.userState.pipe(takeWhile(() => this.alive)).subscribe((authState) => {
      this.isLoggedIn = !!authState && !authState.isAnonymous;
    });
    this.metaService.createCanonicalUrl();
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.cart = plan;
      if (this.cart && this.cart.cartType === CART_TYPES.NEW_PLAN) {
        this.hasNewPlan = true;
      } else {
        this.hasNewPlan = false;
      }
    });
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.COMPATABILE]) {
        this.isCompatibile = false;
      }
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.NETWORK]) {
        this.network = params[ACTIVATION_ROUTE_URLS.PARAMS.NETWORK];
        this.isAnyNetworkWithNoESim = true;
        this.paramValue = 'ALL_NETWORKS';
      }
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE]) {
        this.zip = params[ACTIVATION_ROUTE_URLS.PARAMS.ZIP_CODE];
      }
      if (!!params && params[ACTIVATION_ROUTE_URLS.PARAMS.ESIM]) {
        this.eSimCompatiple = params[ACTIVATION_ROUTE_URLS.PARAMS.ESIM];
        this.paramValue = 'ESIM';
      }
    });
    this.appendToBody();
  }
  ngAfterContentChecked(): void {
    this.SUCCESS_BANNER_DESCS = {
      'ESIM': {
        title: 'Great News!',
        desc1: 'Your device is <b>eSIM compatible.</b>',
        desc2: 'After the order has been placed, you would be able to activate your eSIM instantly!',
        desc3: `<b>What is an eSim?</b><span class="tooltip">
        <img src="assets/icon/Information-sec.svg" class="info" alt="Info icon" />
          <span class="tooltiptext">
            <img src="assets/icon/why-arrow.svg" alt="Info icon" />
            <p>An eSIM is an industry-standard digital SIM that allows you to activate a
                cellular plan from your carrier without having to use a physical SIM.</p>
            <p>The activation process is immediate without having to wait around.</p>
          </span>
        </span>`,
        buttonName: 'Proceed to checkout',
        buttonAction: 'proceedToCheckout',
        isAttFlow: false
      },
      'ALL_NETWORKS': {
        title: 'Congrats!',
        desc1: '<b>Your device is compatible for great coverage</b>',
        desc2: 'Get unlimited talk and text + data access',
        desc3: 'Proceed to checkout to order your new plan and FREE SIM card from GoodMobile.',
        buttonName: 'Proceed to checkout',
        buttonAction: 'proceedToCheckout',
        isAttFlow: true
      }
    }
  }
  ngOnDestroy(): void {
    this.alive = false;
  }
  public SendTmoPhysicalSim(): void {
    const device = { network: 'tmo', networkType: 'GSM', skuIdentifier: 'T', skuNumber: 'SIMGWLTMO4GLTE' } as IDeviceCompatibilityV1;
    this.mobilePlansService.setPlanDevice(device);
    this.mobilePlansService.seteSIM(false);
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
  }
  public proceedToCheckout(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
  }
  private appendToBody(): void {
    if (!document.getElementById('dynamic_map')) {
      let dynamicScript = document.createElement('script');
      dynamicScript.type = 'text/javascript';
      dynamicScript.async = true;
      dynamicScript.src = 'https://contentkit.t-mobile.com/prd/web-content-kit.js';
      dynamicScript.id = 'dynamic_map';
      document.body.appendChild(dynamicScript);
    }
  }
}
