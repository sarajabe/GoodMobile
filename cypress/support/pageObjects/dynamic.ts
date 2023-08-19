const Dynamics = function(): void {
    let strEmail = '';
    this.makeNewEmail = () => {
        strEmail = 'e2e-';
        const strValues = 'a0123456789';
        let strTmp;
        for (let i = 0; i < 4; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            strEmail = strEmail + strTmp;
        }
        strTmp = '';
        strEmail = strEmail + '@';
        strTmp = 'pavocom';
        strEmail = strEmail + strTmp;
        strEmail = strEmail + '.com';
        return strEmail;
    };
    this.makeNewAcpEmail = () => {
        strEmail = 'e2e-acp';
        const strValues = '0123456789';
        let strTmp;
        for (let i = 0; i < 4; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            strEmail = strEmail + strTmp;
        }
        strTmp = '';
        strEmail = strEmail + '@';
        strTmp = 'pavocom';
        strEmail = strEmail + strTmp;
        strEmail = strEmail + '.com';
        return strEmail;
    };
    this.generateNewCvv = () => {
        let arr = '';
        while (arr.length <= 3) {
            const num = Math.floor(Math.random() * 100) + 1;
            arr = arr + num;
        }
        return arr;
    };
    this.generateNewName = () => {
        let name = '';
        const strValues = 'abcdefghijklmnopqrstuvwxyz';
        let strTmp;
        for (let i = 0; i < 10; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            name = name + strTmp;
        }
        return name;
    };
    this.generateNewAppId = () => {
        let appId = 'B';
        const strValues = '0123456789';
        let strTmp;
        for (let i = 0; i < 5; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            appId = appId + strTmp;
        };
        appId = appId + '-';
        for (let i = 0; i < 5; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            appId = appId + strTmp;
        };
        return appId;
    };
};
export default new Dynamics();
