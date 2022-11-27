const Dynamics = function(): void {
    let strEmail = '';
    this.makeNewEmail = () => {
        strEmail = '';
        const strValues = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let strTmp;
        for (let i = 0; i < 10; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            strEmail = strEmail + strTmp;
        }
        strTmp = '';
        strEmail = strEmail + '@';
        for (let j = 0; j < 8; j++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            strEmail = strEmail + strTmp;
        }
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
};
export default new Dynamics();
