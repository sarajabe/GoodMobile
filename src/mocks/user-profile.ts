import { IUser } from "@ztarmobile/zwp-service-backend";

export const USER: IUser = {
    customerId: 'A6426970504',
    email: 'mirna.haddad@pavocom.com',
    firstName: 'Mirna',
    id: 'zRIcMhANxvSmKnWTu7MJ7kEQ43u1',
    lastName: 'Haddad',
    paymentMethods: [
        {
            address1: '800 North 23rd Street',
            address2: '',
            alias: 'VISA Ending in 1111',
            brand: 'VISA',
            city: 'Philadelphia',
            country: 'United States',
            defaultCreditCard: false,
            expirationDate: '0430',
            fullName: 'Mirna Y haddad',
            id: '666114721020220224',
            isDefault: true,
            last4: 1234,
            lastUpdate: { date: 1645721456215 },
            method: 'Credit Card',
            name: 'rashed rabadi',
            postalCode: '19130',
            state: 'PA'
        }
    ],
    shippingAddresses: [
        {
            address1: '800 North 23rd Street',
            address2: '',
            city: 'Philadelphia',
            country: 'United States',
            id: '-MwfQeFE_JwD6NDxhPhp',
            isDefault: true,
            name: 'Mirna haddad',
            alias: 'Mirna haddad',
            postalCode: '19130',
            state: 'PA'
        }
    ],
    verified: false,
    fullName: 'Mirna Haddad'
};

export const USER_WITH_EBBID: IUser = {
    customerId: 'MockedId',
    firstName: 'William',
    email: 'william.bawwab@pavocom.com',
    lastName: 'Bawwab',
    verified: true,
    id: '123456789',
    preferredLanguage: '',
    ebbId: '123'
}

export const USER_PROFILE: IUser = {
    customerId: 'MockedId',
    firstName: 'William',
    email: 'william.bawwab@pavocom.com',
    lastName: 'Bawwab',
    verified: true,
    id: '123456789',
    preferredLanguage: ''
}