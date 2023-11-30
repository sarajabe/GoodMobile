import { IUserDevice, IUserPlan } from "@ztarmobile/zwp-service-backend";

export const MOCK_USER_DEVICE: IUserDevice = {
    brand: 'Apple',
    equipmentType: '4GLTE',
    iccid: '8901240161103297611',
    iccidRequired: true,
    id: '353322079360104',
    manufacturer: 'Apple Inc',
    marketingName: 'Apple iPhone 6 (A1586)',
    migrationSimOrderDate: undefined,
    migrationSimOrderId: undefined,
    model: 'iPhone 6 (A1586)',
    network: 'tmo',
    networkType: 'GSM',
    os: 'ios',
    portRequired: false,
    postalCode: '73301',
    reCaptcha: undefined,
    serialType: 'imei',
    simNumber: undefined,
    skuIdentifier: 'T',
    skuNumber: 'SIMMGTTMO4GLTE',
    activationCode: '353322079360104',
    pendingNewSim: false,
    pendingMigrationSim: true
}

export const PLANS = [
    {
        id: 'mockedPlanID', autoRenewPlan: true, planDevice: MOCK_USER_DEVICE
    } as IUserPlan
];