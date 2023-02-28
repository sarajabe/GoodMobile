import { HttpHandler, HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointUrl } from '@ztarmobile/zwp-service';
import { CatalogService, ICatalog, ICatalogItem } from '@ztarmobile/zwp-service-backend';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ENV_FIREBASE_CONFIG } from '../../../../environments/environment';
import { ModalHelperService } from '../../../../services/modal-helper.service';

import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    let mockCatalogService;
    const CATALOG = {
        items: [
            {
                type: 'Smartphone',
                sku: 'SP-IPH8-64GB-GLD-CR',
                name: 'iPhone 8 64GB Gold',
                description: 'iPhone 8 64GB Gold',
                price: 230,
                stock: 0,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph8-64gb-gld-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Gold'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH8-64GB-RED-CR',
                name: 'iPhone 8 64GB Red',
                description: 'iPhone 8 64GB Red',
                price: 230,
                stock: 3,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph8-64gb-red-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Red'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH8-64GB-SIL-CR',
                name: 'iPhone 8 64GB Silver',
                description: 'iPhone 8 64GB Silver',
                price: 230,
                stock: 14,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph8-64gb-sil-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Silver'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH8-64GB-SPG-CR',
                name: 'iPhone 8 64GB Space Gray',
                description: 'iPhone 8 64GB Space Gray',
                price: 230,
                stock: 71,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph8-64gb-spg-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Space Gray'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXR-64GB-BLK-CR',
                name: 'iPhone XR 64GB Black',
                description: 'iPhone XR 64GB Black',
                price: 400,
                stock: 94,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxr-64gb-blk-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Black'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXR-64GB-BLU-CR',
                name: 'iPhone XR 64GB Blue',
                description: 'iPhone XR 64GB Blue',
                price: 400,
                stock: 0,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxr-64gb-blu-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Blue'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXR-64GB-COR-CR',
                name: 'iPhone XR 64GB Coral',
                description: 'iPhone XR 64GB Coral',
                price: 400,
                stock: 2,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxr-64gb-cor-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Coral'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXR-64GB-RED-CR',
                name: 'iPhone XR 64GB Red',
                description: 'iPhone XR 64GB Red',
                price: 400,
                stock: 2,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxr-64gb-red-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Red'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXR-64GB-WHT-CR',
                name: 'iPhone XR 64GB White',
                description: 'iPhone XR 64GB White',
                price: 400,
                stock: 14,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxr-64gb-wht-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'White'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXR-64GB-YEL-CR',
                name: 'iPhone XR 64GB Yellow',
                description: 'iPhone XR 64GB Yellow',
                price: 400,
                stock: 4,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxr-64gb-yel-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Yellow'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXS-64GB-GLD-CR',
                name: 'iPhone XS 64GB Gold',
                description: 'iPhone XS 64GB Gold',
                price: 450,
                stock: 4,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxs-64gb-gld-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Gold'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXS-64GB-SIL-CR',
                name: 'iPhone XS 64GB Silver',
                description: 'iPhone XS 64GB Silver',
                price: 450,
                stock: 33,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxs-64gb-sil-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Silver'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPHXS-64GB-SPG-CR',
                name: 'iPhone XS 64GB Space Gray',
                description: 'iPhone XS 64GB Space Gray',
                price: 450,
                stock: 33,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iphxs-64gb-spg-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    },
                    {
                        key: 'color',
                        value: 'Space Gray'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH11PM-64GB-GLD-CR',
                name: 'iPhone 12 64GB Red',
                description: 'iPhone 12 64GB Red',
                price: 750,
                stock: 5,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph11pm-64gb-gld-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH11PM-64GB-GRN-CR',
                name: 'iPhone 12 64GB Red',
                description: 'iPhone 12 64GB Red',
                price: 750,
                stock: 4,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph11pm-64gb-grn-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH11PM-64GB-SIL-CR',
                name: 'iPhone 12 64GB Red',
                description: 'iPhone 12 64GB Red',
                price: 750,
                stock: 49,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph11pm-64gb-sil-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-IPH11PM-64GB-SPG-CR',
                name: 'iPhone 12 64GB Red',
                description: 'iPhone 12 64GB Red',
                price: 750,
                stock: 54,
                brand: 'Apple',
                image: 'https://inventory-cdn.singularecommerce.net/sp-iph11pm-64gb-spg-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-GGL-PIX3-64GB-PINK-CR',
                name: 'Google Pixel 3 64GB',
                description: 'Google Pixel 3 64GB',
                price: 140,
                stock: 48,
                brand: 'Google',
                image: 'https://inventory-cdn.singularecommerce.net/sp-ggl-pix3-64gb-pink-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-GGL-PIX3-64GB-BLK-CR',
                name: 'Google Pixel 3 64GB',
                description: 'Google Pixel 3 64GB',
                price: 140,
                stock: 0,
                brand: 'Google',
                image: 'https://inventory-cdn.singularecommerce.net/sp-ggl-pix3-64gb-blk-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem,
            {
                type: 'Smartphone',
                sku: 'SP-GGL-PIX3XL-64GB-BLK-CR',
                name: 'Google Pixel 3 XL 64GB',
                description: 'Google Pixel 3 XL 64GB',
                price: 200,
                stock: 98,
                brand: 'Google',
                image: 'https://inventory-cdn.singularecommerce.net/sp-ggl-pix3xl-64gb-blk-cr.png',
                attributes: [
                    {
                        key: 'ram',
                        value: '64GB'
                    }
                ]
            } as ICatalogItem
        ],
        meta: {
            count: {
                total: 20,
                types: {
                    Smartphone: 20
                }
            }
        }
    } as ICatalog;
    const CATALOG_ITEM = {
        type: 'Smartphone',
        sku: 'SP-IPH8-64GB-GLD-CR',
        name: 'iPhone 8 64GB Gold',
        description: 'iPhone 8 64GB Gold',
        price: 230,
        stock: 0,
        brand: 'Apple',
        image: 'https://inventory-cdn.singularecommerce.net/sp-iph8-64gb-gld-cr.png',
        attributes: [
            {
                key: 'ram',
                value: '64GB'
            },
            {
                key: 'color',
                value: 'Gold'
            }
        ]
    } as ICatalogItem;
    beforeEach(waitForAsync(() => {
        mockCatalogService = jasmine.createSpyObj(['CatalogService', 'getCatalog']);
        TestBed.configureTestingModule({
            declarations: [DetailsComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
                AngularFireAuthModule,
                AngularFireDatabaseModule,
                ToastrModule.forRoot()
            ],
            providers: [
                { provide: ModalHelperService },
                { provide: EndpointUrl },
                HttpHandler,
                HttpClient,
                CatalogService
            ]
        });
        TestBed.overrideProvider(CatalogService, { useValue: mockCatalogService });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        spyOn(component.router, 'navigate');
        fixture.detectChanges();
        mockCatalogService.getCatalog.and.resolveTo(CATALOG);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check if there are phones returned by the catalog service', () => {
        component.catalogData = CATALOG.items;
        component.selectedPhoneFromCatalog = CATALOG.items[0];
        fixture.detectChanges();
        expect(component.selectedPhoneFromCatalog).toEqual(CATALOG_ITEM);
    });
    it('should check if the selected phone doesn’t exist in the catalog then the item not available banner should appear', waitForAsync(() => {
        component.selectedCapacityId = 'iphone8-64Gb';
        fixture.detectChanges();
        component.isAvailable = false;
        component.catalogData = CATALOG.items;
        component.selectedPhoneFromCatalog = CATALOG_ITEM;
        fixture.detectChanges();
        const notAvailable = fixture.debugElement.query(By.css('#not-available')).nativeElement;
        fixture.detectChanges();
        expect(notAvailable).toBeDefined();
        expect(component.selectedPhoneFromCatalog.stock).toEqual(0);
    }));
    it('should check if the selected phone has <= 5 in stock then the low in stock banner should appear', waitForAsync(() => {
        component.isLowStock = true;
        component.catalogData = CATALOG.items;
        component.selectedPhoneFromCatalog = CATALOG.items[1];
        fixture.detectChanges();
        const isLowStock = fixture.debugElement.query(By.css('#is-low-stock')).nativeElement;
        fixture.detectChanges();
        expect(isLowStock).toBeDefined();
        expect(component.selectedPhoneFromCatalog.stock).toEqual(3);
    }));
    it('should checks if the selected phone stock is > 5 then no banner should appear', waitForAsync(() => {
        component.selectedCapacityId = 'iphone8-64Gb';
        fixture.detectChanges();
        component.isLowStock = false;
        component.isAvailable = true;
        component.catalogData = CATALOG.items;
        component.selectedPhoneFromCatalog = CATALOG.items[2];
        fixture.detectChanges();
        const isLowStock = fixture.debugElement.query(By.css('#is-low-stock'));
        const notAvailable = fixture.debugElement.query(By.css('#not-available'));
        fixture.detectChanges();
        expect(isLowStock).toEqual(null);
        expect(notAvailable).toEqual(null);
        expect(component.selectedPhoneFromCatalog.stock).toEqual(14);
    }));
});
