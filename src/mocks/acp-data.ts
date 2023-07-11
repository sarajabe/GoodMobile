import { IAcpDetails, IAcpUser } from "@ztarmobile/zwp-service-backend-v2";

export const FULL_USER_INFO: IAcpUser = {
    firstName: 'Mirna',
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