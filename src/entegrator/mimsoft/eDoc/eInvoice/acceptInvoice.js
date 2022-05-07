const connect = require('../../connection');


module.exports = (uuid, token) => {
    const body = {}
    return new Promise(async (resolve, reject) => {
        await connect('put', '/einvoice/'+uuid+'/reply', body, token)
            .then(response => {
               resolve(response)
            })
            .catch(err => {
                resolve(err)
            })
    })
}