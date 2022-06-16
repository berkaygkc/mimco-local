const connect = require('../../connection');

module.exports = (uuids, token) => {
    return new Promise(async (resolve, reject) => {
        let details = [];
        for await (uuid of uuids) {
            await connect('get', `/earchive/${uuid}`, '', token)
            .then(response => {
                details.push(response.resultData.document);
            })
            .catch(err => {
                resolve(err)
            })
        }
        resolve(details)
        
    })
}