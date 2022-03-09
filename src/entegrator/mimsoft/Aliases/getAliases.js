const connect = require('../connection');
const connectRedis = require('../../../redis/redis-pool');


module.exports = (tax_number, token) => {
    return new Promise(async (resolve, reject) => {
        await connect('get', '/kep/' + tax_number, '', token)
            .then(response => {
                console.log(response);
                if (response.resultCode != 200) {
                    resolve(404);
                }
                for (record of response.resultData) {
                    if (record.role == 'PK' && record.document_type == 'Invoice') {
                        resolve(record.aliases[0].name);
                    }
                }
                resolve(404);
            })
            .catch(err => {
                resolve(404)
            })
    })
}