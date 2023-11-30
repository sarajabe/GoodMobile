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
    phoneNumber: '123',
    appId: 'abcs',
    schoolName: '1'
};
export const INVALID_MIN_VAL_FULL_USER_INFO = {
    firstName: '3',
    middleName: '33',
    lastName: 'M',
    consumerEmail: 'mirna-haddad',
    day: '32',
    month: '13',
    year: '2024',
    ssn: '44',
    tribal: '4',
    phoneNumber: '123',
    appId: 'abcs',
    schoolName: '1'
}
export const INVALID_FULL_USER_INFO_WITH_LENGTHS = {
    firstName: '333333333333333333333333333333333333333333333333333333333333333333',
    middleName: '333333333333333333333333333333333333333333333333333333333333333333',
    lastName: '333333333333333333333333333333333333333333333333333333333333333333',
    consumerEmail: 'mirna-haddad',
    day: '323',
    month: '132',
    year: '2024',
    ssn: '44222',
    tribal: '4493837973986911123jkbsjssssaaaaaaaaaaaaaaaaaaaaaa',
    phoneNumber: '123',
    appId: 'abcs'
};
export const VALID_DATA = {
    day: '13',
    month: '03',
    year: '1997',
    ssn: '1234',
    leapYear: '2000',
    schoolName: 'Abc1234',
    publicHousing: 'Public Housing'
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

export const E3_GENERIC_ELIGIBILiTY_CODES_DESCS = {
    code: 'E3', description: 'Supplemental Security'
};

export const E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS = [
    {
        code: 'E1', description: 'Medecaid'
    },
    {
        code: 'E2', description: 'Food Supplement Program'
    }
];

export const E2_SNAP_ELIGIBILiTY_CODES_DESCS = [
    {
        code: 'E2', description: 'Food Supplement Program'
    }
];

export const E1_MEDICAID_ELIGIBILiTY_CODES_DESCS = [
    {
        code: 'E1', description: 'Medecaid'
    }
];

export const E13_INCOME_ELIGIBILiTY_CODES_DESCS = [
    {
        code: 'E13', description: 'Eligibility Based on Income'
    }
];

export const E13_E3_INCOME_ELIGIBILiTY_CODES_DESCS = [
    { code: 'E3', description: 'Supplemental Security' },
    {
        code: 'E13', description: 'Eligibility Based on Income'
    }
];

export const E50_E51_Pell_ELIGIBILiTY_CODES_DESCS = [
    {
        code: 'E50', description: 'School Lunch/Breakfast Program'
    },
    {
        code: 'E51', description: 'Federal Pell Grant'
    }
];

export const ALL_GROUPS_ELIGIBILiTY_CODES_DESCS = [
    {
        code: 'E1', description: 'Medecaid'
    },
    {
        code: 'E2', description: 'Food Supplement Program'
    },
    { code: 'E4', description: 'Supplemental Security' },
    {
        code: 'E13', description: 'Eligibility Based on Income'
    },
    {
        code: 'E50', description: 'School Lunch/Breakfast Program'
    }
];

export const E1_E2_DESCS = ['Medecaid', 'Food Supplement Program'];

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

export const INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E3',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const E1_E2_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E1,E2',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const E2_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E2',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const E1_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E1',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const E13_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E13',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const E13_E3_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E3,E13',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const E50_E51_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E50,E51',
    user: USER_INFO,
    bqpUser: USER_INFO
};

export const ALL_GROUPS_INTERNAL_DATA: IAcpDetails = {
    eligibilityCode: 'E1,E2,E4,E13,E50',
    user: USER_INFO,
    bqpUser: USER_INFO
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

export const SIGNATURE_INFO = {
    fName: 'William',
    lName: 'Bawwab',
    consent: 'WB',
    invalidConsent: 'MM',
    wrongName: 'wrong na'
};

export const ACP_DOCUMENTS_MOCK = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b>.`,
        `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
        `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
    ],
    slides: [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }],
    text: ['Screenshot of Online Portal', 'Survivors Benefit Summary Letter']
};

export const ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E3 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b>.`,
        `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
        `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
    ],
    slides: [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }],
    text: ['Screenshot of Online Portal', 'Survivors Benefit Summary Letter'],
    category: ['Supplemental Security']
};

