export const SHIPPING = {
    SHIPPING_DATA: {
        NAME: 'Mirna Haddad',
        SHIPPING_ADDRESS: '1250 Waters Pl',
        SUITE_NO: '111',
        CITY: 'The Bronx',
        STATE: 'NY',
        POSTAL: '10461'
    },
    INVALID_SHIPPING_DATA: {
        NAME: 'Mirna Haddad12',
        SHIPPING_ADDRESS: '1250 Waters Pl',
        SUITE_NO: '111',
        CITY: '1234',
        STATE: '12',
        POSTAL: 'ABC'
    },
    VALID: {
        NAME: 'Maroon Haddad',
        ADDRESS: '12300 Bermuda Road',
        SUITE_NO: '24',
        CITY: 'Henderson',
        STATE: 'NV',
        POSTAL: '89044'
    },
    SHIPPING_DATA2: {
        NAME: 'William Bawwab',
        ADDRESS1: '1230 Peachtree Street Northeast',
        SUITE_NO: '111',
        CITY: 'Atlanta',
        STATE: 'GA',
        POSTAL: '30309'
    },
    SHIPPING_MOCK_DATA: {
        NAME: 'Mock G',
        SHIPPING_ADDRESS: 'High Park St 12',
        SUITE_NO: '222',
        CITY: 'Austin',
        STATE: 'TX',
        POSTAL: '73301'
    },
    UNRELATED_ADDRESS_CITY: {
        NAME: 'address',
        ADDRESS1: '401 BISCAYNE BLVD',
        SUITE_NO: '111',
        CITY: 'MIAMI',
        STATE: 'MM',
        POSTAL: '33132-1924'
    },
    UNRELATED_ADDRESS_STATE: {
        NAME: 'address',
        ADDRESS1: '401 BISCAYNE BLVD',
        SUITE_NO: '111',
        CITY: 'New York',
        STATE: 'FL',
        POSTAL: '33132-1924'
    },
    INVALID_ADDRESS: {
        NAME: 'address',
        ADDRESS1: '401 BISCAYNE BLVD',
        SUITE_NO: '111',
        CITY: '22',
        STATE: '22',
        POSTAL: 'NN'
    },
    PoBox:{
        NAME: 'example',
        ADDRESS: '1001 Filbert Street',
        SUITE_NO: 'falls',
        CITY: 'church',
        STATE: 'va',
        POSTAL: '22041'
    },
    CITY_BEGIN_WITH_SPACE:{
        NAME: 'Maroon Haddad',
        ADDRESS: '12300 Bermuda Road',
        SUITE_NO: '24',
        CITY: ' Henderson',
        STATE: 'va',
        POSTAL: '89044'
    },
    STATE_BEGIN_WITH_SPACE:{
        NAME: 'Maroon Haddad',
        ADDRESS: '12300 Bermuda Road',
        SUITE_NO: '24',
        CITY: ' Henderson',
        STATE: ' va',
        POSTAL: '89044'
    },
    POSTAL_BEGIN_WITH_SPACE:{
        NAME: 'example',
        ADDRESS: '1001 Filbert Street',
        SUITE_NO: 'falls',
        CITY: 'church',
        STATE: 'va',
        POSTAL: ' 22041'
    },
    ADDRESS_HAS_SPECIAL_CHARACTERS:{
        NAME: 'Maroon Haddad',
        ADDRESS: '12300 Bermuda Road',
        SUITE_NO: '24',
        CITY: '@Henderson',
        STATE: '@NV',
        POSTAL: '@89044'
    },
    ALLL_BEGIN_WITH_SPACE:{
        NAME: ' example',
        ADDRESS: ' 1001 Filbert Street',
        SUITE_NO: ' falls',
        CITY: ' church',
        STATE: ' va',
        POSTAL: ' 22041'
    },
    MILITARY_ADDRESS: {
        NAME: 'military',
        ADDRESS1: 'Unit 5850 #77, DPO, AE ',
        SUITE_NO: '111',
        CITY: 'DPO',
        STATE: 'AE',
        POSTAL: '09856'
    },
    PO_BOX_ADDRSS: {
        NAME: 'poBox',
        ADDRESS1: 'Po box 1001 falls church va 22041',
        SUITE_NO: '111',
        CITY: 'church',
        STATE: 'VA',
        POSTAL: '22041'
    },

};
