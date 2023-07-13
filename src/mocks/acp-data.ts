import { IAcpDetails, IAcpUser } from "@ztarmobile/zwp-service-backend-v2";

export const SAVED_INFO: IAcpUser = {
    firstName: 'Mirna',
    lastName: 'Haddad',
    dob: '13/3/1997',
    last4ssn: '1243',
    consumerEmail: 'mirna-haddad@pavocom.com'
};

export const APPLICATION_ID = {
    ebbId: 'B12345-67890'
};

export const ACP_PHONE_NUMBER = '0123456789';

export const FULL_USER_INFO: IAcpUser = {
    firstName: 'Mirna',
    middleName: 'Ghaleb',
    lastName: 'Haddad',
    dob: '13/3/1997',
    last4ssn: '1243',
    consumerEmail: 'mirna-haddad@pavocom.com',
    address: {
        primary: {
            address1: '144 dallas texas',
            city: 'Dallas',
            state: 'TX',
            zipCode: '73301'
        },
        mail: {
            address1: '144 dallas texas',
            city: 'Dallas',
            state: 'TX',
            zipCode: '73301'
        }
    }
};

export const INVALID_FULL_USER_INFO = {
    firstName: '33',
    middleName: '33',
    lastName: '33',
    consumerEmail: 'mirna-haddad',
    day: '32',
    month: '13',
    year: '2024',
    ssn: '44',
    tribal: '4493837973986911123jkbsjssss',
    phoneNumber: '123'
};

export const VALID_DATA = {
    day: '13',
    month: '03',
    year: '1997',
    ssn: '1234',
    leapYear: '2000'
};

export const USER_INFO: IAcpUser = {
    firstName: 'Mirna',
    lastName: 'Haddad',
    dob: '13/3/1997',
    last4ssn: '1243',
    consumerEmail: 'mirna-haddad@pavocom.com'
};

export const ACP_DATA: IAcpDetails = {
    eligibilityCode: 'E3',
    user: FULL_USER_INFO,
    bqpUser: USER_INFO,
    signature: {
        initials: 'MH',
        signatureDate: '12-2-2023',
        firstName: 'Mirna',
        lastName: 'Haddad',
        fullName: 'Mirna Haddad'
    }
};

export const ELIGIBILiTY_CODES_OBJECT = {
    data: {
        eligibilityCodes: [
            { code: 'Medicaid ' }, { code: 'Supplemental Nutrition Assistance Program (SNAP) ' },
            { code: 'School Lunch/Breakfast Program ' },
            { code: 'Federal Public Housing Assistance ' }
        ]
    }
};

export const ELIGIBILiTY_CODES_DESCS = {
    code: 'E1', description: 'Medecaid'
};

export const PUBLIC_HOUSING_CODES_OBJECT = {
    housingPrograms: [
        {
            code: '1',
            description: 'Housing Choice Voucher Program'
        },
        {
            code: "2",
            description: 'Project-based rental assistance'
        }
    ]
};

export const INVALID_ADDRESS_INFO = {
    address1: '60284029840297492479274072047892047207429472984792847928749879274927492749274',
    address2: '60284029840297492479274072047892047207429472984792847928749879274927492749274',
    city: '6',
    state: '6',
    zipCode: '7'
};

export const VALID_ADDRESS_INFO = {
    address1: '123 dallas texas',
    address2: '',
    city: 'New York',
    state: 'NY',
    zipCode: '70012'
};