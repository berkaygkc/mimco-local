const getAliases = require('../../entegrator/mimsoft/Aliases/getAliases');
const calculateXSLT = require('./calculateXslt');
const resolveToken = require('../../middlewares/mimsoft/resolveToken');

module.exports = (json) => {
    return new Promise(async (resolve, reject) => {
        let object;
        const tax_number = json.Parties[0].Identities[0].Value;
        const token = await resolveToken();
        getAliases(tax_number, token)
            .then(async (result) => {
                if (result.status == 200) {
                    object = {
                        invoiceProfile: 'TICARIFATURA',
                        alias: result.alias,
                        systemInvTypeCode: 1
                    }
                } else {
                    object = {
                        invoiceProfile: 'EARSIVFATURA',
                        alias: null,
                        systemInvTypeCode: 2
                    }
                }

                json['ProfileID'] = object.invoiceProfile;
                json['Alias'] = object.alias;
                json['SystemInvTypeCode'] = object.systemInvTypeCode;
                json['XSLTCode'] = await calculateXSLT(object.systemInvTypeCode);

                resolve(json);
            })
            .catch(err => {
                reject(err);
            })
    })
}