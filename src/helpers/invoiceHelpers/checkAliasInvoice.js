const getAliases = require('../../entegrator/mimsoft/Aliases/getAliases');
const db = require('../../sqlite/sqlite-db');
const connectRedis = require('../../redis/redis-pool');
const addZero = require('add-zero');
const calculateNumber = require('./calculateInvoiceNumber');
const calculateXSLT = require('./calculateXslt');

module.exports = (json) => {
    return new Promise(async (resolve, reject) => {
        let object;
        const tax_number = json.Parties[0].Identities[0].Value;
        connectRedis()
            .then(client => {
                client
                    .get('entegratorToken')
                    .then(result => {
                        getAliases(tax_number, result)
                            .then(async (result) => {
                                if (result == 200) {
                                    object = {
                                        invoiceProfile: 'TICARIFATURA',
                                        alias: result,
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
                                //json['InvoiceNumber'] = await calculateNumber(object.systemInvTypeCode);
                                json['XSLTCode'] = await calculateXSLT(object.systemInvTypeCode);
                                
                                resolve(json);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
}