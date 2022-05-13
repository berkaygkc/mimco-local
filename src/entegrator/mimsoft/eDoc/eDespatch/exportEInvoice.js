const connect = require('../../connection');


module.exports = (uuid, type, token) => {
    return new Promise(async (resolve, reject) => {
        body = {
            uuid,
            type
        }
        await connect('post', '/einvoice.export', body, token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}