export const ACP_DOCUMENTS_MOCK_GENERIC_GROUP_E2_E1 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b>.`,
        `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
        `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
    ],
    slides: [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }],
    text: ['Screenshot of Online Portal', 'Survivors Benefit Summary Letter'],
    category: E1_E2_DESCS
};

export const ACP_DOCUMENTS_MOCK_SNAP_GROUP_E2 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b>.`,
        `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
        `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
    ],
    slides: [{ asset: 'snap-geniric.png', title: 'Approval or Benefit Letter:' }],
    text: [],
    category: [E2_SNAP_ELIGIBILiTY_CODES_DESCS[0].description]
};

export const ACP_DOCUMENTS_MOCK_MEDICAID_GROUP_E1 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b>.`,
        `The name of the <b>Government</b> or <b>Tribal Agency</b> that issued the document.`,
        `An issue date within the last <b>12 months</b> or a <b>future expiration date</b>.`
    ],
    slides: [{ asset: 'medcaid.png', title: 'Approval or Benefit Letter for Medicaid:' }],
    text: [],
    category: [E1_E2_GENERIC_ELIGIBILiTY_CODES_DESCS[0].description]
};

export const ACP_DOCUMENTS_MOCK_INCOME_GROUP_E13 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `<b>Current income</b> information (Monthly or annual income amount).`,
        `<b>3 consecutive months</b> of paystubs (if provided).`,
        `An issue date within the last <b>12 months</b> or <b>prior year’s tax document</b>.`
    ],
    slides: [{
        asset: 'income.png', title: `Prior year’s state, federal, or Tribal tax return or a Social Security Benefit Statement.`
    }],
    text: [],
    category: [E13_INCOME_ELIGIBILiTY_CODES_DESCS[0].description]
};

export const ACP_DOCUMENTS_MOCK_INCOME_GROUP_E50_E51 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b> (not required for Community Eligibility Provision).`,
        `The name of the <b>School</b> or <b>School district</b>.`,
        `A <b>current</b> award year (Pell Grant).`,
        `<b>Dated</b> for the <b>current school year</b> or the </b>school year immediately preceding the application</b> (for school lunch or breakfast qualifying programs).`,
        `<b>Address</b> & <b>Contact information</b> for the <b> school, school year</b>  for which the student is enrolled (require for Community Eligibility Provision).`
    ],
    slides: [{
        asset: 'pell-grant1.png', title: `For Federal Pell Grants, written confirmation from a student’s school (college or university, 
            community college, or career school) or the Department of 
            Education that the student has received a Pell Grant for the current award year.` },
    {
        asset: 'pell-grant2.png', title: `A letter from the school or school district that confirms that 
            a member of household receives free & reduced-price school
            lunch or school year immediately preceding the application`},
    {
        asset: 'pell-grant3.png', title: `For enrollment in a CEP school – School documentation on demonstrating 
            the student is enrolled in a CEP School for the relevant school year 
            (student must still be enrolled in the CEP school at the time of the application)`
    }],
    text: [],
    category: [E50_E51_Pell_ELIGIBILiTY_CODES_DESCS[0].description, E50_E51_Pell_ELIGIBILiTY_CODES_DESCS[1].description]
};

export const ACP_DOCUMENTS_MOCK_INCOME_GROUP_E50 = {
    proofs: [
        `Your <b>Name</b>, or your <b>Dependent’s Name</b>.`,
        `The name of the <b>Qualifying Program</b> (not required for Community Eligibility Provision).`,
        `The name of the <b>School</b> or <b>School district</b>.`,
        `A <b>current</b> award year (Pell Grant).`,
        `<b>Dated</b> for the <b>current school year</b> or the </b>school year immediately preceding the application</b> (for school lunch or breakfast qualifying programs).`,
        `<b>Address</b> & <b>Contact information</b> for the <b> school, school year</b>  for which the student is enrolled (require for Community Eligibility Provision).`
    ],
    slides: [{
        asset: 'pell-grant1.png', title: `For Federal Pell Grants, written confirmation from a student’s school (college or university, 
            community college, or career school) or the Department of 
            Education that the student has received a Pell Grant for the current award year.` },
    {
        asset: 'pell-grant2.png', title: `A letter from the school or school district that confirms that 
            a member of household receives free & reduced-price school
            lunch or school year immediately preceding the application`},
    {
        asset: 'pell-grant3.png', title: `For enrollment in a CEP school – School documentation on demonstrating 
            the student is enrolled in a CEP School for the relevant school year 
            (student must still be enrolled in the CEP school at the time of the application)`
    }],
    text: [],
    category: [E50_E51_Pell_ELIGIBILiTY_CODES_DESCS[0].description]
};
export const COMPLETE_STATUS = {
    status: 'COMPLETE'
}