import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { ContentfulService } from '../../../../services/contentful.service';
import { ToastrHelperService } from '../../../../services/toast-helper.service';
import { ModalHelperService } from '../../../../services/modal-helper.service';
import { Observable } from 'rxjs';
import {
  IPhoneDetails,
  IPhoneProduct,
  IShopCategory,
  MobileCustomPlansService,
  ShopConfigurationService,
  UserDeviceService,
  UserPlansService,
  CustomizableMobilePlan,
  CatalogService,
  ICatalogItem
} from '@ztarmobile/zwp-service-backend';
import { FadeInOutAnimation } from '../../../../app/app.animations';
import { MetaService } from '../../../../services/meta-service.service';
import { takeWhile, take } from 'rxjs/operators';
import { ROUTE_URLS, SHOP_ROUTE_URLS, ACCOUNT_ROUTE_URLS, CHECKOUT_ROUTE_URLS, PHONES_SHOP_ROUTE_URLS } from '../../../app.routes.names';
import { AppState } from 'src/app/app.service';
import { PhoneManagementService } from 'src/services/phones.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: [FadeInOutAnimation]
})
export class DetailsComponent implements OnDestroy, OnInit {
  public finishMarketURL: string;
  public finishColor: string;
  public colorHovered: string;
  public finishHexCode: string;
  public capacityValue: string;
  public phoneName: string;
  public imageURL: string;
  public Os: string;
  public capacityPrice: number;
  public phoneId: string;
  public isDisplay: boolean;
  public phoneImage: Observable<any>;
  public phoneCapacity: Observable<any>;
  public techSpecification: Observable<any>;
  public categoryId: Observable<any>;
  public phoneDetails: Observable<any>;
  public isDefaultFinishes = true;
  public phoneSummary: Observable<any>;
  public name: Observable<any>;
  public phone: IPhoneDetails;
  public selectedDefaultFinishId: Observable<any>;
  public defaultFinishId: any;
  public selectedFinishId: string;
  public selectedProduct: IPhoneProduct;
  public category: IShopCategory;
  public selectedCapacityId: string;
  public selectedDefaultCapacityId: any;
  public isDefaultCapacity = true;
  public specifications;
  public userCart: CustomizableMobilePlan;
  public innerWidth: any;
  public selectedSku: string;
  public selectedPhoneFromCatalog: ICatalogItem = {} as ICatalogItem;
  public catalogData: Array<ICatalogItem>;
  public isAvailable = true;
  public isLowStock = false;
  public isOutOfStock = false;
  public colorName:'';
  public CATEGORIES = {
    apple_ID: "Apple iPhones",
    googlePixel_ID: "Google Pixels"
  }
  public phoneCategory: string;
  public finishes: Array<{ color: string, finishId: string, hexCode: string, imageUrl: string, marketUrl: string, os: string, outOfStock: boolean }> = [];
  public showDescription = false;
  public showFeatures = false;
  public showSpecs = false;
  private isChangePhone = false;
  private userPlanId: string;
  private userHasPlans: boolean;
  private referencePage: string;
  private updatePlan: boolean;
  private selectedPlanId: string;
  private availableFinishes: Array<{ color: string, finishId: string, hexCode: string, imageUrl: string, marketUrl: string, os: string, outOfStock: boolean }> = [];
  private alive = true;

