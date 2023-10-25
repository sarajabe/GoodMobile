import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoresListComponent } from './stores-list.component';
import { AppState } from 'src/app/app.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EbbService } from '@ztarmobile/zwp-service-backend-v2';
import { EndpointUrl, ZMP_G2G_BFF_ENDPOINT_URL } from '@ztarmobile/zwp-service';
import { AuthHttp, SimpleAuthService } from '@ztarmobile/zwp-services-auth';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { ENV_FIREBASE_CONFIG } from 'src/environments/environment';
import { ContentfulService } from 'src/services/contentful.service';
import { STORES } from 'src/mocks';
import { of, throwError } from 'rxjs';

fdescribe('StoresListComponent', () => {
  let component: StoresListComponent;
  let fixture: ComponentFixture<StoresListComponent>;
  let contentfulService: ContentfulService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoresListComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(ENV_FIREBASE_CONFIG),
        AngularFireAuthModule
      ],
      providers: [AppState,
        SimpleAuthService,
        EbbService,
        { provide: ZMP_G2G_BFF_ENDPOINT_URL, useValue: true },
        AuthHttp,
        HttpClient,
        HttpHandler,
        { provide: AngularFireAuth },
        { provide: EndpointUrl, useValue: true },
        ContentfulService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StoresListComponent);
    component = fixture.componentInstance;
    contentfulService = TestBed.inject(ContentfulService);
    fixture.detectChanges();
  });

  it('Should create a component successfully', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
  it('Should check that the selelcted city is Albuquerque', waitForAsync(() => {
    expect(component.selectedCity).toEqual('Albuquerque');
  }));
  it('Should call getContent successfully and the length of allStores will be 2 even if its 3 but because the last store have a launchDate > today', waitForAsync(() => {
    spyOn(contentfulService, 'getContent').and.returnValue(of(STORES.storeLocations));
    spyOn(component, 'mapDate').and.callThrough();
    fixture.detectChanges();

    component.ngOnInit();
    expect(component.appState.loading).toBe(false);
    expect(component.allStores.length).toBe(2);
    expect(component.mapDate).toHaveBeenCalled();
  }));
  it('should handle error response', () => {
    const mockError = new Error('Test error message');
    spyOn(contentfulService, 'getContent').and.returnValue(throwError(mockError));
    component.ngOnInit();
    expect(component.appState.loading).toBe(false);
  });
  it('should validate cities form', () => {
    const citiesControl = component.storesForm.controls.cities;

    // Set an invalid value
    citiesControl.setValue('');
    fixture.detectChanges();

    // Expect the form to be invalid
    expect(citiesControl.valid).toBeFalsy();

    // Set a valid value
    citiesControl.setValue('SomeCity');
    fixture.detectChanges();

    // Expect the form to be valid
    expect(citiesControl.valid).toBeTruthy();
  });
  it('should invoke selectCity method', () => {
    const selectCitySpy = spyOn(component, 'selectCity');

    const citiesSelect = fixture.nativeElement.querySelector('.cities');
    const citiesControl = component.storesForm.controls.cities;

    citiesControl.setValue('SomeCity');
    fixture.detectChanges();

    // Trigger a change event
    citiesSelect.dispatchEvent(new Event('change'));

    // Expect the selectCity method to have been called
    expect(selectCitySpy).toHaveBeenCalled();
  });
  it('should conditionally apply the "scroll" class', () => {
    // Test when stores.length is less than or equal to 2
    component.stores = [];
    fixture.detectChanges();
    const storesSection = fixture.nativeElement.querySelector('.stores-section');
    expect(storesSection.classList.contains('scroll')).toBeFalsy();

    // Test when stores.length is greater than 2
    component.stores = STORES.storeLocationsMoreThanTwo;
    fixture.detectChanges();
    expect(storesSection.classList.contains('scroll')).toBeTruthy();
  });

  it('should conditionally apply the "border" class', () => {
    // Test when stores is falsy or stores.length is less than or equal to 1
    component.stores = [];
    fixture.detectChanges();
    const stores = fixture.nativeElement.querySelectorAll('.stores');
    stores.forEach((store) => {
      expect(store.classList.contains('border')).toBeFalsy();
    });

    // Test when stores is defined and stores.length is greater than 1
    component.stores = STORES.storeLocationsMoreThanTwo;
    fixture.detectChanges();
    stores.forEach((store) => {
      expect(store.classList.contains('border')).toBeTruthy();
    });
  });

  it('should display the correct number of stores and "store" or "stores"', () => {
    // When stores.length is 0
    component.stores = [];
    component.selectedCity = 'Some City';
    fixture.detectChanges();
    const captionElement = fixture.nativeElement.querySelector('.caption');
    expect(captionElement.textContent).toContain('0 store available in Some City');

    // When stores.length is 1
    component.selectedCity = 'Santa Fe';
    fixture.detectChanges();
    component.stores =STORES.STORE_IN_SANTA_FE;
    fixture.detectChanges();
    expect(captionElement.textContent).toContain(`1 store available in ${component.selectedCity}`);

    // When stores.length is greater than 1
    component.selectedCity = 'Albuquerque';
    fixture.detectChanges();
    component.stores = STORES.storeLocationsMoreThanTwo;
    fixture.detectChanges();
    expect(captionElement.textContent).toContain(`${component.stores.length} stores available in ${component.selectedCity}`);
  });
});
