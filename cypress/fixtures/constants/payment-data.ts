export const PAYMENT = {
    CREDIT_CARD: {
        VALID: {
            NAME_ON_CARD: 'trial name',
            PAN: '4111111111111111',
            CVV: '173',
            EXPIRY_DATE: '10',
            EXPIRY_YEAR: '26'

        },
        INVALID_CARD_NUMBER: {
            NAME_ON_CARD: 'Mirna Y Haddad',
            CARD_NUMBER: '0000000000000000',
            CVV: '123',
            EXPIRY_DATE: '10',
            EXPIRY_YEAR: '26'
        },
        INVALID_CVV: {
            NAME_ON_CARD: 'Mock GH BHaddad',
            PAN: '4111111111111111',
            CVV: '13',
            EXPIRY_DATE: '12',
            EXPIRY_YEAR: '25'
        },
        INVALID_CVV2: {
            NAME_ON_CARD: 'Mock GH BHaddad',
            PAN: '4111111111111111',
            CVV: '12',
            EXPIRY_DATE: '12',
            EXPIRY_YEAR: '25'
        },
        INVALID_CARD: {
            NAME_ON_CARD: '555',
            PAN: '4012888888881881',
            CVV: '12',
            EXPIRY_DATE: '12',
            EXPIRY_YEAR: '25'
        },
        VALID_MOCK: {
            NAME_ON_CARD: 'Mock GH BHaddad',
            PAN: '4111111111111111',
            CVV: '124',
            EXPIRY_DATE: '12',
            EXPIRY_YEAR: '25'
        },
        INVALID_DATE: {
            NAME_ON_CARD: 'Mirna Y Haddad',
            PAN: '4111111111111111',
            CVV: '123',
            EXPIRY_DATE: '03',
            EXPIRY_YEAR: '19'
        },
        INVALID_NAME: {
            NAME_ON_CARD: '12',
            PAN: '4111111111111111',
            CVV: '123',
            EXPIRY_DATE: '03',
            EXPIRY_YEAR: '24'
        },
        CARD_START_WITH_SPACE: {
            NAME_ON_CARD: ' Mirna Y Haddad',
            PAN: ' 4111111111111111',
            CVV: ' 123',
            EXPIRY_DATE: '10',
            EXPIRY_YEAR: '26',
        }
    },
    BILLING_DATA: {
        BILLING_START_WITH_SPACE: {
            NAME: ' Maroon Haddad',
            ADDRESS: ' 12300 Bermuda Road',
            SUITE_NO: ' 24',
            CITY: ' Henderson',
            STATE: ' NV',
            POSTAL: ' 89044'
        },
        VALID: {
            NAME: 'Maroon Haddad',
            ADDRESS: '12300 Bermuda Road',
            SUITE_NO: '24',
            CITY: 'Henderson',
            STATE: 'NV',
            POSTAL: '89044'
        },
        VALID_2: {
            NAME: 'Mirna Y Haddad',
            ADDRESS: '12340 Boggy Creek Road',
            SUITE_NO: '24',
            CITY: 'Orlando',
            STATE: 'FL',
            POSTAL: '32824'
        },
        VALID_3:{
            ADDRESS: '401 BISCAYNE BLVD',
            SUITE_NO:'11',
            CITY: 'MIAMI',
            STATE: 'FL',
            POSTAL:'33132'
        },
        VALID_4:{
            ADDRESS: '2207 Seymour Avenue',
            SUITE_NO:'11',
            CITY: 'CLEVELAND',
            STATE: 'OH',
            POSTAL:'44113'
        },
        VALID_PO_BOX: {
            NAME: 'William G Haddad',
            ADDRESS: 'PO Box 2951 U.S. 41',
            SUITE_NO: '24',
            CITY: 'Inverness',
            STATE: 'FL',
            POSTAL: '34450'
        },
        VALID_MOCK: {
            NAME: 'Bawwab Mock',
            ADDRESS: 'Old Navy',
            SUITE_NO: '21',
            CITY: 'New York',
            STATE: 'NY',
            POSTAL: '10001'
        },
        VALID_MOCK_2: {
            NAME: '112 Ocean Avenue',
            ADDRESS: 'mar',
            SUITE_NO: '11',
            CITY: 'Amityville',
            STATE: 'NY',
            POSTAL: '11701'
        },
        INVALID_DATA: {
            NAME: '112 Ocean Avenue',
            ADDRESS: 'mar',
            SUITE_NO: '11',
            CITY: '111',
            STATE: '222',
            POSTAL: 'MMM'
        },
        SPACE_BEFORE_CITY: {
            NAME: '112 Ocean Avenue',
            ADDRESS: 'mar',
            SUITE_NO: '11',
            CITY: ' Amityville',
            STATE: 'NY',
            POSTAL: '11701'
        },
        SPACE_BEFORE_POSTAL: {
            NAME: '112 Ocean Avenue',
            ADDRESS: 'mar',
            SUITE_NO: '11',
            CITY: 'Amityville',
            STATE: 'NY',
            POSTAL: ' 11701'
        },
        SPACE_BEFORE_STATE: {
            NAME: '112 Ocean Avenue',
            ADDRESS: 'mar',
            SUITE_NO: '11',
            CITY: 'Amityville',
            STATE: ' NY',
            POSTAL: '11701'
        },
        INVALID: {
            NAME: 'Mirna Haddad',
            ADDRESS: 'Old Navy',
            SUITE_NO: '21',
            CITY: '',
            STATE: 'NY',
            POSTAL: '10001'
        },
        INVALID_3: {
            NAME: 'ww',
            ADDRESS: '0000 Peachtree Industrial Boulevard',
            SUITE_NO: '11',
            CITY: 'Peachtree Corners',
            STATE: 'GA',
            POSTAL: '30071'
        }
    },
    VOUCHER: {
        VOUCHER_VALID: {
            VOUCHER_DISCOUNT_TEN: '838980450309', // 110616807508 // 605637199194
        },
        VOUCHER_INVALID: {
            INVALID_VOUCHER1: '532726565334',
            INVALID_VOUCHER_10: '838980450301',
        },

    },
};