  constructor(
    public router: Router,
    private catalogService: CatalogService,
    private shopConfigurationService: ShopConfigurationService,
    private userPlansService: UserPlansService,
    private userDeviceService: UserDeviceService,
    private toastHelper: ToastrHelperService,
    private simpleAuthService: SimpleAuthService,
    private modalHelper: ModalHelperService,
    private mobilePlansService: MobileCustomPlansService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private contentful: ContentfulService,
    private appState: AppState,
    private stepsManagement: PhoneManagementService,
    private meta: Meta) {
  }
  ngOnInit(): void {
    this.metaService.createCanonicalUrl('', true);
    this.innerWidth = window.innerWidth;
    this.phoneId = this.route.snapshot.paramMap.get('phoneId');
    this.phoneCategory = 'apple_ID';
    this.categoryId = this.contentful.getCategoryId('phoneModel', this.phoneId);
    this.name = this.contentful.getphoneName('phoneModel', this.phoneId);
    this.name.pipe(take(1)).subscribe((d) => {
      const title = `Buy ${d.phoneName} | Free SIM | Good Mobile`;
      const description = `Buy an unlocked ${d.phoneName}. 14-days returns and up to 90-days warranty. Great value and a more sustainable option and FREE delivery.`
      this.meta.updateTag( { name: 'title', content: title });
      this.meta.updateTag( { name: 'og:title', content: title });
      this.meta.updateTag( { name: 'description', content: description });
      this.meta.updateTag( { name: 'og:description', content: description });
    });
    this.phoneDetails = this.contentful.getPhoneSpecData('phoneDetails', this.phoneId);
    this.selectedDefaultFinishId = this.contentful.getOneDefaultFinishesField('finishes', this.phoneId);
    this.selectedDefaultCapacityId = this.contentful.getOneDefaultCapacityField('capacity', this.phoneId);
    this.techSpecification = this.contentful.getPhoneSpecData('technicalSpecificationDescriptionAndValues', this.phoneId);
    this.appState.loading = true;
    this.catalogService.getCatalog('smartphone').then((data) => {
      this.catalogData = data?.items;
      this.appState.loading = false;
      this.phoneDetails.subscribe(details => {
        if (!!details && details[0]?.fields?.phoneFinishes?.length > 0 && !!details[0]?.fields?.sku && this.catalogData) {
          details[0]?.fields?.phoneFinishes.map(finsihItem => {
            const selectedFinish = details[0]?.fields?.sku?.find((skuItem) => skuItem?.fields?.skuFinishId === finsihItem?.fields?.finishId);
            this.selectedSku = selectedFinish?.fields?.sku;
            this.selectedPhoneFromCatalog = this.catalogData.find((item) => item?.sku === this.selectedSku);
            const outOfStock = this.selectedPhoneFromCatalog?.stock > 0 ? false : true;
            if (outOfStock) {
              this.finishes.push({ color: finsihItem?.fields?.color, finishId: finsihItem?.fields?.finishId, hexCode: finsihItem?.fields?.hexCode, imageUrl: finsihItem?.fields?.imageUrl, marketUrl: finsihItem?.fields?.marketUrl, os: details?.fields?.os, outOfStock })
            } else {
              this.availableFinishes.unshift({ color: finsihItem?.fields?.color, finishId: finsihItem?.fields?.finishId, hexCode: finsihItem?.fields?.hexCode, imageUrl: finsihItem?.fields?.imageUrl, marketUrl: finsihItem?.fields?.marketUrl, os: details?.fields?.os, outOfStock });
              this.finishes.unshift({ color: finsihItem?.fields?.color, finishId: finsihItem?.fields?.finishId, hexCode: finsihItem?.fields?.hexCode, imageUrl: finsihItem?.fields?.imageUrl, marketUrl: finsihItem?.fields?.marketUrl, os: details?.fields?.os, outOfStock })
            }
          });
          this.selectedDefaultFinishId.pipe(take(1)).subscribe(defaults => {
            if (!!defaults && !!this.catalogData) {
              const selectedSku = details[0]?.fields?.sku.find((skuItem) => skuItem?.fields?.skuFinishId === defaults?.finishId)?.fields?.sku;
              this.selectedPhoneFromCatalog = this.catalogData.find((item) => item?.sku === selectedSku);
              const isSelectedPhoneOutOfStock = this.selectedPhoneFromCatalog?.stock > 0 ? false : true;
              if (!!isSelectedPhoneOutOfStock && this.availableFinishes?.length > 0) {
                this.defaultFinishId = this.availableFinishes[0];
                this.imageURL = this.availableFinishes[0]?.imageUrl;
                this.selectedFinishId = this.availableFinishes[0]?.finishId;
              } else {
                this.defaultFinishId = defaults;
                this.selectedFinishId = defaults?.finishId;
                this.imageURL = defaults?.imageUrl;
              }
              this.finishColor = this.defaultFinishId.color;
              this.updateSelectedProduct();
            }
          });
        }
      });
    }, (error) => {
      this.appState.loading = false;
      this.toastHelper.showAlert(error.message);
    });
    this.selectedDefaultCapacityId.pipe(take(1)).subscribe(defaults => {
      if (!!defaults) {
        this.selectedCapacityId = defaults?.capacityId;
        this.updateSelectedProduct();
      }
    });
    this.mobilePlansService.currentPlan.pipe(takeWhile(() => this.alive)).subscribe((plan) => {
      this.userCart = plan;
    });
    this.route.params.pipe(takeWhile(() => this.alive)).subscribe((params: Params) => {
      if (params) {
        if (!!params[ROUTE_URLS.PARAMS.USER_PLAN_ID]) {
          this.userPlanId = params[ROUTE_URLS.PARAMS.USER_PLAN_ID];
        }
        if (!!params[ROUTE_URLS.PARAMS.UPDATE_PLAN]) {
          this.updatePlan = params[ROUTE_URLS.PARAMS.UPDATE_PLAN];
        }
        if (!!params[ROUTE_URLS.PARAMS.REFERENCE_PAGE]) {
          this.referencePage = params[ROUTE_URLS.PARAMS.REFERENCE_PAGE];
        }
        if (!!params[ROUTE_URLS.PARAMS.SELECTED_PLAN]) {
          this.selectedPlanId = params[ROUTE_URLS.PARAMS.SELECTED_PLAN];
        }
        if (!!params[PHONES_SHOP_ROUTE_URLS.PARAMS.CHANGE_PHONE]) {
          this.isChangePhone = true;
        }
      } else {
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`]);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  public selectFinish(finishId, marketUrl, color, hexCode, os, phoneName, imgUrl, outOfStock): void {
    if (!outOfStock) {
      this.isDisplay = true;
      this.selectedFinishId = finishId;
      this.finishColor = color;
      this.finishHexCode = hexCode;
      this.finishMarketURL = marketUrl;
      this.Os = os;
      this.phoneName = phoneName;
      this.imageURL = imgUrl;
      this.isDefaultFinishes = false;
      this.phoneImage = this.contentful.getPhoneImg('finishes', finishId);
      if(!!this.selectedFinishId) {
      this.updateSelectedProduct();
      }
    }
  }

  public selectCapacity(capacityId, value, price): void {
    this.isDefaultCapacity = false;
    this.selectedCapacityId = capacityId;
    this.capacityValue = value;
    this.capacityPrice = price;
    this.phoneCapacity = this.contentful.getPhoneCapacity('capacity', capacityId);
    this.updateSelectedProduct();
  }

  public selectPhone(): void {
    if (!this.isOutOfStock && this.isAvailable && !!this.selectedPhoneFromCatalog) {
      this.selectedPhoneFromCatalog.image = this.imageURL;
      sessionStorage.setItem('phone', JSON.stringify(this.selectedPhoneFromCatalog));
      this.stepsManagement.updateSelectedLineOption('');
      if (!!this.isChangePhone) {
        this.stepsManagement.setPlanFlow(false);
        this.mobilePlansService.setPhones([this.selectedPhoneFromCatalog]);
        this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${SHOP_ROUTE_URLS.CART}`]);
      } else {
        const isPlanFlow = sessionStorage.getItem('planFlow');
        if (!!isPlanFlow) {
          this.stepsManagement.setPlanFlow(true);
          this.stepsManagement.updateSelectedLineOption('new');
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.ADD_STEPS}/${PHONES_SHOP_ROUTE_URLS.CHECK_COVERAGE}`]);
        } else {
          this.stepsManagement.setPlanFlow(false);
          this.stepsManagement.updateSelectedLineOption('');
          this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.ADD_STEPS}/${PHONES_SHOP_ROUTE_URLS.SELECT_LINE}`]);
        }
      }
    }
  }


  public goToPhonesPage(): void {
    this.router.navigate([`${SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.BASE}/${PHONES_SHOP_ROUTE_URLS.TYPE}`]);
  }

  private updateSelectedProduct(): void {
    this.selectedProduct = {
      capacityId: this.selectedCapacityId,
      capacityTitle: this.capacityValue,
      price: this.capacityPrice,
      finishId: this.selectedFinishId,
      finishTitle: this.finishColor,
      hexCode: this.finishHexCode,
      marketURL: this.finishMarketURL,
      id: this.selectedCapacityId + '-' + this.selectedFinishId,
      os: this.Os,
      title: this.phoneName,
      phoneId: this.phoneId,
      imageUrl: this.imageURL
    };
    if (!!this.selectedCapacityId || !!this.selectedFinishId) {
      this.phoneDetails.subscribe(details => {
        if (!!details) {
          if (!!details[0]?.fields?.sku) {
            let selectedItem = null;
            if(!!this.selectedFinishId && !!this.selectedCapacityId) {
              selectedItem = details[0]?.fields?.sku.find((skuItem) => skuItem?.fields?.skuFinishId.trim() === this.selectedFinishId.trim() && skuItem?.fields?.skuCapacityId.trim() === this.selectedCapacityId.trim());
            } else {
              selectedItem = details[0]?.fields?.sku.find((skuItem) => skuItem?.fields?.skuFinishId.trim() === this.selectedFinishId.trim());
            }
            if (!!this.catalogData && !!selectedItem) {
              this.selectedSku = selectedItem?.fields?.sku;
              this.selectedPhoneFromCatalog = this.catalogData.find((item) => item?.sku === this.selectedSku);
              this.checkDeviceAvailabilty();
            }
          }
        }
      });
    }
  }

  private checkDeviceAvailabilty(): void {
    if (!!this.selectedPhoneFromCatalog) {
      this.isAvailable = true;
      this.isOutOfStock = this.selectedPhoneFromCatalog?.stock > 0 ? false : true;
      this.isLowStock = this.selectedPhoneFromCatalog?.stock > 0 && this.selectedPhoneFromCatalog?.stock <= 5 ? true : false;
    } else {
      this.isAvailable = false;
    }
  }

}
